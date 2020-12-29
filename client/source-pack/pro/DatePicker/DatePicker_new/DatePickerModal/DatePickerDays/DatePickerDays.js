import React from 'react';
import { MDBBtn } from 'mdbreact';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const DatePickerDays = ({
  initialWeekDays,
  initialDayDate,
  monthDaysRef,
  initialActualDate,
  theme,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  format,
  getUpdate,
  autoOk,
  disabledDates
}) => {
  const setActive = e => {
    const date = initialDayDate
      .flat()
      .filter(el => moment(el.day).format(format) === e.currentTarget.getAttribute('aria-label'))[0].day;

    getUpdate(moment(date), !autoOk);
  };

  const IS_FLAT = day => !moment(day).isSame(moment(initialActualDate), 'date') || day === '' || !day;
  const SET_COLOR = day => (day && moment(day).isSame(moment(initialActualDate), 'date') && theme) || '';

  const dayClasses = (days, i) => {
    const { day, id } = days;
    let DISABLED_DATES;

    const FUTURE = day && disableFuture && moment(day._d).isAfter(new Date(), 'date');
    const PAST = day && disablePast && moment(day._d).isBefore(new Date(), 'date');
    const TODAY = day && moment(day._d).isSame(new Date(), 'date');
    const ACTUAL = day && moment(day).isSame(moment(initialActualDate), 'date');

    const MIN = day && moment(day._d).isBefore(moment(minDate), 'date');
    const MAX = day && moment(day._d).isAfter(moment(maxDate), 'date');
    const ifDisabled = disabledDates && disabledDates.length > 0;

    if (ifDisabled) {
      DISABLED_DATES = disabledDates
        .map(dates =>
          day && moment(day._d).isSame(moment(dates)._d, 'date') ? { ...days, disabled: true } : { ...days }
        )
        .filter(({ disabled }) => disabled);
    }

    return classNames(
      'text-center',
      'p-0',
      (id === '' || FUTURE || PAST || MIN || MAX || (ifDisabled && DISABLED_DATES[0])) && 'disabled text-black-50',
      TODAY && !ACTUAL && `${theme}-text`
    );
  };

  return (
    <div className='date-picker__table-wrapper'>
      <table
        className='date-picker__table'
        id='picker-example_table'
        role='grid'
        aria-controls='picker-example'
        aria-readonly='true'
      >
        <thead>
          <tr>
            {initialWeekDays.map((dayWeek, key) => (
              <th key={key} className='picker__weekday grey-text font-weight-normal' scope='col'>
                <small>{moment.weekdaysMin()[key]}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initialDayDate.map((tr, key) => (
            <tr
              key={key}
              ref={ref => {
                monthDaysRef[key] = ref;
              }}
            >
              {tr.map((td, id) => {
                return (
                  <td key={id + id}>
                    {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                    <MDBBtn
                      rounded
                      flat={IS_FLAT(td.day)}
                      color={SET_COLOR(td.day)}
                      onMouseDown={setActive}
                      onTouchStart={setActive}
                      onClick={setActive}
                      aria-label={moment(td.day).format(format)}
                      className={dayClasses(td)}
                      style={{
                        height: 36,
                        width: 36,
                        margin: 0
                      }}
                      tabIndex={td.id !== '' ? 0 : -1}
                    >
                      {td.id}
                    </MDBBtn>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatePickerDays;

DatePickerDays.propTypes = {
  autoOk: PropTypes.bool,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  format: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
  getUpdate: PropTypes.func,
  initialActualDate: PropTypes.any,
  initialDayDate: PropTypes.array,
  initialWeekDays: PropTypes.array,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  monthDaysRef: PropTypes.any,
  theme: PropTypes.string
};
