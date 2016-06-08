import React, { PropTypes, Component } from 'react';
import Header from '../../../lib/hero-image-header/';
import SearchSummary from '../../../lib/search-summary';
import Tags from '../../../lib/tags/';
import SearchResults from '../search-results';
import LoadingSpinner from '../../../lib/spinner';
import SearchBar from '../../../lib/search-bar';
import ScrollView from '../../../lib/scroll-view';
import './style.css';

class ISearch extends Component {

  constructor () {
    super();
    this.state = {
      screenWidth: window.innerWidth,
      feedItems: [],
      endScroll: false
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize);
    if (!this.props.tags.length) {
      this.props.resetTags();
    }
  }

  handleResize () {
    this.setState({ screenWidth: window.innerWidth });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  renderResults () {
    const {
      onYesFilter,
      onFilterClick,
      setHotelPage,
      numberOfChildrenTitle,
      numberOfAdultsTitle,
      resultId,
      push: changeRoute,
      viewedArticles,
      removeTile,
      displayedItems,
      loadMoreItemsIntoFeed,
      addSingleTag,
      scrollPage,
      searchComplete
    } = this.props;
    return (
      <ScrollView
        loadingThreshold={500}
        loadData={loadMoreItemsIntoFeed}
        endScroll={displayedItems.length === 0}
        page={scrollPage}
      >
        <SearchResults
          changeRoute={changeRoute}
          items={displayedItems}
          onYesFilter={onYesFilter}
          onFilterClick={onFilterClick}
          setHotelPage={setHotelPage}
          totalPassengers={Number(numberOfAdultsTitle) + Number(numberOfChildrenTitle)}
          resultId={resultId}
          removeTile={removeTile}
          viewedArticles={viewedArticles}
          addSingleTag={addSingleTag}
          searchComplete={searchComplete}
        />
      </ScrollView>
    );
  }

  render () {
    console.log('----RENDERING GRID----');
    const {
      tags,
      removeTag,
      resetTags,
      setSearchString,
      startSearch,
      autocompleteOptions,
      searchString,
      getAutocompleteOptions,
      inAutoCompleteSearch,
      addSingleTag,
      clearSearchString,
      error,
      loading,
      numberOfChildren,
      numberOfAdults,
      childAge1,
      childAge2,
      childAge3,
      childAge4,
      departureAirport,
      duration,
      departureDate,
      setNumberOfChildren,
      setNumberOfAdults,
      setChildAge,
      setDepartureAirport,
      setDuration,
      updateHeaderTitles,
      numberOfChildrenTitle,
      numberOfAdultsTitle,
      durationTitle,
      setDepartureDate,
      push: changeRoute,
      goBack,
      displayedItems
    } = this.props;
    return (
      <section>
        <SearchSummary
          numberOfChildren={numberOfChildren}
          numberOfAdults={numberOfAdults}
          setChildAge={setChildAge}
          childAge1={childAge1}
          childAge2={childAge2}
          childAge3={childAge3}
          childAge4={childAge4}
          departureAirport={departureAirport}
          duration={duration}
          departureDate={departureDate}
          setNumberOfChildren={setNumberOfChildren}
          setNumberOfAdults={setNumberOfAdults}
          setDepartureAirport={setDepartureAirport}
          setDuration={setDuration}
          updateHeaderTitles={updateHeaderTitles}
          numberOfAdultsTitle={numberOfAdultsTitle}
          numberOfChildrenTitle={numberOfChildrenTitle}
          durationTitle={durationTitle}
          setDepartureDate={setDepartureDate}
          startSearch={startSearch}
          changeRoute={changeRoute}
          goBack={goBack}
        />
        {
          this.state.screenWidth < 553 ? [
            <Header
              searchBar={false}
              displayedItems={displayedItems}
            />,
            <SearchBar
              addSingleTag={addSingleTag}
              startSearch={startSearch}
              setSearchString={setSearchString}
              autocompleteOptions={autocompleteOptions}
              searchString={searchString}
              getAutocompleteOptions={getAutocompleteOptions}
              inAutoCompleteSearch={inAutoCompleteSearch}
              clearSearchString={clearSearchString}
            />
          ]
            : <Header
            addSingleTag={addSingleTag}
            startSearch={startSearch}
            setSearchString={setSearchString}
            autocompleteOptions={autocompleteOptions}
            searchString={searchString}
            getAutocompleteOptions={getAutocompleteOptions}
            inAutoCompleteSearch={inAutoCompleteSearch}
            clearSearchString={clearSearchString}
            searchBar
            displayedItems={displayedItems}
          />
        }
        <Tags
          tags={tags}
          removeTag={removeTag}
          resetTags={resetTags}
          resetColour={'#F39110'}
        />
        { loading &&
          <div className='spinnerContainer'>
            <LoadingSpinner/>
          </div>
        }
        { error && <div className='errorMessage'>{error}</div> }
        { this.renderResults() }
      </section>
    );
  }
}

ISearch.propTypes = {
  resultId: PropTypes.string,
  // results
  loading: PropTypes.bool,
  error: PropTypes.string,
  displayedItems: PropTypes.array,
  onYesFilter: PropTypes.func,
  onFilterClick: PropTypes.func,

  // scroll view
  loadMoreItemsIntoFeed: PropTypes.func,
  scrollPage: PropTypes.number,
  searchComplete: PropTypes.bool,

  // autocomplete
  autocompleteOptions: PropTypes.array,
  inAutoCompleteSearch: PropTypes.bool,
  getAutocompleteOptions: PropTypes.func,

  // search bar
  clearSearchString: PropTypes.func,
  setSearchString: PropTypes.func,
  searchString: PropTypes.string,
  startSearch: PropTypes.func,
  addSearchStringTag: PropTypes.func,

  // hotel
  setHotelPage: PropTypes.func,
  hotelInView: PropTypes.object,

  // article
  onAddArticleTag: PropTypes.func,
  viewArticle: PropTypes.func,

  // tags
  tags: PropTypes.array,
  addTag: PropTypes.func,
  addSingleTag: PropTypes.func,
  removeTag: PropTypes.func,
  resetTags: PropTypes.func,

  // tiles
  removeTile: PropTypes.func,

  // travel info
  setNumberOfChildren: PropTypes.func,
  setNumberOfAdults: PropTypes.func,
  setDepartureAirport: PropTypes.func,
  setDuration: PropTypes.func,
  numberOfChildren: PropTypes.string,
  numberOfAdults: PropTypes.string,
  childAge1: PropTypes.string,
  childAge2: PropTypes.string,
  childAge3: PropTypes.string,
  childAge4: PropTypes.string,
  departureAirport: PropTypes.string,
  duration: PropTypes.string,
  departureDate: PropTypes.string,
  setChildAge: PropTypes.func,
  numberOfAdultsTitle: PropTypes.string,
  numberOfChildrenTitle: PropTypes.string,
  durationTitle: PropTypes.string,
  updateHeaderTitles: PropTypes.func,
  setDepartureDate: PropTypes.func,

  // routing
  push: PropTypes.func,

  viewedArticles: PropTypes.array,
  goBack: PropTypes.func
};

export default ISearch;
