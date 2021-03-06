/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { isFunction, throttle } from 'lodash';

import React, { Component, PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import { MessageChangeReason } from '../../constants/ActorAppConstants';

import PeerUtils from '../../utils/PeerUtils';
import { getMessageState, isLastMessageMine } from '../../utils/MessageUtils';
import Scroller from '../common/Scroller.react';

import DefaultMessageItem from './messages/MessageItem.react';
import DefaultWelcome from './messages/Welcome.react';
import Loading from './messages/Loading.react';

class MessagesList extends Component {
  static contextTypes = {
    delegate: PropTypes.object.isRequired
  };

  static propTypes = {
    uid: PropTypes.number.isRequired,
    peer: PropTypes.object.isRequired,
    messages: PropTypes.shape({
      messages: PropTypes.array.isRequired,
      overlay: PropTypes.array.isRequired,
      count: PropTypes.number.isRequired,
      isLoaded: PropTypes.bool.isRequired,
      receiveDate: PropTypes.number.isRequired,
      readDate: PropTypes.number.isRequired,
      firstUnreadId: PropTypes.string,
      selected: PropTypes.object.isRequired,
      changeReason: PropTypes.oneOf([
        MessageChangeReason.UNKNOWN,
        MessageChangeReason.PUSH,
        MessageChangeReason.UNSHIFT,
        MessageChangeReason.UPDATE
      ]).isRequired
    }).isRequired,
    isMember: PropTypes.bool.isRequired,
    editMessage: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const { dialog } = context.delegate.components;
    if (dialog && dialog.messages) {
      this.components = {
        MessageItem: isFunction(dialog.messages.message) ? dialog.messages.message : DefaultMessageItem,
        Welcome: isFunction(dialog.messages.welcome) ? dialog.messages.welcome : DefaultWelcome
      };
    } else {
      this.components = {
        MessageItem: DefaultMessageItem,
        Welcome: DefaultWelcome
      };
    }

    this.state = {
      showScrollToBottom: false
    };

    this.dimensions = null;
    this.isLoading = false;

    this.onResize = this.onResize.bind(this);
    this.onScroll = throttle(this.onScroll.bind(this), 300);
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.peer !== this.props.peer ||
           nextProps.messages !== this.props.messages ||
           nextProps.isMember !== this.props.isMember ||
           nextProps.editMessage !== this.props.editMessage ||
           nextState.showScrollToBottom !== this.state.showScrollToBottom;
  }

  componentDidMount() {
    this.restoreScroll();
  }

  componentWillReceiveProps(nextProps) {
    if (!PeerUtils.equals(nextProps.peer, this.props.peer)) {
      console.debug('Peer changed, set dimensions to null');
      this.dimensions = null;
      this.isLoading = false;
    } else {
      console.debug('Update dimensions due messages will rerender');
      this.updateDimensions(this.refs.scroller.getDimensions());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showScrollToBottom !== this.state.showScrollToBottom) {
      return;
    }

    const { dimensions, refs: { scroller }, props: { uid, messages } } = this;

    if (messages.firstUnreadId && messages.firstUnreadId !== prevProps.messages.firstUnreadId) {
      if (this.refs.unread) {
        console.debug('Scroll to unread divider');
        this.refs.scroller.scrollToNode(this.refs.unread);
      } else {
        console.debug('Scroll to unread divider impossible');
      }
    } else if (messages.changeReason === MessageChangeReason.PUSH) {
      const _isLastMessageMine = isLastMessageMine(uid, messages);
      if (!dimensions || _isLastMessageMine) {
        console.debug('Scroll to bottom due new messages PUSH', { dimensions, _isLastMessageMine });
        this.scrollToBottom();
      }
    } else if (messages.changeReason === MessageChangeReason.UNSHIFT) {
      this.isLoading = false;
      if (dimensions) {
        const nextDimensions = scroller.getDimensions();
        console.debug('Restore scroll due messages unshift', { dimensions, nextDimensions });
        scroller.scrollTo(nextDimensions.scrollHeight - dimensions.scrollHeight);
      } else {
        console.debug('Scroll to bottom due messages have been UNSHIFT', { dimensions });
        this.scrollToBottom();
      }
    } else {
      console.debug('Restore scroll due messages UPDATE');
      this.restoreScroll();
    }
  }

  onScroll() {
    const dimensions = this.refs.scroller.getDimensions();
    this.updateDimensions(dimensions);
    if (!this.isLoading && dimensions.scrollTop < 100) {
      console.debug('Start loading more messages');
      this.isLoading = true;
      this.props.onLoadMore();
    }

    const showScrollToBottom = dimensions.scrollTop < dimensions.scrollHeight - (2 * dimensions.offsetHeight);

    if (showScrollToBottom !== this.state.showScrollToBottom) {
      this.setState({ showScrollToBottom });
    }
  }

  onResize() {
    const { dimensions, refs: { scroller } } = this;
    if (dimensions) {
      const ratio = dimensions.scrollTop / dimensions.scrollHeight;
      const nextDimensions = scroller.getDimensions();
      scroller.scrollTo(ratio * nextDimensions.scrollHeight);
      this.dimensions = nextDimensions;
      console.debug('Handle resize: fix scroll', { dimensions, ratio, nextDimensions });
    } else {
      scroller.scrollToBottom();
      console.debug('Handle resize: scroll to bottom', { dimensions });
    }
  }

  handleScrollToBottom() {
    this.refs.scroller.scrollToBottom();
  }

  renderHeader() {
    const { peer, isMember, messages } = this.props;

    if (!isMember) {
      return null;
    }

    if (messages.isLoaded) {
      const { Welcome } = this.components;
      return <Welcome peer={peer} key="header" />;
    }

    if (!messages.messages.length) {
      return null;
    }

    return <Loading key="header" />;
  }

  renderMessages() {
    const { uid, peer, editMessage, messages: { messages, overlay, count, selected, receiveDate, readDate, firstUnreadId } } = this.props;
    const { MessageItem } = this.components;

    const result = [];
    for (let index = messages.length - count; index < messages.length; index++) {
      const message = messages[index];
      if (message.rid === firstUnreadId) {
        result.push(
          <div className="unread-divider" ref="unread" key="unread">
            <div className="text">
              <i className="material-icons">expand_more</i>
              <FormattedMessage id="message.unread"/>
              <i className="material-icons">expand_more</i>
            </div>
          </div>
        );
      }

      const overlayItem = overlay[index];
      if (overlayItem && overlayItem.dateDivider) {
        result.push(
          <div className="date-divider" key={overlayItem.dateDivider}>
            {overlayItem.dateDivider}
          </div>
        );
      }

      result.push(
        <MessageItem
          peer={peer}
          message={message}
          state={getMessageState(message, uid, receiveDate, readDate)}
          isShort={overlayItem.useShort}
          isSelected={selected.has(message.rid)}
          isEditing={message === editMessage.message}
          onEdit={this.props.onEdit}
          onSelect={this.props.onSelect}
          key={message.sortKey}
        />
      );
    }

    return result;
  }

  renderScrollToBottomButton() {
    const { showScrollToBottom } = this.state;
    if (!showScrollToBottom) {
      return null;
    }

    return (
      <div className="chat__scroll-to-bottom" onClick={this.handleScrollToBottom}>
        <i className="material-icons">keyboard_arrow_down</i>
      </div>
    );
  }

  render() {
    return (
      <div className="chat__container">
        <Scroller
          className="chat__messages"
          ref="scroller"
          onScroll={this.onScroll}
          onResize={this.onResize}
        >
          {this.renderHeader()}
          {this.renderMessages()}
        </Scroller>
        {this.renderScrollToBottomButton()}
      </div>
    )
  }

  scrollToBottom() {
    this.dimensions = null;
    this.refs.scroller.scrollToBottom();
  }

  updateDimensions(dimensions) {
    if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
      console.debug('Update dimensions: lock scroll to bottom', { dimensions });
      this.dimensions = null;
    } else {
      console.debug('Update dimensions: set new dimensions', { dimensions });
      this.dimensions = dimensions;
    }
  }

  restoreScroll() {
    const { dimensions, refs: { scroller } } = this;

    if (dimensions) {
      scroller.scrollTo(dimensions.scrollTop);
    } else {
      scroller.scrollToBottom();
    }
  }
}

export default MessagesList;
