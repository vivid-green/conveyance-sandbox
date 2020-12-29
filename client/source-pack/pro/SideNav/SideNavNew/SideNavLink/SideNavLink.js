import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Waves from '../../../../Waves';
import SideNavContext from '../SideNavContext';
import { takeThemeColorOpacity } from '../../../../utils';

class SideNavLink extends React.Component {
  state = {
    cursorPos: {},
    isColor: false
  };

  handleClick = e => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      // Waves - Get Cursor Position
      const cursorPos = {
        top: e.clientY,
        left: e.clientX,
        time: Date.now()
      };
      this.setState({ cursorPos });
      // do the passed in callback:
      if (onClick) {
        onClick(e);
      }
      e.stopPropagation();
    }
  };

  setColor = isColor => {
    this.setState({ isColor });
  };

  render() {
    const {
      children,
      className,
      innerRef,
      shortcut,
      tag: Tag,
      to,
      topLevel,
      link,
      href,
      color,
      style,
      ...attributes
    } = this.props;
    const { cursorPos, isColor } = this.state;

    const classes = classNames(
      'Ripple-parent',
      topLevel && 'collapsible-header-v5',
      isColor && `text-${color}`,
      className
    );
    const bgStyle = { backgroundColor: isColor && takeThemeColorOpacity(color) };

    const sideNavLink = (
      <SideNavContext.Consumer>
        {({ slim }) => {
          let shortcutVar;
          const { shortcut } = this.props;

          function calculateShortcut() {
            if (typeof children === 'string') {
              const wordsArray = children.toString().split(' ');

              if (wordsArray.length === 1) {
                return wordsArray[0].substr(0, 2).toUpperCase();
              }

              if (wordsArray.length >= 2) {
                const firstLetter = wordsArray[0].substr(0, 1);
                const secondLetter = wordsArray[1].substr(0, 1);
                return firstLetter.concat(secondLetter).toUpperCase();
              }
            }
            return children;
          }

          if (slim) {
            shortcutVar = shortcut || calculateShortcut();
          }

          return link ? (
            <Link
              className={classes}
              onMouseOver={() => this.setColor(true)}
              onMouseOut={() => this.setColor(false)}
              onBlur={() => this.setColor(false)}
              onFocus={() => this.setColor(true)}
              ref={innerRef}
              onClick={this.handleClick}
              to={to}
              style={{ ...style, ...bgStyle }}
              {...attributes}
            >
              {slim ? (
                <>
                  <span className='sv-slim-v5'>{shortcutVar}</span>
                  <span className='sv-normal-v5'>{children}</span>
                </>
              ) : (
                children
              )}
              <Waves cursorPos={cursorPos} />
            </Link>
          ) : (
            <a
              className={classes}
              ref={innerRef}
              href={href}
              {...attributes}
              onMouseOver={() => this.setColor(true)}
              onMouseOut={() => this.setColor(false)}
              onBlur={() => this.setColor(false)}
              onFocus={() => this.setColor(true)}
              style={{ ...style, ...bgStyle }}
            >
              {slim ? (
                <>
                  <span className='sv-slim-v5'>{shortcutVar}</span>
                  <span className='sv-normal-v5'>{children}</span>
                </>
              ) : (
                children
              )}
              <Waves cursorPos={cursorPos} />
            </a>
          );
        }}
      </SideNavContext.Consumer>
    );

    return topLevel ? <li> {sideNavLink}</li> : sideNavLink;
  }
}

SideNavLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  shortcut: PropTypes.string,
  tag: PropTypes.string,
  topLevel: PropTypes.bool
};

SideNavLink.defaultProps = {
  to: '#',
  topLevel: false,
  link: false
};

export default SideNavLink;
export { SideNavLink as MDBSideNavLink };
