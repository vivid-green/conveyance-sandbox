/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SideNavContext from '../SideNavContext';
import './SideNavNav.css';
class SideNavNav extends React.Component {
  state = {
    accordion: null
  };

  onClick = number => () => {
    let state = '';
    if (this.state.accordion !== number) {
      state = number;
    } else {
      state = null;
    }
    this.setState({
      accordion: state
    });
  };

  render() {
    const { tag: Tag, toggleNavLabel, children, className, ...attributes } = this.props;

    const { accordion } = this.state;

    const classes = classNames('collapsible-v5', 'collapsible-accordion-v5', className);

    const modified = React.Children.map(children, (child, i) => {
      if (child.type.displayName === 'SideNavCat') {
        return React.cloneElement(child, {
          onClick: this.onClick(i),
          isOpen: accordion === i
        });
      }
      return child;
    });

    return (
      <SideNavContext.Consumer>
        {({ slim, slimInitial, toggleSlim, right }) => {
          const iconClass = ['mr-2', 'sv-slim-icon-v5', 'fas', 'icon-rotate'];
          right & slim && iconClass.push('fa-angle-double-left');
          right & !slim && iconClass.push('fa-angle-double-right');
          !right & !slim && iconClass.push('fa-angle-double-left');
          !right & slim && iconClass.push('fa-angle-double-right');

          return (
            <li>
              <Tag {...attributes} className={classes}>
                {modified}
              </Tag>
            </li>
          );
        }}
      </SideNavContext.Consumer>
    );
  }
}

SideNavNav.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.string,
  toggleNavLabel: PropTypes.string
};

SideNavNav.defaultProps = {
  tag: 'ul',
  toggleNavLabel: 'Minimize menu'
};

export default SideNavNav;
export { SideNavNav as MDBSideNavNav };
