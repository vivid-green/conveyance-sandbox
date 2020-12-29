import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MDBInput, MDBIcon } from 'mdbreact';
import classNames from 'classnames';
import './Autocomplete.css';
import { partHighlight, makeToStringAndLower, scrollToElement } from './Utils/index';

class Autocomplete extends PureComponent {
  state = {
    filteredSuggestions: [],
    focusedListItem: 0,
    initialDataKey: '',
    initialFocused: true,
    initialValue: '',
    movedKey: false,
    showList: false,
    suggestions: []
  };

  autoInputRef = React.createRef();
  suggestionsList = React.createRef();

  componentDidMount() {
    const { data, value, valueDefault, dataKey } = this.props;

    this.setState({
      suggestions: this.filterRepeated(data),
      initialValue: value || valueDefault,
      initialDataKey: '' || dataKey
    });
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    const { getValue, value, data, dataKey } = this.props;
    const { initialValue, initialFocused } = this.state;

    if (prevState.value !== initialValue && getValue) {
      getValue(initialValue);
    }
    if (prevProps.value !== value) {
      this.setState({ initialValue: value });
    }
    if (prevProps.data !== data) {
      this.setState({ suggestions: this.filterRepeated(data) });
    }

    if (prevState.initialDataKey !== dataKey) {
      this.setState({ initialDataKey: dataKey });
    }

    if (prevState.initialFocused !== initialFocused) {
      this.setState({ initialFocused });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outsideClickHandler);
  }

  outsideClickHandler = e => {
    if (this.suggestionsList && e.target !== this.suggestionsList && e.target !== this.autoInputRef) {
      return this.setState({ showList: false, activeLabeL: false });
    }
  };

  filterRepeated = data => {
    return data.filter((el, index) => data.indexOf(el) === index);
  };

  inputOnChangeHandler = e => {
    const { value } = e.target;
    this.setState({
      initialValue: value,
      focusedListItem: 0,
      showList: true
    });

    if (value !== '') {
      this.setSuggestions(value);
    } else {
      this.setSuggestions();
    }
  };

  setSuggestions = value => {
    const { suggestions, initialDataKey } = this.state;
    const { noSuggestion } = this.props;

    if (value !== '' && value !== undefined) {
      const filteredSuggestions = suggestions.filter(suggest => {
        if (typeof suggest === 'object') {
          return makeToStringAndLower(suggest[initialDataKey], value);
        } else {
          return makeToStringAndLower(suggest, value);
        }
      });

      if (typeof filteredSuggestions[0] === 'object') {
        const filteredMapped = filteredSuggestions.map(e => {
          return e[initialDataKey].toString();
        });

        this.setState({
          showList: true,
          filteredSuggestions: filteredMapped.length <= 0 ? noSuggestion : filteredMapped
        });
      } else {
        this.setState({
          showList: true,
          filteredSuggestions: filteredSuggestions.length <= 0 ? noSuggestion : filteredSuggestions
        });
      }
    } else {
      this.setState({
        activeLabeL: true,
        showList: true,
        filteredSuggestions: suggestions
      });
    }
  };

  handleClear = () => {
    this.setState({ initialValue: '', focusedListItem: 0, showList: false, activeLabeL: false });
  };

  handleSelect = () => {
    const { filteredSuggestions, focusedListItem } = this.state;
    const { dataKey } = this.props;
    let initialValue;

    if (typeof filteredSuggestions[0] === 'string') {
      initialValue = filteredSuggestions[focusedListItem];
    } else {
      initialValue = filteredSuggestions.map(e => {
        return e[dataKey];
      })[focusedListItem];
    }

    if (initialValue !== 'No options') {
      this.setState({
        initialValue,
        focusedListItem: 0,
        showList: false
      });
    }
  };

  keyDownHandler = e => {
    const { filteredSuggestions, focusedListItem } = this.state;
    const { heightItem, focused } = this.props;
    const suggestionsList = this.suggestionsList;

    if (suggestionsList && filteredSuggestions) {
      const suggestionsListNodes = suggestionsList.childNodes;

      if (suggestionsListNodes !== undefined) {
        const numberTo = suggestionsList.offsetHeight - heightItem * 2;
        const moveDown = suggestionsListNodes[focusedListItem].offsetTop - numberTo;
        const moveUp = suggestionsListNodes[focusedListItem].offsetTop - 45;

        if (e.keyCode === 13) {
          this.handleSelect();
          this.setState({
            filteredSuggestions: []
          });
        }

        if (e.keyCode === 27) {
          this.setState({ filteredSuggestions: [] });
        }

        if (e.keyCode === 40 && focusedListItem < filteredSuggestions.length - 1) {
          this.setState(
            prev => ({ focusedListItem: prev.focusedListItem + 1, movedKey: true }),
            () => {
              return scrollToElement(suggestionsList, moveDown);
            }
          );
        } else {
          this.setState({ focusedListItem: 0 });
        }
        if (e.keyCode === 38 && focusedListItem > 0) {
          this.setState({ focusedListItem: focusedListItem - 1, movedKey: true }, () => {
            return scrollToElement(suggestionsList, moveUp);
          });
        }

        if (e.keyCode === 38 && focusedListItem === 0) {
          this.setState({ focusedListItem: filteredSuggestions.length - 1, movedKey: true });
        }

        if (e.keyCode === 35) {
          this.setState({ focusedListItem: filteredSuggestions.length - 1 }, () => {
            return scrollToElement(suggestionsList, moveDown);
          });
        }

        if (e.keyCode === 36) {
          this.setState({ focusedListItem: 0 }, () => {
            return scrollToElement(suggestionsList, moveUp);
          });
        }

        if (e.keyCode === 9 && focused) {
          this.setState({ filteredSuggestions: [], activeLabeL: false, showList: false });
        }
      }
    }
  };

  updateFocus = index => {
    this.setState({ focusedListItem: index });
  };

  toggleFocusToClearBtn = (e, initialFocused) => {
    if (this.props.focused) {
      if (e.type === 'focus') {
        this.setState({ initialFocused });
        this.setSuggestions(e.target.value);
      } else {
        this.setState({ initialFocused }, () => {
          setTimeout(() => {
            this.updateFocus(0);
          }, 300);
        });
      }
    }
  };

  getHighlightedText = (text, highlight) => {
    const { highlightBold, highlightClasses, highlightStyles } = this.props;
    const { initialDataKey, filteredSuggestions } = this.state;

    if (highlight !== undefined && filteredSuggestions[0] !== 'No options') {
      const isObject = typeof text === 'object' ? text[initialDataKey].toString() : text;
      const parts = isObject.split(new RegExp(`(${highlight})`, 'gi'));
      const classes = classNames(highlightBold && 'font-weight-bold', highlightClasses);

      return parts.map((part, i) => {
        return (
          <span
            key={i}
            style={partHighlight(part, highlight, highlightStyles, {})}
            className={partHighlight(part, highlight, classes, '')}
          >
            {part}
          </span>
        );
      });
    } else {
      return text;
    }
  };

  listOnMouseEnter = index => {
    if (!this.state.movedKey) {
      this.updateFocus(index);
    }
  };

  listOnMouseMove = index => {
    this.setState(
      {
        movedKey: false
      },
      () => {
        this.updateFocus(index);
      }
    );
  };

  render() {
    const {
      clear,
      clearClass,
      data,
      dataKey,
      focused,
      heightItem,
      highlight,
      highlightBold,
      highlightClasses,
      highlightStyles,
      labelClass,
      labelStyles,
      noSuggestion,
      inputClass,
      placeholder,
      visibleOptions,
      ...attributes
    } = this.props;

    const {
      activeLabeL,
      filteredSuggestions,
      focusedListItem,
      initialDataKey,
      initialFocused,
      initialValue,
      showList
    } = this.state;

    const labelClasses = classNames(labelClass, activeLabeL && 'active', 'text-ellipsis-label');
    const inputClasses = classNames(inputClass, 'text-ellipsis-input');
    const btnClearClasses = classNames(
      clearClass,
      initialFocused && 'autocomplete-btn-svg',
      'mdb-autocomplete-clear visible'
    );
    return (
      <div data-test='auto-complete' style={{ position: 'relative' }}>
        <MDBInput
          className={inputClasses}
          hint={placeholder}
          inputRef={ref => (this.autoInputRef = ref)}
          labelClass={labelClasses}
          labelStyles={{ width: '200px', ...labelStyles }}
          onBlur={e => this.toggleFocusToClearBtn(e, false)}
          onChange={this.inputOnChangeHandler}
          onClick={() => focused && this.setSuggestions(initialValue)}
          onContextMenu={e => e.preventDefault()}
          onFocus={e => this.toggleFocusToClearBtn(e, true)}
          onKeyDown={this.keyDownHandler}
          value={initialValue}
          role='combobox'
          aria-haspopup='true'
          aria-expanded={showList}
          {...attributes}
        >
          {clear && initialValue && (
            <button onClick={this.handleClear} className={btnClearClasses}>
              <MDBIcon icon='times' style={{ color: initialFocused && '#4285F4' }} />
            </button>
          )}
        </MDBInput>

        {showList && (
          <ul
            className='mdb-autocomplete-wrap'
            onClick={this.handleSelect}
            ref={ref => (this.suggestionsList = ref)}
            style={{
              marginTop: '-15px',
              maxHeight: `${heightItem * Number(visibleOptions)}px`
            }}
          >
            {filteredSuggestions.map((el, index) => {
              const highlighted = this.getHighlightedText(el, initialValue);

              return (
                <li
                  key={el + index}
                  onMouseEnter={() => this.listOnMouseEnter(index)}
                  className={`list-item ${focusedListItem === index ? 'grey lighten-3' : 'white'}`}
                  data-index={index}
                  onMouseMove={() => this.listOnMouseMove(index)}
                >
                  {typeof el[0] === 'string' ? (highlight ? highlighted : el) : el[initialDataKey]}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

Autocomplete.propTypes = {
  clear: PropTypes.bool,
  clearClass: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  dataKey: PropTypes.string,
  focused: PropTypes.bool,
  getValue: PropTypes.func,
  heightItem: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  highlight: PropTypes.bool,
  highlightBold: PropTypes.bool,
  highlightClasses: PropTypes.string,
  highlightStyles: PropTypes.object,
  inputClass: PropTypes.string,
  labelClass: PropTypes.string,
  labelStyles: PropTypes.node,
  noSuggestion: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  valueDefault: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  visibleOptions: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Autocomplete.defaultProps = {
  focused: true,
  heightItem: 45,
  highlight: false,
  highlightBold: true,
  labelStyles: '',
  noSuggestion: ['No options'],
  visibleOptions: 5
};

export default Autocomplete;
export { Autocomplete as MDBAutocomplete_v5 };
export { Autocomplete as MDBAuto_v5 };
