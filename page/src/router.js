import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
import Layout from './routes/layout';

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Layout} />
    </Router>
  );
};
