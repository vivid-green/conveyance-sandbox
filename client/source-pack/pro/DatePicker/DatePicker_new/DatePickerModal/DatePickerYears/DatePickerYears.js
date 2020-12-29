import React from 'react';
import { MDBBtn } from 'mdbreact';
import moment from 'moment';
import { takeThemeColor, takeAcutalDate } from '../../../../../utils';
import PropTypes from 'prop-types';

const DatePickerYears = ({
  scrolledYears,
  theme,
  yearsRef,
  animateYearScrolling,
  initialBoxYears,
  initialScrolledYears,
  initialActualDate,
  getUpdate,
  autoOk
}) => {
  const setActiveYear = e => {
    let _year = e.currentTarget.innerText;
    let _newDate = takeAcutalDate(initialActualDate).set('year', Number(_year));

    setTimeout(() => {
      getUpdate(_newDate, !autoOk, true);
    }, 300);
  };

  const initialScrolledYearsStyle = moment(initialActualDate).get('year');

  const thisYearStyles = year => {
    if (year === moment(new Date()).get('year')) {
      return {
        color: year === initialScrolledYearsStyle ? '#fff' : takeThemeColor(theme),
        border: `1px solid ${takeThemeColor(theme)}`,
        backgroundColor: year === initialScrolledYearsStyle ? takeThemeColor(theme) : ''
      };
    } else if (year === initialScrolledYearsStyle) {
      return {
        color: '#fff',
        border: `1px solid ${takeThemeColor(theme)}`,
        backgroundColor: takeThemeColor(theme)
      };
    }
  };

  return scrolledYears ? (
    <div
      style={{
        height: '263px',
        scrollBehavior: animateYearScrolling ? 'smooth' : 'auto',
        margin: 1,
        overflowY: 'scroll'
      }}
      ref={yearsRef}
      className='d-flex flex-wrap justify-content-center date-picker__scrollMobile-height'
    >
      {initialScrolledYears.map((year, i) => {
        return (
          <div key={year} className='date-picker__years'>
            <MDBBtn
              id={i}
              aria-label={year}
              flat
              onMouseDown={e => setActiveYear(e)}
              onClick={e => setActiveYear(e)}
              onTouchStart={e => setActiveYear(e)}
              rounded
              style={thisYearStyles(year)}
              className={year === initialScrolledYearsStyle && 'actual'}
            >
              {year}
            </MDBBtn>
          </div>
        );
      })}
    </div>
  ) : (
    <div ref={yearsRef}>
      {initialBoxYears.map((years, i) => {
        return (
          <div key={years + i} className='position-relative date-picker-grid'>
            {years.map((year, j) => {
              return (
                <div key={year} className='date-picker__years'>
                  <MDBBtn
                    id={j}
                    aria-label={year}
                    flat
                    key={year}
                    onMouseDown={e => setActiveYear(e)}
                    onTouchStart={e => setActiveYear(e)}
                    rounded
                    style={thisYearStyles(year)}
                    className={year === initialScrolledYearsStyle && 'actual'}
                  >
                    {year}
                  </MDBBtn>
                </div>
              );
            })}
          </div>
        );
      })}{' '}
    </div>
  );
};

export default DatePickerYears;

DatePickerYears.propTypes = {
  animateYearScrolling: PropTypes.bool,
  autoOk: PropTypes.bool,
  getUpdate: PropTypes.func,
  initialActualDate: PropTypes.any,
  initialBoxYears: PropTypes.array,
  initialScrolledYears: PropTypes.array,
  scrolledYears: PropTypes.bool,
  theme: PropTypes.string,
  yearsRef: PropTypes.node
};
