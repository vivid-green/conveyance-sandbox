import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Collapse from '../../../../Collapse';
import Waves from '../../../../Waves';
import Fa from '../../../../Fa';
import SideNavContext from '../SideNavContext';
import { takeThemeColorOpacity } from '../../../../utils';

class SideNavCat extends React.Component {
  state = {
    cursorPos: {},
    isOpenIDState: '',
    isColor: false
  };

  static displayName = 'SideNavCat';

  componentDidUpdate(prevProps) {
    const { isOpen, id } = this.props;
    if (prevProps.isOpen !== isOpen) {
      this.setState({
        isOpenIDState: isOpen ? id : ''
      });
    }
  }

  handleClick = (e, id) => {
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
        this.props.onClick(id);
      }
      e.stopPropagation();
    }
  };
  setColor = isColor => {
    this.setState({ isColor });
  };

  render() {
    const {
      tag: Tag,
      children,
      className,
      name,
      icon,
      iconBrand,
      iconLight,
      iconRegular,
      iconSize,
      onClick,
      disabled,
      isOpen,
      isOpenID,
      color,
      id,
      style,
      ...attributes
    } = this.props;

    const { cursorPos, isOpenIDState, isColor } = this.state;
    const isColored = isColor && `text-${color}`;
    const classes = classNames(
      'collapsible-header-v5',
      'Ripple-parent',
      'arrow-r',
      isColored,
      isOpen && 'active',
      disabled && 'disabled',
      className
    );

    const bgStyle = { backgroundColor: isColor && takeThemeColorOpacity(color) };
    return (
      <SideNavContext.Consumer>
        {({ slim }) => {
          const iconClass = [`mr-2 ${isColored}`];
          slim && iconClass.push('v-slim-icon ');

          return (
            <Tag>
              <a
                className={classes}
                onClick={e => this.handleClick(e, id)}
                onMouseOver={() => this.setColor(true)}
                onMouseOut={() => this.setColor(false)}
                onBlur={() => this.setColor(false)}
                onFocus={() => this.setColor(true)}
                style={{ ...style, ...bgStyle }}
                {...attributes}
              >
                {icon && (
                  <div className='text-center' style={{ minWidth: 40, marginRight: -5 }}>
                    <Fa
                      icon={icon}
                      brand={iconBrand}
                      light={iconLight}
                      regular={iconRegular}
                      size={iconSize}
                      className={iconClass.join(' ')}
                    />
                  </div>
                )}
                {name}
                <Fa icon='angle-down' className='rotate-icon' />
                <Waves cursorPos={cursorPos} />
              </a>
              <Collapse id={id} isOpen={isOpenIDState}>
                <div className='collapsible-body-v5' style={{ display: 'block' }}>
                  <ul>{children}</ul>
                </div>
              </Collapse>
            </Tag>
          );
        }}
      </SideNavContext.Consumer>
    );
  }
}

SideNavCat.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconBrand: PropTypes.bool,
  iconLight: PropTypes.bool,
  iconRegular: PropTypes.bool,
  iconSize: PropTypes.string,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  isOpenID: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  tag: PropTypes.string
};

SideNavCat.defaultProps = {
  className: '',
  disabled: false,
  icon: '',
  iconBrand: false,
  iconLight: false,
  iconRegular: false,
  iconSize: '',
  id: '',
  isOpen: false,
  isOpenID: '',
  name: '',
  onClick: () => {},
  tag: 'li'
};

export default SideNavCat;
export { SideNavCat as MDBSideNavCat };
