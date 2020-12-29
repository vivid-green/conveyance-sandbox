import React from 'react';
import './Timeline.css';

const Timeline = props => {
  const { children, ...attributes } = props;

  return (
    <ul className='stepper stepper-vertical timeline pl-0' {...attributes}>
      {children}
    </ul>
  );
};

export default Timeline;
export { Timeline as MDBTimeline };
