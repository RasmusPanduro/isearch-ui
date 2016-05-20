// npm
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
// components
import ISearch from '../containers/isearch.js';
import ArticleFullPage from '../containers/article.js';
import HotelPage from '../containers/hotel';
import App from '../components/app';

// store
import configureStore from '../store/configure-store.js';
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// web socket service
import * as websocketService from '../services/websockets.js';
// client fingerprint service
import * as fingerprintService from '../services/fingerprint.js';

const actionCreatorBinder = actions => bindActionCreators(actions, store.dispatch);

export default class Root extends Component {

  componentDidMount () {
    websocketService.initialise(actionCreatorBinder);
    fingerprintService.initialise(actionCreatorBinder);
  }

  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={App} ignoreScrollBehavior>
            <IndexRoute component={ISearch}/>
            <Route path='search/:bucketId' component={ISearch}/>
            <Route path='article/:bucketId/:itemId' component={ArticleFullPage} />
            <Route path='hotel/:bucketId/:itemId' component={HotelPage} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
