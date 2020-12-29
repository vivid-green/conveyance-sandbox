import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Fa from '../../../Fa';
import './TimelineStep.css';

const TimelineStep = props => {
  const {
    href,
    color,
    icon,
    iconBrand,
    iconClass,
    iconLight,
    iconRegular,
    iconSize,
    circleClassName,
    stepContentClassName,
    className,
    children,
    inverted,
    colorful,
    stepContentStyle,
    hoverable,
    label,
    ...attributes
  } = props;

  const circleClasses = classNames('circle', 'z-depth-1-half', color || 'primary-color', circleClassName);

  const stepContentClasses = classNames(
    'step-content',
    !hoverable && 'z-depth-1',
    'ml-xl-1',
    colorful ? 'p-0 mt-2' : 'p-4',
    hoverable && 'hoverable',
    stepContentClassName
  );

  const liClasses = classNames(inverted && 'timeline-inverted', className);

  return (
    <li className={liClasses} {...attributes}>
      <a href={href}>
        <span className={circleClasses}>
          {icon && (
            <Fa
              icon={icon}
              size={iconSize}
              brand={iconBrand}
              light={iconLight}
              regular={iconRegular}
              className={iconClass}
            />
          )}
          {label}
        </span>
      </a>
      <div
        className={stepContentClasses}
        style={{
          marginLeft: colorful && '.1rem',
          ...stepContentStyle
        }}
      >
        {children}
      </div>
    </li>
  );
};

TimelineStep.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconBrand: PropTypes.bool,
  iconClass: PropTypes.string,
  iconLight: PropTypes.bool,
  iconRegular: PropTypes.bool,
  iconSize: PropTypes.string,
  size: PropTypes.string,
  stepContentStyle: PropTypes.object
};

TimelineStep.defaultProps = {
  href: '#'
};

export default TimelineStep;
export { TimelineStep as MDBTimelineStep };
