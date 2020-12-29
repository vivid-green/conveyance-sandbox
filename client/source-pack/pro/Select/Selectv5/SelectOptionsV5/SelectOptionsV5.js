import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '../../../Input';
import SelectOptionV5 from '../SelectOptionv5/SelectOptionv5';

class SelectOptionsV5 extends Component {
  state = {
    searchValue: '',
    activeElement: -1,
    dropdownRefList: null,
    listLength: null,
    listHeight: ''
  };

  ulRef = React.createRef();
  dropdownRef = React.createRef();

  componentDidMount() {
    const {
      disableScrollToSelected,
      options,
      search,
      searchRef,
      innerRef,
      dropdownInnerRef,
      selectAll,
      filteredOptions,
      allChecked
    } = this.props;

    search && searchRef(this.searchInputRef);
    innerRef && innerRef(this.dropdownRef.current);
    dropdownInnerRef && dropdownInnerRef(this.dropdownRef);

    const checkedOptions = options.filter(option => option.checked);
    const indexOfFirstChecked = options.map(option => option.checked).findIndex(el => el === true);
    const optionToSelect = selectAll ? indexOfFirstChecked + 1 : indexOfFirstChecked;

    if (checkedOptions.length >= 1 && !disableScrollToSelected && filteredOptions.length > 1 && !allChecked) {
      this.scrollTo(optionToSelect);

      this.ulRef.current.childNodes[optionToSelect].focus();

      this.setState({
        activeElement: optionToSelect
      });
    }

    this.popperUpdate();
    this.refListUpdate();
  }

  componentDidUpdate() {
    const { listHeight } = this.state;
    const refListHeight = this.ulRef.current.offsetHeight;

    if (listHeight !== refListHeight) {
      this.popperUpdate();
    }

    this.refListUpdate();
  }

  componentWillUnmount() {
    const { setFilteredOptions, options } = this.props;

    setFilteredOptions(options);

    this.setState({
      searchValue: ''
    });
  }

  scrollTo(id) {
    const { search } = this.props;
    const searchHeight = search && this.searchInputRef.parentNode.offsetHeight;
    if (search) {
      this.ulRef.current.childNodes[id].parentNode.scrollTop =
        this.ulRef.current.childNodes[id].offsetTop - searchHeight;
    } else {
      this.ulRef.current.childNodes[id].parentNode.scrollTop = this.ulRef.current.childNodes[id].offsetTop;
    }
  }

  refListUpdate = () => {
    const { dropdownRefList, listLength } = this.state;

    const liRefList = this.ulRef.current.childNodes;
    const ulRefListLength = Object.keys(liRefList).length - 1;

    if (dropdownRefList !== liRefList || listLength !== ulRefListLength) {
      this.setState({
        dropdownRefList: liRefList,
        listLength: ulRefListLength
      });
    }
  };

  popperUpdate = () => {
    const { popperPositionUpdate } = this.props;
    const refListHeight = this.ulRef.current.offsetHeight;

    this.setState(
      {
        listHeight: refListHeight
      },
      () => popperPositionUpdate()
    );
  };

  onChangeSearch = e => {
    this.setState({
      searchValue: e.target.value
    });
  };

  search = value => {
    const { setFilteredOptions, options } = this.props;

    const filteredOptions = options.filter(option => {
      if (option.text) {
        return option.text.toLowerCase().match(value.toLowerCase().trim());
      }
      return option.value.toLowerCase().match(value.toLowerCase().trim());
    });

    setFilteredOptions(filteredOptions);
  };

  handleFocus = e => {
    const { isDropdownOpen, closeDropdown, search } = this.props;
    const { activeElement } = this.state;

    const searchInputRef = this.searchInputRef;
    const dropdownContainer = this.dropdownRef.current;
    const isDropdownFocused = document.activeElement === searchInputRef || document.activeElement === dropdownContainer;

    const liRefList = this.ulRef.current.childNodes;
    const listLength = Object.keys(liRefList).length - 1;

    const ENTER = e.keyCode === 13;
    const ESC = e.keyCode === 27;
    const UP = e.keyCode === 38;
    const DOWN = e.keyCode === 40;
    const ALT = e.altKey;
    const SPACE = e.keyCode === 32;
    const TAB = e.keyCode === 9;
    const END = e.keyCode === 35;
    const HOME = e.keyCode === 36;

    (DOWN || UP || ENTER || ALT || ESC || SPACE || TAB || END || HOME) && e.preventDefault();

    switch (isDropdownOpen) {
      case ESC || (UP && ALT):
        closeDropdown('keyboard');
        break;
      case (DOWN || TAB || ENTER) && isDropdownFocused:
        activeElement !== -1 ? this.changeFocus(activeElement) : this.selectNextOption('NEXT');
        break;
      case DOWN || TAB:
        this.selectNextOption('NEXT');
        break;
      case UP:
        activeElement <= 0 ? search && this.changeFocus(-1) : this.selectNextOption('PREV');
        break;
      case HOME:
        this.changeFocus(0);
        break;
      case END:
        this.changeFocus(listLength);
        break;
      default:
        return;
    }
  };

  selectNextOption = direction => {
    const { activeElement } = this.state;
    const liRefList = this.ulRef.current.childNodes;
    const listLength = Object.keys(liRefList).length - 1;

    if (direction === 'PREV' && activeElement - 1 !== -1) {
      for (let i = activeElement - 1; i >= 0; i--) {
        const isDisabled = this.ulRef.current.childNodes[i].dataset.disabled === 'true';
        if (!isDisabled) {
          this.ulRef.current.childNodes[i].focus();

          activeElement !== -1 && (this.ulRef.current.childNodes[activeElement].dataset.highlight = false);
          this.ulRef.current.childNodes[i].dataset.highlight = true;

          this.setState({
            activeElement: i
          });

          break;
        }
      }
    } else if (direction === 'NEXT') {
      for (let i = activeElement + 1; i <= listLength; i++) {
        const isDisabled = this.ulRef.current.childNodes[i].dataset.disabled === 'true';
        if (!isDisabled) {
          this.ulRef.current.childNodes[i].focus();

          activeElement !== -1 && (this.ulRef.current.childNodes[activeElement].dataset.highlight = false);
          this.ulRef.current.childNodes[i].dataset.highlight = true;

          this.setState({
            activeElement: i
          });
          break;
        }
      }
    }
  };

  changeFocus = value => {
    const { activeElement } = this.state;

    const searchInputRef = this.searchInputRef;
    const currentActiveElement = this.ulRef.current.childNodes[value];

    if (value === -1) {
      activeElement !== -1 && (this.ulRef.current.childNodes[activeElement].dataset.highlight = false);
      searchInputRef.focus();
    } else {
      currentActiveElement.focus();
      currentActiveElement.dataset.highlight = true;
    }

    this.setState({
      activeElement: value
    });
  };

  removeHighlight = () => {
    const { activeElement } = this.state;

    activeElement !== -1 && (this.ulRef.current.childNodes[activeElement].dataset.highlight = false);
    this.setState({
      activeElement: -1
    });
  };

  render() {
    const {
      allChecked,
      customTemplate,
      filteredOptions,
      isDropdownOpen,
      multiple,
      placement,
      search,
      searchId,
      searchLabel,
      searchNoResult,
      selectAll,
      selectAllClassName,
      selectAllLabel,
      selectAllValue,
      selectOption,
      style,
      visibleOptions
    } = this.props;

    const { searchValue } = this.state;

    const classes = classNames('dropdown-content', 'fadeElement', isDropdownOpen && 'fadeIn');
    const listClasses = classNames('select-list scrollbar scrollbar-select thin');
    const searchInputClasses = classNames('select-search-input');
    return (
      <div
        className={classes}
        ref={this.dropdownRef}
        data-placement={placement}
        style={style}
        onKeyDown={this.handleFocus}
        onClick={this.removeHighlight}
        tabIndex='-1'
      >
        {search && (
          <Input
            id={searchId}
            getValue={this.search}
            value={searchValue}
            onChange={this.onChangeSearch}
            data-search='true'
            placeholder={searchLabel}
            className={searchInputClasses}
            containerClass='search-wrap'
            inputRef={ref => (this.searchInputRef = ref)}
            role='searchbox'
          />
        )}

        <ul
          data-test='controlled-select-options'
          className={listClasses}
          style={{ maxHeight: `${visibleOptions * 48}px` }}
          ref={this.ulRef}
        >
          {selectAll && multiple && filteredOptions.length > 1 && (
            <SelectOptionV5
              listElementRef={ref => (this.selectAllRef = ref)}
              text={selectAllLabel}
              value={selectAllValue}
              selectAllClassName={selectAllClassName}
              checked={allChecked}
              multiple
              selectOption={selectOption}
            />
          )}

          {filteredOptions.map((option, index) => (
            <SelectOptionV5
              key={index}
              checked={option.checked}
              disabled={option.disabled}
              multiple={multiple}
              icon={option.icon}
              text={option.text}
              value={option.value}
              separator={option.separator}
              selectOption={selectOption}
            />
          ))}

          {filteredOptions.length === 0 && <p className='text-muted pl-2'>{searchNoResult}</p>}
        </ul>
        {customTemplate && <div className='select-custom-template'>{customTemplate}</div>}
      </div>
    );
  }
}

SelectOptionsV5.propTypes = {
  selected: PropTypes.string.isRequired,
  selectOption: PropTypes.func.isRequired,
  allChecked: PropTypes.bool,
  changeFocus: PropTypes.func,
  disableScrollToSelected: PropTypes.bool,
  inputRef: PropTypes.shape({
    current: PropTypes.instanceOf(typeof Element === 'undefined' ? function() {} : Element)
  }),
  isDropdownOpen: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      checked: PropTypes.bool,
      disabled: PropTypes.bool,
      icon: PropTypes.string,
      image: PropTypes.string,
      separator: PropTypes.bool,
      text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      value: PropTypes.string
    })
  ),

  search: PropTypes.bool,
  searchId: PropTypes.string,
  searchLabel: PropTypes.string,
  searchNoResult: PropTypes.string,
  selectAll: PropTypes.bool,
  selectAllClassName: PropTypes.string,
  selectAllLabel: PropTypes.string,
  selectAllValue: PropTypes.string,
  setFilteredOptions: PropTypes.func,
  visibleOptions: PropTypes.number
};

SelectOptionsV5.defaultProps = {
  isDropdownOpen: false,
  multiple: false,
  options: [],
  disableScrollToSelected: false,
  search: false,
  searchId: 'selectSearchInput',
  searchLabel: 'Search',
  searchNoResult: 'No results',
  selectAll: false,
  selectAllLabel: 'Select All',
  visibleOptions: 5
};

export default SelectOptionsV5;
