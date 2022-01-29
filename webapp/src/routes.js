import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { css } from '@emotion/core';
import { Home } from './home';
import TxForm from './components/TransactionForm/TxForm';

function AppRouter() {
  return (
    <Router>
      <div css={layoutStyle}>
        <nav css={navStyle}>
          <ul>
            <li>
              <img src="//app.divvy.co/assets/icons/favicon.ico" />
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/another">Another route</Link>
            </li>
            <li>
              <Link to="/add-transaction">Add Transaction</Link>
            </li>
          </ul>
        </nav>
        <div className="main-content" css={contentStyle}>
          <Route component={Home} exact path="/" />
          <Route component={() => <div>Content for /another route</div>} exact path="/another" />
          <Route component={TxForm} exact path="/add-transaction" />
        </div>
      </div>
    </Router>
  );
}

export default AppRouter;

const layoutStyle = css`
  display: grid;
  grid-row-gap: 24px;
`;

const navStyle = css`
  grid-row: 1;
  background-color: black;

  & > ul {
    display: flex;
    flex-direction: row;
    list-style-type: none;
  }

  & > ul > li:not(:first-of-type) {
    margin-left: 16px;
  }

  li {
    margin: auto;
  }

  li a {
    color: white;
    text-align: center;
  }
`;

const contentStyle = css`
  grid-row: 2;
`;
