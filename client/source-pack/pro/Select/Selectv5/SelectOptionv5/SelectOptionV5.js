import React from 'react';
import { MDBInput } from 'mdbreact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SelectOptionV5 = ({
  checked,
  disabled,
  icon,
  multiple,
  selectOption,
  text,
  value,
  separator,
  listElementRef,
  selectAllClassName
}) => {
  const classes = classNames(
    (disabled || separator) && 'disabled',
    separator && 'optgroup',
    checked && 'active',
    'form-check'
  );
  const spanClasses = classNames('filtrable', selectAllClassName && selectAllClassName, separator && 'pl-3');

  return (
    <>
      <li
        ref={listElementRef}
        data-test='controlled-select-option'
        data-multiple={multiple}
        data-disabled={disabled || separator}
        data-highlight='false'
        className={classes}
        onClick={() => selectOption(value, 'mouse')}
        onKeyDown={e => {
          const isDisabled = e.target.dataset.disabled === 'true';
          if ((e.keyCode === 13 || e.keyCode === 32) && !isDisabled) {
            selectOption(value, 'keyboard');
          }
        }}
        tabIndex='-1'
        role='option'
        aria-selected={checked}
        aria-disabled={disabled || separator}
      >
        {icon && <img src={icon} alt='' className='rounded-circle' />}

        <span data-multiple={multiple} data-disabled={disabled} className={spanClasses}>
          {multiple && !separator && (
            <>
              <MDBInput
                data-multiple={multiple}
                type='checkbox'
                value={value}
                className='form-check-input'
                checked={checked}
                disabled={disabled}
                onChange={() => {}}
                label={text}
                noTag
              />
            </>
          )}
          {!multiple && !separator ? text || value : null}
          {separator && text}
        </span>
      </li>
    </>
  );
};

SelectOptionV5.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  focusBackgroundColor: PropTypes.string,
  icon: PropTypes.string,
  isFocused: PropTypes.bool,
  multiple: PropTypes.bool,
  selectAllClassName: PropTypes.string,
  selectOption: PropTypes.func,
  separator: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.string
};

SelectOptionV5.defaultProps = {
  checked: false,
  disabled: false,
  icon: '',
  isFocused: false,
  multiple: false,
  separator: false
};

export default SelectOptionV5;
