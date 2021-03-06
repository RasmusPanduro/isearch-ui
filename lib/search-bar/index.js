import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { noSuggestions, defaultSuggestions } from './defaultSuggestions';
import LoadingSpinner from '../spinner';
import './style.css';
let counter = 0;
const searchIcon = require('../../src/assets/search.svg');

let keyPressTimeout;

function getSuggestionValue (suggestion) {
  return suggestion.name;
}

function renderSuggestion (suggestion) {
  return (
      <div className='suggestionItem'>{suggestion.label}</div>
  );
}

function getSectionSuggestions (section) {
  return section.suggestions;
}

function renderTitle (title) {
  if (!title) return;
  return (
    <div className='noSuggestion'>
      {title}
    </div>
  );
}

function renderSectionTile (section) {
  return (
    <div className='sectionItem'>
      { renderTitle(section.title) }
      <div className='tryThis'>
        {section.subTitle}
      </div>
    </div>
  );
}

export default class SearchBarContainer extends Component {

  constructor () {
    super();
    this.state = {
      option: {},
      value: '',
      suggestions: [],
      isLoading: false,
      multiSection: false,
      placeholder: 'Tilføj til din rejse præferencer',
      isMobile: window.screen.height < 750,
      searchInFocus: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  handleOnClick () {
    document.getElementsByClassName('searchBox')[0].focus();
  }

  handleOnOptionSelected (option) {
    this.setState({ value: '', suggestions: [], option }, () => {
      this.onSearchButtonClick();
      document.activeElement.blur();
    });
  }
  onSearchButtonClick () {
    const {
      props: { addSingleTag },
      state: { option }
    } = this;
    if (option.tagid && option.label) {
      addSingleTag(option.label, option.tagid);
      this.setState({ option: {}, value: '', suggestions: [], multiSection: false, isLoading: false });
    }
  }

  onChange (event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onFocus (e) {
    e.preventDefault();
    const autocompleteOptions = this.state.value === '' ? defaultSuggestions : this.props.autocompleteOptions.length ? this.props.autocompleteOptions : noSuggestions;
    this.setState({
      suggestions: autocompleteOptions,
      isLoading: false,
      multiSection: this.state.value === '' || !this.props.autocompleteOptions.length,
      placeholder: '',
      searchInFocus: true
    });
  }

  onBlur (e) {
    this.setState({
      searchInFocus: false,
      placeholder: ''
    });
  }

  onSuggestionsUpdateRequested ({ value }) {
    this.setState({
      isLoading: true
    });
    const { setSearchString, getAutocompleteOptions } = this.props;
    setSearchString(value);
    getAutocompleteOptions(value).then(() => {
      const autocompleteOptions = this.props.autocompleteOptions.length ? this.props.autocompleteOptions : (value === '' ? defaultSuggestions : noSuggestions);
      const multiSection = !this.props.autocompleteOptions.length;

      this.setState({
        suggestions: (value === this.state.value) ? autocompleteOptions : [],
        isLoading: false,
        multiSection: multiSection
      });
      clearTimeout(keyPressTimeout);
      if (value && this.state.value === value && value !== '') {
        keyPressTimeout = setTimeout(() => {
          const analyticsObject = {
            event: 'searchTyping',
            searchInput: value,
            suggestions: this.props.autocompleteOptions ? this.props.autocompleteOptions.length : 0
          };
          dataLayer.push(analyticsObject);
        }, 3000);
      }
    });
  }
  placeholderSwitch () {
    const placeholders = [
      'Barcelona...',
      'All inclusive...',
      'Spa & relax...',
      'London...',
      'Mad...',
      'Drømstrand...',
      'New York...',
      'Shopping...',
      'Prag...',
      'Seværdigheder...',
      'Madrid...',
      'Restaurant...',
      'Rom...'
    ];
    if (this.state.searchInFocus) {
      this.setState({
        placeholder: ''
      });
    } else {
      this.setState({
        placeholder: placeholders[counter]
      });
    }
    counter++;
    if (counter === placeholders.length) {
      counter = 0;
    }
  }
  componentDidMount () {
    this.interval = setInterval(this.placeholderSwitch.bind(this), 4000);
  }
  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render () {
    const { value, suggestions, multiSection, placeholder, isMobile } = this.state;
    const { departureDate, showTravelInfo, inAutoCompleteSearch } = this.props;
    const inputProps = {
      placeholder: placeholder,
      value,
      onChange: this.onChange,
      className: 'searchBox',
      type: 'search',
      onFocus: this.onFocus
    };
    return (
      <div className='searchBarContainer'>
        <div className={'inputContainer ' + (isMobile ? 'mobile' : '')}>
          <img src={searchIcon} className='searchIcon' alt='search' onClick={this.handleOnClick.bind(this)}/>
          {inAutoCompleteSearch && <div className='autosuggestSpinner'><LoadingSpinner /></div>}
          <div onBlur={() => this.onBlur()}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              focusInputOnSuggestionClick={false}
              onSuggestionSelected={(event, { suggestion }) => this.handleOnOptionSelected(suggestion) }
              multiSection={multiSection}
              renderSectionTitle={renderSectionTile}
              getSectionSuggestions={getSectionSuggestions}
              shouldRenderSuggestions={() => true}
              focusFirstSuggestion
            />
          </div>
          <div className='travelInfoChange' onClick={() => showTravelInfo()}>
            <div className='leavingDate'>{`Tidigste afrejse: ` + departureDate}</div>
            <div className='leavingDateChangeButton'>Ændre</div>
          </div>
        </div>
      </div>
    );
  }
}

SearchBarContainer.propTypes = {
  addSingleTag: PropTypes.func,

  // search
  setSearchString: PropTypes.func,
  startSearch: PropTypes.func,
  departureDate: PropTypes.string,
  showTravelInfo: PropTypes.func,

  // autocomplete
  autocompleteOptions: PropTypes.array,
  getAutocompleteOptions: PropTypes.func,
  inAutoCompleteSearch: PropTypes.bool,

  // navigation
  go: PropTypes.func,
  tagView: PropTypes.bool
};
