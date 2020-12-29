import { MDBBtn, MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import { makeFirstLetterUpper, makeRandomID, takeThemeColor, takeAcutalDate } from '../../../../utils';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DatePickerYears from './DatePickerYears/DatePickerYears';
import DatePickerDays from '././DatePickerDays/DatePickerDays';
import DatePickerMovedButtons from './DatePickerMovedButtons/DatePickerMovedButtons';
import DatePickerFooter from './DatePickerFooter/DatePickerFooter';
import FocusTrap from 'focus-trap-react';
import DatePickerMonths from './DatePickerMonths/DatePickerMonths';

export default class DatePickerModal extends Component {
  state = {
    initialActualDate: null || this.props.actualDate,
    initialDayDate: [] || this.props.dayDate,
    initialGetYears: false,
    initialBoxYears: [] || this.props.yearsArray,
    initialScrolledYears: [] || this.props.years,
    initialModalOpen: this.props.modalOpen,
    initialWeekDays: [] || this.props.weekDays,
    initialLastDate: this.props.lastDate,
    initialMonthDate: false,
    width: 0,
    height: 0,
    firstRandomID: makeRandomID(),
    secondRandomID: makeRandomID()
  };

  monthDaysRef = [];
  yearsRef = createRef();
  inlinePicker = createRef();

  componentDidMount() {
    const { minDate, maxDate, inline, locale, actualDate } = this.props;
    const { initialModalOpen } = this.state;

    this.addYears(moment(minDate).get('years'), moment(maxDate).get('years'), true);
    this.makeYears();

    this.setState({
      initialActualDate: actualDate,
      initialDayDate: this.makeMonth(actualDate || new Date()),
      initialWeekDays: moment.localeData(locale).weekdays()
    });

    if (inline && initialModalOpen) {
      this.checkPositionInline();
    }

    document.body.classList.add('date-picker-body-disable-scroll');
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.keyboardChangeDate);
    window.addEventListener('resize', this.updateDimensions);
  }
  componentDidUpdate(prevProps, prevState) {
    const { initialActualDate, initialModalOpen, height, width } = this.state;
    const { value, modalOpen, getModalOpen, getActualDate, inputValue } = this.props;

    if (value !== prevProps.value) {
      this.setState({
        initialActualDate: value,
        initialDayDate: this.makeMonth(value)
      });
    }

    if (prevProps.inputValue !== inputValue) {
      this.setState({
        initialActualDate: inputValue,
        initialDayDate: this.makeMonth(inputValue)
      });
    }

    if (prevProps.modalOpen !== modalOpen) {
      this.setState({ initialModalOpen: modalOpen });
    }

    if (prevState.width !== width || prevState.height !== height) {
      this.checkPositionInline();
    }

    if (prevState.initialActualDate !== initialActualDate) {
      getActualDate(initialActualDate);
    }

    if (prevState.initialModalOpen !== initialModalOpen) {
      getModalOpen(initialModalOpen);
    }
  }
  componentWillUnmount() {
    document.body.classList.remove('date-picker-body-disable-scroll');
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('scroll resize', this.checkPositionInline);
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  changeMonth = step => {
    const { initialActualDate } = this.state;

    const NEW_MONTH = takeAcutalDate(initialActualDate)
      .add(step, 'months')
      .set({ date: step > 0 ? 1 : 0 });
    this.setState({
      initialActualDate: NEW_MONTH,
      initialDayDate: this.makeMonth(NEW_MONTH._d)
    });
  };

  makeMonth = date => {
    let month = [];
    let dayDate = [];
    let firstDayID = Number(
      moment(date)
        .startOf('month')
        .format('d')
    );
    let days = moment(date).daysInMonth();

    for (let i = 0; i < firstDayID; i++) {
      month.push('');
    }
    for (let i = 0; i < days; i++) {
      month.push(i + 1);
    }

    while (month.length > 0) {
      let arr = [];

      for (let i = 0; i < 7; i++) {
        let day = month.shift();
        let data = {
          id: day || '',
          day:
            day &&
            moment(date)
              .locale(this.props.locale)
              .set('date', day)
        };
        arr.push(data);
      }
      dayDate.push(arr);
    }
    return dayDate;
  };

  addYears = (from, to, state) => {
    let initialScrolledYears = [];
    for (let i = from; i <= to; i++) {
      initialScrolledYears.push(i);
    }

    if (state) {
      return this.setState({ initialScrolledYears });
    } else {
      return initialScrolledYears;
    }
  };

  showYear = () =>
    this.setState({ initialGetYears: !this.state.initialGetYears, initialMonthDate: false }, () => {
      if (this.state.initialGetYears) {
        const { initialActualDate } = this.state;
        const { inline, scrolledYears, animateYearScrolling } = this.props;
        const isInline = inline ? 180 : 280;

        if (scrolledYears) {
          const actualYear = Array.from(this.yearsRef.current.children).filter(
            el => el.innerText === `${takeAcutalDate(initialActualDate).format('YYYY')}`
          )[0];

          document.querySelector('.date-picker__scrollMobile-height').scroll({
            left: 0,
            top: actualYear.offsetTop - isInline,
            behavior: animateYearScrolling ? 'smooth' : 'auto'
          });
        }
      }
    });

  makeYears = () => {
    const { initialActualDate } = this.state;
    const { minDate, maxDate, chunkYears } = this.props;

    const chunk = (arr, size) =>
      arr.reduce((acc, _, i) => {
        if (i % size === 0) {
          acc.push(arr.slice(i, i + size));
        }
        return acc;
      }, []);

    const chunkedYears = chunk(this.addYears(moment(minDate).get('years'), moment(maxDate).get('years')), chunkYears);
    const actualYear = Number(takeAcutalDate(initialActualDate).format('YYYY'));
    const initialBoxYears = chunkedYears.filter(years => years.includes(actualYear));

    return this.setState({ initialBoxYears });
  };

  handleClickOutside = event => {
    if (this.props.inline && this.inlinePicker && !this.inlinePicker.contains(event.target)) {
      this.toggleModal();
    }
  };

  toggleModal = () => {
    const { changeApproved, inline } = this.props;

    setTimeout(() => {
      this.setState({
        initialModalOpen: false
      });
    }, 300);
    if (!inline) {
      changeApproved(true);
    }
  };

  hideYears = () => {
    this.setState({ initialGetYears: false });
  };

  checkPositionInline = e => {
    const { inputRef } = this.props;
    const { left, right, top, bottom } = document.getElementById(inputRef.id).getBoundingClientRect();

    if (right <= 310 && left <= 310) {
      this.setState({
        leftPositionOfInput: '50%',
        topPositionOfInput: '50%',
        translatePositionOfInput: 'translate(-50%,-50%)'
      });
    } else {
      this.setState({
        leftPositionOfInput: left
      });
    }

    if (window.innerHeight - bottom <= 360) {
      this.setState({
        bottomPositionOfInput: window.innerHeight - top
      });
    } else if (window.innerHeight - (window.innerHeight - top) <= 360) {
      this.setState({
        topPositionOfInput: bottom + 10
      });
    } else {
      this.setState({
        topPositionOfInput: bottom + 10
      });
    }
  };

  keyboardChangeDate = event => {
    const { allowKeyboardControl, disableFuture, disablePast, maxDate, minDate, chunkYears } = this.props;
    const { initialActualDate, initialModalOpen, initialGetYears, initialBoxYears, initialMonthDate } = this.state;
    const { key } = event;
    const firstDayInMonth = new Date(takeAcutalDate(initialActualDate)._d).getDate();
    const allMonths = moment.monthsShort();

    const whichType = type => {
      if (typeof type[0] === 'number') {
        return Number(takeAcutalDate(initialActualDate).get('year'));
      } else {
        return takeAcutalDate(initialActualDate).format('MMM');
      }
    };
    const actualIndex = arr => arr.findIndex(e => e === whichType(arr));

    if (allowKeyboardControl) {
      if (initialModalOpen) {
        const changeTypes = (step, types, type) => {
          let _date = initialActualDate ? initialActualDate : new Date();
          let newTypes = moment(_date).add(step, types);

          const AFTER = disableFuture && moment(newTypes).isAfter(new Date(), type);
          const BEFORE = disablePast && moment(newTypes).isBefore(new Date(), type);

          const MAX_TYPE = moment(newTypes).isAfter(moment(maxDate), type);
          const MIN_TYPE = moment(newTypes).isBefore(moment(minDate), type);

          this.setState({
            initialActualDate: AFTER || BEFORE || MAX_TYPE || MIN_TYPE ? moment(_date) : moment(newTypes),
            initialDayDate: AFTER || BEFORE || MAX_TYPE || MIN_TYPE ? this.makeMonth(_date) : this.makeMonth(newTypes)
          });

          if (types === 'years') {
            this.makeYears();
          }
        };

        const skipMonth = moved => {
          return takeAcutalDate(initialActualDate)
            .add((moved === 'up' && -1) || (moved === 'down' && 1), 'months')
            .daysInMonth();
        };

        if (key === 'ArrowUp') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(-4, 'months', 'month');
            } else {
              changeTypes(-4, 'years', 'year');
            }
          } else {
            changeTypes(-7, 'days', 'date');
          }
        }

        if (key === 'ArrowDown') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(4, 'months', 'month');
            } else {
              changeTypes(4, 'years', 'year');
            }
          } else {
            changeTypes(7, 'days', 'date');
          }
        }
        if (key === 'ArrowLeft') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(-1, 'months', 'month');
            } else {
              changeTypes(-1, 'years', 'year');
            }
          } else {
            changeTypes(-1, 'days', 'date');
          }
        }
        if (key === 'ArrowRight') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(1, 'months', 'month');
            } else {
              changeTypes(1, 'years', 'year');
            }
          } else {
            changeTypes(1, 'days', 'date');
          }
        }
        if (key === 'PageUp') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(-12, 'months', 'month');
            } else {
              changeTypes(-chunkYears, 'years', 'year');
            }
          } else {
            changeTypes(-skipMonth('up'), 'days', 'date');
          }
        }
        if (key === 'PageDown') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(12, 'months', 'month');
            } else {
              changeTypes(chunkYears, 'years', 'year');
            }
          } else {
            changeTypes(skipMonth('up'), 'days', 'date');
          }
        }
        if (key === 'Home') {
          event.preventDefault();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(-actualIndex(allMonths), 'months', 'month');
            } else {
              changeTypes(-actualIndex(initialBoxYears[0]), 'years', 'year');
            }
          } else {
            changeTypes(-firstDayInMonth + 1, 'days', 'date');
          }
        }
        if (key === 'End') {
          event.preventDefault();
          const actualDaysInMonth = takeAcutalDate(initialActualDate).daysInMonth();

          if (initialGetYears) {
            if (initialMonthDate) {
              changeTypes(allMonths.length - 1 - actualIndex(allMonths), 'months', 'month');
            } else {
              changeTypes(initialBoxYears[0].length - 1 - actualIndex(initialBoxYears[0]), 'years', 'year');
            }
          } else {
            changeTypes(actualDaysInMonth - firstDayInMonth, 'days', 'date');
          }
        }

        if (key === 'Escape') {
          this.lastDateModal();
        }

        if (key === 'Enter') {
          event.preventDefault();
          if (!initialGetYears) {
            this.setState({ initialGetYears: true });
          }
          if (initialGetYears) {
            this.setState({ initialMonthDate: true });
          }
          if (initialGetYears && initialMonthDate) {
            console.log(initialGetYears, initialMonthDate);
            this.setState({ initialGetYears: false, initialMonthDate: false });
          }
        }

        if (event.shiftKey && event.code === 'KeyQ') {
          event.preventDefault();

          this.setState({ initialGetYears: !this.state.initialGetYears });
        }
      }
    }
  };

  setToday = () =>
    this.setState({
      initialActualDate: new Date(),
      initialDayDate: this.makeMonth(new Date())
    });

  clearModal = () => {
    this.setState({
      initialActualDate: new Date(),
      initialDayDate: this.makeMonth(new Date())
    });
  };

  lastDateModal = () => {
    this.setState({
      initialActualDate: this.props.lastDate || new Date(),
      initialDayDate: this.makeMonth(this.props.lastDate || new Date()),
      initialModalOpen: false
    });
  };

  cancelModal = () => {
    const { clearInputValue, inline } = this.props;

    this.setState({
      initialActualDate: this.props.lastDate || new Date(),
      initialDayDate: this.makeMonth(new Date()),
      initialModalOpen: false
    });

    if (!inline) {
      clearInputValue('');
    }
  };

  render() {
    const {
      animateYearScrolling,
      backdrop,
      cancelLabel,
      chunkYears,
      clearable,
      clearLabel,
      disabledDates,
      disableFuture,
      todayLabel,
      disablePast,
      format,
      inline,
      leftArrowIcon,
      locale,
      lastDate,
      keyboard,
      getModalOpen,
      getActualDate,
      disableScrollModal,
      changeApproved,
      clearInputValue,
      maxDate,
      minDate,
      okLabel,
      rightArrowIcon,
      scrolledYears,
      allowKeyboardControl,
      modalOpen,
      getYears,
      actualDate,
      showTodayButton,
      inputValue,
      inputRef,
      autoOk,
      theme,
      ...attributes
    } = this.props;

    const {
      bottomPositionOfInput,
      initialActualDate,
      initialBoxYears,
      initialDayDate,
      initialGetYears,
      initialMonthDate,
      initialScrolledYears,
      initialWeekDays,
      leftPositionOfInput,
      topPositionOfInput,
      translatePositionOfInput,
      width,
      firstRandomID,
      secondRandomID
    } = this.state;

    const dateDisplayClasses = picker =>
      classNames(
        `date-picker__${picker}-display pt-2 cursor-pointer`,
        picker === 'year'
          ? initialGetYears
            ? 'text-white'
            : 'text-white-50'
          : !initialGetYears
          ? 'text-white'
          : 'text-white-50'
      );

    const DATE = takeAcutalDate(initialActualDate);
    moment.locale(locale);

    return ReactDOM.createPortal(
      !inline ? (
        <FocusTrap>
          <div className='mdb-react-date__picker' {...attributes}>
            <div className='date-picker date-picker--opened' id='falseY_root' aria-hidden='false'>
              <div
                className='date-picker__holder'
                onClick={e => e.target.classList.contains('date-picker__holder') && this.lastDateModal()}
              >
                <div
                  className='date-picker__frame'
                  style={{
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: width < 568 ? '50%' : '60%',
                    right: '50%',
                    margin: 'unset'
                  }}
                >
                  <div className='date-picker__box'>
                    <div className='date-picker__header' style={{ backgroundColor: takeThemeColor(theme) }}>
                      <div className='date-picker__date-display' style={{ backgroundColor: takeThemeColor(theme) }}>
                        <div
                          onClick={() => this.setState({ initialGetYears: true })}
                          className={dateDisplayClasses('year')}
                        >{`Select ${initialGetYears ? 'Year' : 'Date'}`}</div>
                        <div
                          className='date-picker__controls d-flex align-items-end'
                          onClick={this.hideYears}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className='row date-picker__date-mobile'>
                            <div className={dateDisplayClasses('weekday')}>
                              {makeFirstLetterUpper(DATE.locale(locale).format('ddd'))},
                            </div>
                            <div className='ml-2'>
                              <div className={dateDisplayClasses('month')}>
                                {makeFirstLetterUpper(DATE.locale(locale).format('MMM'))}
                                <span className='ml-2'>{DATE.locale(locale).format('D')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='date-picker__body'>
                      <div className='d-flex justify-content-between pt-3 position-relative'>
                        <div className='date-picker__date-wrapper'>
                          <span className='date-picker__month'>
                            {makeFirstLetterUpper(DATE.locale(locale).format('MMMM'))}
                          </span>
                          <span className='date-picker__year ml-1'>{DATE.locale(locale).format('YYYY')}</span>

                          <MDBBtn
                            flat
                            className='p-0'
                            onClick={this.showYear}
                            style={{ borderRadius: '100%', height: 36, width: 36 }}
                          >
                            <MDBIcon
                              icon={`caret-${!initialGetYears ? 'down' : 'up'}`}
                              className='d-flex justify-content-center align-items-center'
                            />
                          </MDBBtn>
                        </div>
                        <DatePickerMovedButtons
                          initialMonthDate={initialMonthDate}
                          initialGetYears={initialGetYears}
                          scrolledYears={scrolledYears}
                          leftArrowIcon={leftArrowIcon}
                          rightArrowIcon={rightArrowIcon}
                          maxDate={maxDate}
                          minDate={minDate}
                          disablePast={disablePast}
                          disableFuture={disableFuture}
                          initialActualDate={initialActualDate}
                          chunkYears={chunkYears}
                          getUpdateMonth={month => {
                            this.setState({
                              initialActualDate: month,
                              initialDayDate: this.makeMonth(month._d)
                            });
                          }}
                          getUpdateYear={(maxType, minType, newYear) => {
                            this.setState(
                              {
                                initialActualDate: maxType || minType || moment(newYear),
                                initialDayDate: this.makeMonth(newYear._d)
                              },
                              () => {
                                this.makeYears();
                              }
                            );
                          }}
                        />
                      </div>

                      {(!initialGetYears && (
                        <DatePickerDays
                          initialWeekDays={initialWeekDays}
                          initialDayDate={initialDayDate}
                          monthDaysRef={this.monthDaysRef}
                          initialActualDate={initialActualDate}
                          theme={theme}
                          disableFuture={disableFuture}
                          disablePast={disablePast}
                          minDate={minDate}
                          maxDate={maxDate}
                          format={format}
                          getUpdate={(date, bool) => {
                            this.setState({ initialActualDate: date, initialModalOpen: bool });
                          }}
                          disabledDates={disabledDates}
                        />
                      )) ||
                        (initialMonthDate ? (
                          <DatePickerMonths
                            initialActualDate={initialActualDate}
                            theme={theme}
                            getUpdate={(date, bool) => {
                              this.setState({
                                initialActualDate: date,
                                initialGetYears: bool,
                                initialDayDate: this.makeMonth(date)
                              });
                            }}
                          />
                        ) : (
                          <DatePickerYears
                            theme={theme}
                            yearsRef={this.yearsRef}
                            animateYearScrolling={animateYearScrolling}
                            initialBoxYears={initialBoxYears}
                            initialScrolledYears={initialScrolledYears}
                            initialActualDate={initialActualDate}
                            scrolledYears={scrolledYears}
                            getUpdate={(date, autoOk, bool) => {
                              this.setState({
                                initialActualDate: date,
                                initialDayDate: this.makeMonth(date),
                                initialModalOpen: autoOk,
                                initialMonthDate: true
                              });
                            }}
                          />
                        ))}
                    </div>
                    <DatePickerFooter
                      cancelLabel={cancelLabel}
                      clearable={clearable}
                      clearLabel={clearLabel}
                      initialGetYears={initialGetYears}
                      okLabel={okLabel}
                      onClickCancel={this.cancelModal}
                      onClickClear={this.clearModal}
                      onClickOk={this.toggleModal}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FocusTrap>
      ) : (
        <FocusTrap>
          <div className='mdb-react-date__picker'>
            <div
              className='date-picker date-picker--opened '
              id={firstRandomID}
              aria-hidden='false'
              ref={node => (this.inlinePicker = node)}
            >
              {backdrop && (
                <div
                  className='position-fixed'
                  onClick={this.toggleModal}
                  style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                />
              )}
              <div
                className='date-picker__frame date-picker__frame--inline'
                style={{
                  top: topPositionOfInput,
                  left: leftPositionOfInput,
                  bottom: bottomPositionOfInput,
                  margin: 'unset',
                  transition: 'unset',
                  transform: translatePositionOfInput
                }}
                id={secondRandomID}
              >
                <div className='date-picker__box'>
                  <div className='date-picker__body'>
                    <div className='d-flex justify-content-between pt-3 position-relative'>
                      <div className='date-picker__date-wrapper'>
                        <span className='date-picker__month'>
                          {makeFirstLetterUpper(DATE.locale(locale).format('MMMM'))}
                        </span>
                        <span className='date-picker__year ml-1'>{DATE.locale(locale).format('YYYY')}</span>

                        <MDBBtn
                          flat
                          className='p-0'
                          onClick={this.showYear}
                          style={{ borderRadius: '100%', height: 36, width: 36 }}
                        >
                          <MDBIcon
                            icon={`caret-${!initialGetYears ? 'down' : 'up'}`}
                            className='d-flex justify-content-center align-items-center'
                          />
                        </MDBBtn>
                      </div>
                      <DatePickerMovedButtons
                        initialMonthDate={initialMonthDate}
                        initialGetYears={initialGetYears}
                        scrolledYears={scrolledYears}
                        leftArrowIcon={leftArrowIcon}
                        rightArrowIcon={rightArrowIcon}
                        maxDate={maxDate}
                        minDate={minDate}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        initialActualDate={initialActualDate}
                        chunkYears={chunkYears}
                        getUpdateMonth={month => {
                          this.setState({
                            initialActualDate: month,
                            initialDayDate: this.makeMonth(month._d)
                          });
                        }}
                        getUpdateYear={(maxType, minType, newYear) => {
                          this.setState(
                            {
                              initialActualDate: maxType || minType || moment(newYear),
                              initialDayDate: this.makeMonth(newYear._d)
                            },
                            () => {
                              this.makeYears();
                            }
                          );
                        }}
                      />
                    </div>

                    {(!initialGetYears && (
                      <DatePickerDays
                        initialWeekDays={initialWeekDays}
                        initialDayDate={initialDayDate}
                        monthDaysRef={this.monthDaysRef}
                        initialActualDate={initialActualDate}
                        theme={theme}
                        disableFuture={disableFuture}
                        disablePast={disablePast}
                        minDate={minDate}
                        maxDate={maxDate}
                        format={format}
                        getUpdate={(date, bool) => {
                          this.setState({ initialActualDate: date, initialModalOpen: bool });
                        }}
                        disabledDates={disabledDates}
                      />
                    )) ||
                      (initialMonthDate ? (
                        <DatePickerMonths
                          initialActualDate={initialActualDate}
                          theme={theme}
                          getUpdate={(date, bool) => {
                            this.setState({
                              initialActualDate: date,
                              initialGetYears: bool,
                              initialDayDate: this.makeMonth(date)
                            });
                          }}
                        />
                      ) : (
                        <DatePickerYears
                          theme={theme}
                          yearsRef={this.yearsRef}
                          animateYearScrolling={animateYearScrolling}
                          initialBoxYears={initialBoxYears}
                          initialScrolledYears={initialScrolledYears}
                          initialActualDate={initialActualDate}
                          scrolledYears={scrolledYears}
                          getUpdate={(date, autoOk, bool) => {
                            this.setState({
                              initialActualDate: date,
                              initialDayDate: this.makeMonth(date),
                              initialModalOpen: autoOk,
                              initialMonthDate: true
                            });
                          }}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FocusTrap>
      ),
      document.body
    );
  }
}

DatePickerModal.propTypes = {
  actualDate: PropTypes.any,
  allowKeyboardControl: PropTypes.bool,
  animateYearScrolling: PropTypes.bool,
  autoOk: PropTypes.bool,
  backdrop: PropTypes.bool,
  cancelLabel: PropTypes.any,
  changeApproved: PropTypes.func,
  chunkYears: PropTypes.number,
  clearable: PropTypes.bool,
  clearInputValue: PropTypes.func,
  clearLabel: PropTypes.string,
  dayDate: PropTypes.bool,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableScrollModal: PropTypes.bool,
  format: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
  getActualDate: PropTypes.func,
  getModalOpen: PropTypes.func,
  getUpdate: PropTypes.func,
  getYears: PropTypes.any,
  initialActualDate: PropTypes.any,
  initialBoxYears: PropTypes.array,
  initialScrolledYears: PropTypes.array,
  inline: PropTypes.bool,
  inputRef: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  inputValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  keyboard: PropTypes.bool,
  lastDate: PropTypes.any,
  leftArrowIcon: PropTypes.string,
  locale: PropTypes.any,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  modalOpen: PropTypes.bool,
  okLabel: PropTypes.string,
  rightArrowIcon: PropTypes.string,
  scrolledYears: PropTypes.bool,
  showTodayButton: PropTypes.any,
  theme: PropTypes.string,
  todayLabel: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
  weekDays: PropTypes.array,
  years: PropTypes.any,
  yearsArray: PropTypes.bool,
  yearsRef: PropTypes.node
};
