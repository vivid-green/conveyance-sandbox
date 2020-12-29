/* eslint-disable react/state-in-constructor */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import './material-selectV5.css';

import SelectOptionsV5 from './SelectOptionsv5/SelectOptionsv5';

class SelectV5 extends Component {
  state = {
    allChecked: false,
    filteredOptions: this.props.options || [],
    isInputActive: false,
    isControlled: true,
    isSelectInputEmpty: true,
    isInputFocused: false,
    isDropdownOpen: false,
    options: this.props.options || [],
    selectTextContent: '',
    selectValue: []
  };

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
    if (this.props.options && this.props.options.length) {
      Object.assign(this.state, this.computeValuesAndText(this.props.options));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectValue !== this.state.selectValue) {
      if (typeof this.props.getValue === 'function') {
        this.props.getValue(this.state.selectValue);
      }

      if (typeof this.props.getTextContent === 'function') {
        this.props.getTextContent(this.state.selectTextContent);
      }

      if (!this.props.children) {
        this.setState({
          isSelectInputEmpty: !this.state.options.some(option => option.checked)
        });
      }
    }

    if (this.props.options !== prevProps.options) {
      const { selectValue, selectTextContent, allChecked } = this.computeValuesAndText(this.props.options);

      this.setState({
        options: this.props.options,
        filteredOptions: this.props.options,
        selectValue,
        selectTextContent,
        allChecked
      });
    } else if (prevState.filteredOptions !== this.state.filteredOptions) {
      const { allChecked } = this.computeValuesAndText(this.props.options);

      this.setState({
        allChecked
      });
    }
  }

  onInputClick = e => {
    e.stopPropagation();
    const { search } = this.props;

    if (e.type !== 'contextmenu') {
      this.setState(
        {
          isDropdownOpen: true,
          isInputActive: true
        },
        () => {
          if (search) {
            search && this.searchRef.focus();
          } else {
            this.selectDropdownRef.current.focus();
          }
        }
      );
    }
  };

  onDocumentClick = e => {
    const { isDropdownOpen } = this.state;
    const { multiple } = this.props;
    const input = this.selectInputRef.current;

    if (isDropdownOpen) {
      const isDisabled = e.target.dataset.disabled === 'true';
      const searchInput = this.searchRef;

      if (
        isDisabled ||
        e.target === input ||
        e.target === searchInput ||
        (multiple && this.selectDropdownRef.current.contains(e.target))
      ) {
      } else {
        this.closeDropdown('mouse');
      }
    }
  };

  closeDropdown = method => {
    const input = this.selectInputRef.current;

    if (method === 'mouse') {
      this.setState({
        isDropdownOpen: false,
        isInputFocused: false,
        isInputActive: false
      });
    } else if (method === 'keyboard') {
      this.setState(
        {
          isDropdownOpen: false,
          isInputActive: false
        },
        () => input.focus()
      );
    }
  };

  computeValuesAndText = options => {
    const checkedOptions = options.filter(option => option.checked);

    const checkedValues = checkedOptions.map(opt => opt.value);
    const checkedTexts = checkedOptions.map(opt => (opt.text ? opt.text : opt.value));

    const selectTextContent = checkedTexts.length ? checkedTexts.join(', ') : this.props.selected;

    let allChecked;
    if (checkedOptions.length > 0) {
      allChecked = checkedOptions.length === this.state.filteredOptions.filter(option => !option.disabled).length;
    }

    return {
      isSelectInputEmpty: !checkedOptions.length,
      selectValue: checkedValues,
      selectTextContent,
      allChecked,
      checkedOptions
    };
  };

  setFilteredOptions = filteredOptions => {
    this.setState({
      filteredOptions
    });
  };

  setOptionStatus = (option, status) => {
    if (!option.disabled) {
      option.checked = status;
    }
    return option;
  };

  applyFilteredOptionsChanges = (options, filteredOptions) => {
    filteredOptions.forEach(filteredOption => {
      const index = options.findIndex(option => option.value === filteredOption.value);

      filteredOption.checked !== options[index].checked && this.setOptionStatus(options[index], filteredOption.checked);
    });

    return options;
  };

  selectOneOption = value => {
    this.setState(prevState => {
      const options = [...prevState.options];
      const optionIndex = options.findIndex(option => option.value === value);

      options.forEach((option, index) =>
        index !== optionIndex ? this.setOptionStatus(option, false) : this.setOptionStatus(option, !option.checked)
      );

      return this.computeValuesAndText(options);
    });
  };

  selectMultipleOption = value => {
    this.setState(prevState => {
      const options = [...prevState.options];
      const optionIndex = options.findIndex(option => option.value === value);

      options[optionIndex].checked = !options[optionIndex].checked;

      return this.computeValuesAndText(options);
    });
  };

  selectAllOptions = () => {
    this.setState(prevState => {
      let options = [...prevState.options];
      const filteredOptions = [...prevState.filteredOptions].filter(option => !option.disabled);

      const areSomeUnchecked = filteredOptions.some(option => !option.checked);

      areSomeUnchecked
        ? filteredOptions.map(option => !option.checked && this.setOptionStatus(option, true))
        : filteredOptions.map(option => this.setOptionStatus(option, false));

      if (filteredOptions.length !== options.length) {
        options = this.applyFilteredOptionsChanges(options, filteredOptions);
      }
      return this.computeValuesAndText(options);
    });
  };

  selectOption = (value, method) => {
    const { multiple } = this.props;
    if (multiple) {
      value === this.props.selectAllValue ? this.selectAllOptions() : this.selectMultipleOption(value);
      console.log(value);
    } else {
      this.selectOneOption(value);
      method === 'keyboard' && this.closeDropdown(method);
    }
  };

  selectNextOption = e => {
    const { options } = this.props;
    const UP = e.keyCode === 38;
    const DOWN = e.keyCode === 40;
    const indexOfSelected = options.map(option => option.checked).findIndex(el => el === true);

    if (UP) {
      for (let i = indexOfSelected - 1; i >= 0; i--) {
        if (options[i].disabled === false) {
          this.selectOneOption(options[i].value);
          break;
        }
      }
    } else if (DOWN) {
      for (let i = indexOfSelected + 1; i < options.length; i++) {
        if (options[i].disabled === false) {
          this.selectOneOption(options[i].value);
          break;
        }
      }
    }
  };

  resetSelected = () => {
    this.setState(prevState => {
      let options = [...prevState.options];

      options.forEach(option => this.setOptionStatus(option, false));
      return this.computeValuesAndText(options);
    });
  };

  onBlur = e => {
    this.setState({
      isInputFocused: false,
      isInputActive: false
    });
  };

  onFocus = e => {
    this.setState({
      isInputFocused: true
    });
  };

  handleKeyDown = e => {
    const { isDropdownOpen } = this.state;
    const { multiple } = this.props;

    const ENTER = e.keyCode === 13;
    const ESC = e.keyCode === 27;
    const UP = e.keyCode === 38;
    const DOWN = e.keyCode === 40;
    const ALT = e.altKey;
    const SPACE = e.keyCode === 32;

    (DOWN || UP || ENTER || ALT || ESC || SPACE) && e.preventDefault();

    switch (!isDropdownOpen) {
      case ENTER:
        this.onInputClick(e);
        break;
      case DOWN && (ALT || multiple):
        this.onInputClick(e);
        break;
      case UP && multiple:
        this.onInputClick(e);
        break;
      case UP && !multiple:
        this.selectNextOption(e);
        break;
      case DOWN && !multiple:
        this.selectNextOption(e);
        break;
      default:
        return;
    }
  };

  render() {
    const {
      children,
      className,
      color,
      customTemplate,
      disabled,
      icon,
      label,
      labelClass,
      labelId,
      multiple,
      outline,
      placeholder,
      required,
      resetBtn,
      scrollToSelected,
      search,
      searchId,
      searchLabel,
      searchNoResult,
      selectAll,
      selectAllClassName,
      selectAllLabel,
      selectAllValue,
      selected,
      visibleOptions
    } = this.props;

    const {
      allChecked,
      filteredOptions,
      isInputActive,
      isSelectInputEmpty,
      isInputFocused,
      isDropdownOpen,
      options,
      selectTextContent,
      selectValue
    } = this.state;

    const containerClasses = classNames(
      'mdb-select md-form',
      icon && 'select-icon',
      color ? 'colorful-select dropdown-' + color : '',
      isInputFocused || isDropdownOpen ? 'active' : '',
      multiple ? 'multiple-select-dropdown' : '',
      outline ? 'md-outline' : '',
      resetBtn ? 'btn-reset' : '',
      className
    );

    const inputClasses = classNames('select-input');

    const setSelectValue = isSelectInputEmpty ? (selected && !label ? selected : '') : selectTextContent;
    const labelClasses = classNames(
      'mdb-main-label',
      !isSelectInputEmpty || isDropdownOpen || isInputActive ? 'active' : '',
      labelClass
    );

    return (
      <>
        <Manager>
          <div className={containerClasses}>
            <Reference data-test='select-toggle'>
              {({ ref }) => (
                <MDBInput
                  className={inputClasses}
                  dataTest='controlled-select-input'
                  disabled={disabled}
                  inputRef={ref}
                  selectInnerRef={el => (this.selectInputRef = el)}
                  label={label}
                  labelClass={labelClasses}
                  labelId={labelId}
                  onBlur={this.onBlur}
                  onClick={this.onInputClick}
                  onFocus={this.onFocus}
                  onKeyDown={this.handleKeyDown}
                  outline={outline}
                  placeholder={placeholder}
                  required={required}
                  type='text'
                  value={setSelectValue}
                  icon={icon}
                  isControlled
                  readOnly
                  noTag
                  role={search ? 'combobox' : 'listbox'}
                  aria-multiselectable={multiple ? 'true' : 'false'}
                  aria-disabled={disabled ? 'true' : 'false'}
                  aria-required={required ? 'true' : 'false'}
                  aria-labelledby={labelId}
                  aria-haspopup={'true'}
                  aria-expanded={isDropdownOpen ? 'true' : 'false'}
                >
                  <span className='caret'>▼</span>
                  {resetBtn && !isSelectInputEmpty && (
                    <span className='close-btn'>
                      <MDBBtn flat size='small' onClick={this.resetSelected}>
                        <MDBIcon fas icon='times' />
                      </MDBBtn>
                    </span>
                  )}
                  {children}
                </MDBInput>
              )}
            </Reference>

            {isDropdownOpen && (
              <Popper
                modifiers={{
                  offset: {
                    offset: outline ? '0, 8px' : '0, 0'
                  }
                }}
                eventsEnabled
                placement='bottom-start'
              >
                {({ ref, style, placement, scheduleUpdate }) => (
                  <SelectOptionsV5
                    allChecked={allChecked}
                    customTemplate={customTemplate}
                    dropdownInnerRef={el => (this.selectDropdownRef = el)}
                    filteredOptions={filteredOptions}
                    innerRef={ref}
                    isDropdownOpen={isDropdownOpen}
                    multiple={multiple}
                    options={options}
                    placement={placement}
                    popperPositionUpdate={scheduleUpdate}
                    search={search}
                    searchId={searchId}
                    searchRef={ref => (this.searchRef = ref)}
                    searchLabel={searchLabel}
                    searchNoResult={searchNoResult}
                    scrollToSelected={scrollToSelected}
                    selectAll={selectAll}
                    selectAllClassName={selectAllClassName}
                    selectAllLabel={selectAllLabel}
                    selectAllValue={selectAllValue}
                    selected={selected}
                    selectOption={this.selectOption}
                    selectValue={selectValue}
                    setFilteredOptions={this.setFilteredOptions}
                    style={style}
                    visibleOptions={visibleOptions}
                    isInputActive={isInputActive}
                    isInputFocused={isInputFocused}
                    closeDropdown={this.closeDropdown}
                  />
                )}
              </Popper>
            )}
          </div>
        </Manager>
      </>
    );
  }
}

SelectV5.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  customTemplate: PropTypes.node,
  getTextContent: PropTypes.func,
  getValue: PropTypes.func,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  labelId: PropTypes.string,
  multiple: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      checked: PropTypes.bool,
      disabled: PropTypes.bool,
      icon: PropTypes.string,
      separator: PropTypes.bool,
      text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      value: PropTypes.string
    })
  ),
  outline: PropTypes.bool,
  required: PropTypes.bool,
  resetBtn: PropTypes.bool,
  search: PropTypes.bool,
  searchId: PropTypes.string,
  searchLabel: PropTypes.string,
  selectAllClassName: PropTypes.string,
  selectAllLabel: PropTypes.string,
  selectAllValue: PropTypes.string,
  selected: PropTypes.string
};

SelectV5.defaultProps = {
  label: '',
  labelClass: '',
  labelId: '',
  outline: false,
  required: false,
  resetBtn: false,
  selected: '',
  selectAllValue: '0'
};

export default SelectV5;
export { SelectV5 as MDBSelectV5 };
