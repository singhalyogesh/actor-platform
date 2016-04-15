/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { isFunction, debounce } from 'lodash';

import React, { Component, PropTypes } from 'react';

import { MessageChangeReason } from '../../constants/ActorAppConstants';
import PeerUtils from '../../utils/PeerUtils';

import Scroller from '../common/Scroller.react';

import MessageGroup from './MessageGroup.react';
import DefaultWelcome from './messages/Welcome.react';
import Loading from './messages/Loading.react';

function isLastMessageMine(uid, { messages }) {
  const lastMessage = messages[messages.length - 1];
  return lastMessage && uid === lastMessage.sender.peer.id;
}

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
      selected: PropTypes.object.isRequired,
      changeReason: PropTypes.oneOf([
        MessageChangeReason.UNKNOWN,
        MessageChangeReason.PUSH,
        MessageChangeReason.UNSHIFT,
        MessageChangeReason.UPDATE
      ]).isRequired
    }).isRequired,
    isMember: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const { dialog } = context.delegate.components;
    if (dialog && dialog.messages) {
      this.components = {
        Welcome: isFunction(dialog.messages.welcome) ? dialog.messages.welcome : DefaultWelcome
      };
    } else {
      this.components = {
        Welcome: DefaultWelcome
      };
    }

    this.dimensions = null;
    this.isLoading = false;

    this.onScroll = debounce(this.onScroll.bind(this), 5, { maxWait: 30 });
    this.onResize = this.onResize.bind(this);
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.peer !== this.props.peer ||
           prevProps.messages !== this.props.messages ||
           prevProps.isMember !== this.props.isMember;
  }

  componentDidMount() {
    this.restoreScroll();
  }

  componentWillReceiveProps(nextProps) {
    if (!PeerUtils.equals(nextProps.peer, this.props.peer)) {
      this.dimensions = null;
      this.isLoading = false;
    }
  }

  componentDidUpdate() {
    const { dimensions, refs: { scroller }, props: { uid, messages } } = this;

    if (messages.changeReason === MessageChangeReason.PUSH) {
      if (!dimensions || isLastMessageMine(uid, messages)) {
        scroller.scrollToBottom();
      }
    } else if (messages.changeReason === MessageChangeReason.UNSHIFT) {
      this.isLoading = false;
      if (dimensions) {
        const currDimensions = scroller.getDimensions();
        scroller.scrollTo(currDimensions.scrollHeight - dimensions.scrollHeight);
      }
    } else {
      this.restoreScroll();
    }
  }

  onScroll() {
    const dimensions = this.refs.scroller.getDimensions();
    if (dimensions.scrollHeight === dimensions.scrollTop + dimensions.offsetHeight) {
      this.dimensions = null;
    } else {
      this.dimensions = dimensions;
    }

    if (!this.isLoading && dimensions.scrollTop < 100) {
      this.isLoading = true;
      this.props.onLoadMore();
    }
  }

  onResize() {
    const { dimensions, refs: { scroller } } = this;
    if (dimensions) {
      const ratio = dimensions.scrollTop / dimensions.scrollHeight;
      const nextDimensions = scroller.getDimensions();
      scroller.scrollTo(ratio * nextDimensions.scrollHeight);
      this.dimensions = nextDimensions;
    } else {
      scroller.scrollToBottom();
    }
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
    const { uid, peer, messages: { messages, overlay, count, selected, receiveDate, readDate } } = this.props;

    const result = [];

    let group = [];
    for (let index = messages.length - count; index < messages.length; index++) {
      const overlayItem = overlay[index];
      if (overlayItem.dateDivider) {
        result.push(
          <div className="date-divider" key={overlayItem.dateDivider}>
            {overlayItem.dateDivider}
          </div>
        );
      }

      group.push(messages[index]);

      const nextOverlay = overlay[index + 1];
      if ((!nextOverlay || !nextOverlay.useShort) && group.length) {
        result.push(
          <MessageGroup
            uid={uid}
            peer={peer}
            messages={group}
            selected={selected}
            readDate={readDate}
            receiveDate={receiveDate}
            onSelect={this.props.onSelect}
            key={group[group.length - 1].sortKey}
          />
        );

        group = [];
      }
    }

    return result;
  }

  render() {
    return (
      <Scroller
        className="chat__messages"
        ref="scroller"
        onScroll={this.onScroll}
        onResize={this.onResize}
      >
        {this.renderHeader()}
        {this.renderMessages()}
      </Scroller>
    )
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
