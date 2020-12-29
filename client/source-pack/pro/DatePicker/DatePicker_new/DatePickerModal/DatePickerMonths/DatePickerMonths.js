import React from 'react';
import moment from 'moment';
import { MDBBtn } from 'mdbreact';
import { takeThemeColor, takeAcutalDate } from '../../../../../utils';
import PropTypes from 'prop-types';

const DatePickerMonths = ({ initialActualDate, theme, getUpdate }) => {
  const allMonths = moment.monthsShort();
  const changedYear = takeAcutalDate(initialActualDate).get('year');
  const actualMonth = moment(new Date()).format('MMM');
  const changedMonth = moment(initialActualDate).format('MMM');

  const thisMonthsStyles = month => {
    if (month === actualMonth) {
      return {
        color: takeThemeColor(theme),
        border: `1px solid ${takeThemeColor(theme)}`
      };
    } else if (month === changedMonth) {
      return { backgroundColor: takeThemeColor(theme), color: '#fff' };
    }
  };

  const setActiveMonth = e => {
    const month = e.currentTarget.innerText;
    const _newDate = takeAcutalDate(initialActualDate).set('month', month);

    getUpdate(_newDate, false);
  };

  return (
    <div style={{ padding: 16, borderTop: '1px solid #ddd' }}>
      <div className='ml-2'>{changedYear}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '25% 25% 25% 25%', paddingTop: 10 }}>
        {allMonths.map(month => {
          return (
            <div key={month} className='date-picker__months'>
              <MDBBtn
                color={month === changedYear && theme}
                onClick={e => setActiveMonth(e)}
                rounded
                flat
                style={thisMonthsStyles(month)}
              >
                {month}
              </MDBBtn>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerMonths;

DatePickerMonths.propTypes = {
  getUpdate: PropTypes.func,
  initialActualDate: PropTypes.any,
  theme: PropTypes.string
};
