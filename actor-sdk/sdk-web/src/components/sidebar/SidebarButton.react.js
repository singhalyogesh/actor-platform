/*
 * Copyright (C) 2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';

class SidebarButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired,
    glyph: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
  }

  render() {
    const { onClick, title, glyph, className } = this.props;
    const buttonClassName = classnames('sidebar__button', className);

    return (
      <div className={buttonClassName} onClick={onClick}>
        <div className="sidebar__button__icon">
          <i className="material-icons">{glyph}</i>
        </div>
        <div className="sidebar__button__title">{title}</div>
      </div>
    );
  }
}

export default SidebarButton;
