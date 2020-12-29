import classNames from 'classnames';
import { MDBBtn, MDBInput } from 'mdbreact';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import './DatePicker.css';
import { makeRandomID } from '../../../utils';
import DatePickerModal from './DatePickerModal/DatePickerModal';
import { CSSTransition } from 'react-transition-group';

class DatePickerV5 extends Component {
  state = {
    actualDate: null,
    inputValue: '',
    lastDate: null,
    modalOpen: false,
    getYears: false,
    scrolledYears: false,
    initialEmptyLabel: this.props.emptyLabel,
    approved: false
  };

  yearsRef = createRef();
  inputRef;
  containerRef = createRef();
  inlinePicker = createRef();

  componentDidMount() {
    const { actualDate } = this.state;
    const { locale, format } = this.props;

    this.setState({
      actualDate: actualDate,
      inputValue: moment(actualDate)
        .locale(locale)
        .format(format)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { getValue, value, format, inline } = this.props;
    const { actualDate, modalOpen, approved } = this.state;

    if (getValue && prevState.modalOpen !== modalOpen) {
      getValue(moment(actualDate)._d);
    }

    if (`${value}` !== `${prevProps.value}`) {
      this.setState({
        actualDate: value
      });
    }

    if (prevState.approved !== approved && approved) {
      this.setState({
        inputValue: moment(actualDate).format(format)
      });
    }

    if (modalOpen && actualDate !== prevState.actualDate && inline) {
      this.setState({
        inputValue: moment(actualDate).format(format)
      });
    }
  }

  toggleModal = () =>
    setTimeout(() => {
      this.setState({
        modalOpen: false
      });
    }, 300);

  openModal = () =>
    this.setState({
      lastDate: this.state.actualDate,
      modalOpen: true,
      getYears: false,
      approved: false
    });

  changeHandler = event => {
    const { value } = event.target;
    const { maxDate, minDate, format, getValue } = this.props;

    this.setState({ inputValue: value }, () => {
      const date = moment(value, format, true)._d;

      const isDate = date != ('Invalid Date' || '');
      const isBetween = moment(date).isBetween(moment(minDate), moment(maxDate), 'date');

      this.setState(
        {
          actualDate: (isDate && isBetween && moment(date)) || moment(new Date())
        },
        () => {
          getValue(moment(value)._d);
        }
      );
    });
  };

  render() {
    const {
      theme,
      allowKeyboardControl,
      animateYearScrolling,
      autoOk,
      cancelLabel,
      clearable,
      clearLabel,
      disableFuture,
      disableOpenOnEnter,
      disablePast,
      emptyLabel,
      invalidDateMessage,
      invalidLabel,
      keyboard,
      keyboardIcon,
      leftArrowIcon,
      mask,
      maxDate,
      maxDateMessage,
      minDate,
      minDateMessage,
      okLabel,
      onInputChange,
      openToYearSelection,
      rightArrowIcon,
      showTodayButton,
      TextFieldComponent,
      todayLabel,
      locale,
      format,
      className,
      getValue,
      disableScrollModal,
      value,
      validation,
      labelTitle,
      backdrop,
      valueDefault,
      inline,
      scrolledYears,
      chunkYears,
      disabledDates,
      tag: Tag,
      ...attributes
    } = this.props;

    const { actualDate, getYears, inputValue, modalOpen, lastDate, years, initialEmptyLabel } = this.state;

    //ClassNames
    const classes = classNames('md-form', 'mdb-react-date__picker', className);
    const validClassNames = classNames('red-text');

    //Functional ClassNames

    const calendarButtonStyles = {
      height: '45px',
      width: '45px',
      position: 'absolute',
      top: '30%',
      right: '-26px',
      transform: 'translate(-50%, -50%)'
    };
    const validDateStyles = { position: 'absolute', top: 43 };

    //Boolean
    const INPUT_VALUE = keyboard
      ? inputValue
      : actualDate
      ? moment(actualDate)
          .locale(locale)
          .format(format)
      : initialEmptyLabel;

    const INPUT_VALID = moment(inputValue, format, true);
    const VALID = INPUT_VALID._d == ('Invalid Date' || '');
    const IS_AFTER_MAX = moment(INPUT_VALID._d).isAfter(moment(maxDate), 'date');
    const IS_BEFORE_MIN = moment(INPUT_VALID._d).isBefore(moment(minDate), 'date');

    //Node
    const validMessage = message => (
      <small className={validClassNames} style={validDateStyles}>
        {message}
      </small>
    );

    //Set format to display date
    moment.locale(locale);
    moment.updateLocale(moment.locale(), {
      invalidDateMessage: initialEmptyLabel,
      invalidDate: initialEmptyLabel
    });

    return (
      <Tag
        data-test='date-picker'
        className={classes}
        style={{
          position: 'relative'
        }}
        ref={ref => (this.containerRef = ref)}
      >
        <MDBInput
          value={inputValue}
          onClick={() => !keyboard && this.openModal()}
          onChange={this.changeHandler}
          inputRef={e => (this.inputRef = e)}
          aria-haspopup='dialog'
          style={{ marginLeft: 0, marginRight: 0, width: '100%' }}
          id={makeRandomID('1')}
          icon={keyboard && keyboardIcon}
          iconStyle={keyboard && { right: 12, bottom: 4, cursor: 'pointer' }}
          iconRegular
          label={labelTitle}
        />

        {keyboard && (
          <>
            <MDBBtn
              flat
              rounded
              style={calendarButtonStyles}
              className='p-0'
              onClick={this.openModal}
              aria-haspopup='dialog'
            />
            {validation && VALID && validMessage(invalidDateMessage)}
            {!VALID && IS_AFTER_MAX && validMessage(maxDateMessage)}
            {!VALID && IS_BEFORE_MIN && validMessage(minDateMessage)}
          </>
        )}

        <CSSTransition in={modalOpen} timeout={300} unmountOnExit appear classNames='my-node'>
          <DatePickerModal
            allowKeyboardControl={allowKeyboardControl}
            inline={inline}
            modalOpen={modalOpen}
            theme={theme}
            getYears={getYears}
            actualDate={actualDate}
            locale={locale}
            scrolledYears={scrolledYears}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
            leftArrowIcon={leftArrowIcon}
            rightArrowIcon={rightArrowIcon}
            format={format}
            animateYearScrolling={animateYearScrolling}
            years={years}
            cancelLabel={cancelLabel}
            okLabel={okLabel}
            clearable={clearable}
            clearLabel={clearLabel}
            showTodayButton={showTodayButton}
            todayLabel={todayLabel}
            backdrop={backdrop}
            value={value}
            inputValue={inputValue}
            inputRef={this.inputRef}
            autoOk={autoOk}
            lastDate={lastDate}
            keyboard={keyboard}
            getModalOpen={modalOpen => this.setState({ modalOpen })}
            getActualDate={actualDate => this.setState({ actualDate })}
            disableScrollModal={disableScrollModal}
            changeApproved={approved => this.setState({ approved })}
            clearInputValue={inputValue => this.setState({ inputValue })}
            chunkYears={chunkYears}
            disabledDates={disabledDates}
          />
        </CSSTransition>
      </Tag>
    );
  }
}

DatePickerV5.propTypes = {
  allowKeyboardControl: PropTypes.bool,
  animateYearScrolling: PropTypes.bool,
  autoOk: PropTypes.bool,
  cancelLabel: PropTypes.node,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  clearLabel: PropTypes.node,
  disableFuture: PropTypes.bool,
  disableOpenOnEnter: PropTypes.bool,
  disablePast: PropTypes.bool,
  emptyLabel: PropTypes.string,
  format: PropTypes.string,
  getValue: PropTypes.func,
  invalidDateMessage: PropTypes.node,
  invalidLabel: PropTypes.string,
  keyboard: PropTypes.bool,
  keyboardIcon: PropTypes.node,
  leftArrowIcon: PropTypes.node,
  locale: PropTypes.string,
  mask: PropTypes.any,
  maxDate: PropTypes.string,
  maxDateMessage: PropTypes.node,
  minDate: PropTypes.string,
  minDateMessage: PropTypes.node,
  okLabel: PropTypes.node,
  onInputChange: PropTypes.func,
  openToYearSelection: PropTypes.bool,
  rightArrowIcon: PropTypes.node,
  showTodayButton: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  TextFieldComponent: PropTypes.string,
  theme: PropTypes.string,
  todayLabel: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  valueDefault: PropTypes.instanceOf(Date)
};

DatePickerV5.defaultProps = {
  animateYearScrolling: false,
  allowKeyboardControl: true,
  backdrop: true,
  autoOk: false,
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  emptyLabel: '',
  format: 'LL',
  inline: false,
  invalidDateMessage: 'Invalid Date Format',
  keyboardIcon: 'calendar',
  leftArrowIcon: 'angle-left',
  locale: 'en-US',
  maxDate: '2099-01-01',
  maxDateMessage: 'Date should not be after maximal date',
  minDate: '1900-01-01',
  minDateMessage: 'Date should not be before minimal date',
  okLabel: 'Ok',
  rightArrowIcon: 'angle-right',
  tag: 'div',
  theme: 'primary',
  todayLabel: 'Today',
  value: null,
  valueDefault: new Date(),
  getValue: () => {},
  labelTitle: 'Try me...',
  scrolledYears: false,
  disableScrollModal: false,
  keyboard: true,
  chunkYears: 24
};

export default DatePickerV5;
export { DatePickerV5 as MDBDatePickerV5 };
