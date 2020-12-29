import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Waves from '../../../../Waves';
import { takeThemeColorOpacity } from '../../../../utils';

const SideNavItem = props => {
  const [cursorPos, setCursorPos] = useState({});
  const [isColor, setIsColor] = useState(false);

  const handleClick = e => {
    const { disabled, onClick } = props;
    if (!disabled) {
      // Waves - Get Cursor Position
      const cursorPos = {
        top: e.clientY,
        left: e.clientX,
        time: Date.now()
      };
      setCursorPos(cursorPos);
      // do the passed in callback:
      if (onClick) {
        onClick(e);
      }
      e.stopPropagation();
    }
  };

  const setColor = isColor => {
    setIsColor(isColor);
  };

  const { children, className, href, innerRef, tag: Tag, color, style, ...attributes } = props;
  const classes = classNames('Ripple-parent', isColor && `text-${color}`, className);
  const bgStyle = { backgroundColor: isColor && takeThemeColorOpacity(color) };

  return (
    <Tag className={classes} ref={innerRef} onClick={handleClick} {...attributes}>
      <a
        className={classes}
        href={href}
        onMouseOver={() => setColor(true)}
        onMouseOut={() => setColor(false)}
        onBlur={() => setColor(false)}
        onFocus={() => setColor(true)}
        style={{ ...style, ...bgStyle }}
      >
        {children}
        <Waves cursorPos={cursorPos} />
      </a>
    </Tag>
  );
};

SideNavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  tag: PropTypes.string
};

SideNavItem.defaultProps = {
  tag: 'li'
};

export default SideNavItem;
export { SideNavItem as MDBSideNavItem };
