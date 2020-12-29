import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import ScrollBar from '../../PerfectScrollbar';
import SideNavContext from './SideNavContext';
import './SideNav.css';

class SideNav extends React.Component {
  isOpen = () => {
    const { fixed, breakWidth, responsive, triggerOpening } = this.props;
    if (fixed) {
      if (window.innerWidth <= breakWidth) {
        return !responsive;
      }
      return true;
    }
    if (triggerOpening) {
      if (window.innerWidth > breakWidth) {
        return true;
      }
      return false;
    }
    return false;
  };

  state = {
    initiallyFixed: this.props.fixed,
    isFixed: !this.isOpen() ? false : this.props.fixed,
    isOpen: this.isOpen(),
    cursorPos: {},
    slimStart: this.props.slim,
    slimInitial: this.props.slim,
    slimInitialOpen: this.props.openNav,
    isOverlay: true || this.props.showOverlay
  };

  sideNavRef = React.createRef();
  initialX = null;
  initialY = null;

  componentDidMount() {
    const { triggerOpening, responsive, side } = this.props;
    const { slimInitialOpen, isOpen } = this.state;
    if (triggerOpening && !responsive) {
      throw new Error(
        'Received "triggerOpening" prop for a  non-responsive Sidebar. If you want to contidionally render Sidenav, set the responsive prop to true'
      );
    }
    if (slimInitialOpen) {
      this.setState({
        slimStart: !slimInitialOpen,
        slimInitial: slimInitialOpen,
        slimInitialOpen: !slimInitialOpen
      });

      const sidenav = document.getElementById(this.sideNavRef.current.id);

      sidenav.classList.remove('slim-v5');
    }

    this.sideNavRef.current.addEventListener('touchstart', this.startTouch);
    this.sideNavRef.current.addEventListener('touchmove', this.moveTouch);
    window.addEventListener('resize', this.updatePredicate);

    if (side && isOpen) {
      this.setState({ isOverlay: false });
    }
  }

  startTouch = e => {
    this.initialX = e.touches[0].clientX;
    this.initialY = e.touches[0].clientY;
  };

  moveTouch = e => {
    const { right } = this.props;
    if (this.initialX === null) {
      return;
    }

    if (this.initialY === null) {
      return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = this.initialX - currentX;
    const diffY = this.initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        !right && this.handleOverlayClick();
      } else {
        right && this.handleOverlayClick();
      }
    }

    this.initialX = null;
    this.initialY = null;

    e.preventDefault();
  };

  componentDidUpdate(prevProps, prevState) {
    const { triggerOpening, side, sideNavWidth, push, showOverlay } = this.props;
    const { isOpen, slimInitial } = this.state;

    if (prevProps.triggerOpening !== triggerOpening) {
      this.setState({
        isOpen: !isOpen
      });
    }
    if (isOpen && prevState.isOpen !== isOpen) {
      this.setState({ isOverlay: showOverlay });

      if (side || push) {
        document.body.classList.add('sidenav-transition-body');
      }
      if (side) {
        document.body.style.cssText = `margin-left: ${sideNavWidth}px; margin-right: 0px;`;
      }
      if (push) {
        document.body.style.cssText = `margin-left: ${sideNavWidth}px; margin-right: ${-sideNavWidth}px;`;
      }
    } else if ((push || side) && !isOpen && prevState.isOpen !== isOpen) {
      document.body.style.cssText = '';
    }

    if (prevState.slimInitial !== slimInitial) {
      this.setState({ slimInitial });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
    this.sideNavRef.current.removeEventListener('touchstart', this.startTouch);
    this.sideNavRef.current.removeEventListener('touchmove', this.moveTouch);
  }

  updatePredicate = () => {
    const { hidden, responsive, breakWidth } = this.props;
    const { initiallyFixed } = this.state;
    if (!hidden && responsive) {
      this.setState({ isOpen: window.innerWidth > breakWidth });

      if (window.innerWidth > breakWidth) {
        this.setState({ isOpen: true, isFixed: initiallyFixed });
      } else {
        this.setState({
          isOpen: false,
          isFixed: false
        });
      }
    }
  };

  toggleSlim = bool => () => {
    // const { slimStart } = this.state;

    const sidenav = document.getElementById(this.sideNavRef.current.id);
    sidenav.classList.toggle('slim-v5');

    this.setState({ slimStart: true });
  };

  handleOverlayClick = () => {
    const { isFixed } = this.state;
    const { onOverlayClick } = this.props;

    if (isFixed) {
      return;
    }
    this.setState({
      isOpen: false
    });
    if (onOverlayClick) {
      onOverlayClick();
    }
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
    }
    e.stopPropagation();
  };

  render() {
    const {
      bg,
      breakWidth,
      children,
      className,
      fixed,
      hidden,
      href,
      logo,
      onOverlayClick,
      openNav,
      responsive,
      right,
      showOverlay,
      mask,
      maskColor,
      slim,
      tag: Tag,
      triggerOpening,
      sideNavWidth,
      style,
      push,
      side,
      fixedHeader,
      dark,
      ...attributes
    } = this.props;

    const { isOpen, isFixed, slimInitial, slimStart, isOverlay } = this.state;

    const classes = classNames(
      'side-nav-v5',
      'wide-v5',
      right && 'right-aligned-v5',
      slimStart && 'slim-v5',
      dark && 'mdb-color darken-4',
      className
    );
    const overlay = <div id='sidenav-overlay-v5' onClick={this.handleOverlayClick} />;

    const renderLogo = () => {
      return (
        logo && (
          <div className='logo-wrapper-v5 d-flex align-items-center'>
            <img src={logo} alt='logo' className='img-fluid' />
          </div>
        )
      );
    };

    const sidenav = (
      <Tag
        {...attributes}
        ref={this.sideNavRef}
        className={classes}
        data-animate={isFixed ? false : undefined}
        style={{ width: sideNavWidth, backgroundImage: bg && `url(${bg}`, ...style }}
        onMouseOver={slim ? this.toggleSlim(true) : () => {}}
        onMouseOut={slim ? this.toggleSlim() : () => {}}
        onFocus={() => {}}
        onBlur={() => {}}
      >
        {!fixedHeader ? (
          <ScrollBar option={{ suppressScrollX: true }} style={{ padding: 10 }}>
            {renderLogo()}
            <ul style={{ color: dark ? '#fff' : '#607d8b' }}>{children}</ul>
          </ScrollBar>
        ) : (
          <>
            {renderLogo()}
            <ScrollBar option={{ suppressScrollX: true }} style={{ padding: 10 }}>
              <ul style={{ color: dark ? '#fff' : '#607d8b' }}>{children}</ul>
            </ScrollBar>
          </>
        )}{' '}
        {bg && mask && <div className={`sidenav-bg-v5 mask-${mask}`} style={{ width: sideNavWidth }} />}
        {maskColor && <div className={`sidenav-bg-v5 ${maskColor}`} style={{ width: sideNavWidth }} />}
      </Tag>
    );

    return (
      <SideNavContext.Provider
        value={{
          slimInitial,
          slim: slimStart,
          toggleSlim: this.toggleSlim,
          right
        }}
      >
        {isFixed ? (
          sidenav
        ) : (
          <CSSTransition
            appear={!isFixed}
            timeout={{ enter: 400, exit: 400 }}
            classNames={right ? 'right-side-slide-v5' : 'side-slide-v5'}
            in={isOpen}
          >
            {sidenav}
          </CSSTransition>
        )}
        {isOverlay && isOpen && overlay}
      </SideNavContext.Provider>
    );
  }
}

SideNav.propTypes = {
  bg: PropTypes.string,
  breakWidth: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  fixed: PropTypes.bool,
  hidden: PropTypes.bool,
  href: PropTypes.string,
  logo: PropTypes.string,
  onOverlayClick: PropTypes.func,
  openNav: PropTypes.bool,
  responsive: PropTypes.bool,
  right: PropTypes.bool,
  showOverlay: PropTypes.bool,
  slim: PropTypes.bool,
  tag: PropTypes.string,
  triggerOpening: PropTypes.bool
};

SideNav.defaultProps = {
  sideNavWidth: 240,
  bg: '',
  breakWidth: 1400,
  className: '',
  fixed: false,
  hidden: false,
  href: '#',
  logo: '',
  onOverlayClick: () => {},
  openNav: false,
  responsive: true,
  right: false,
  showOverlay: true,
  slim: false,
  tag: 'div',
  triggerOpening: false,
  fixedHeader: false
};

export default SideNav;
export { SideNav as MDBSideNav };
