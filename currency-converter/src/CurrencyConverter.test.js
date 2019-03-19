import React from 'react';
import ReactDOM from 'react-dom';
import CurrencyConverter from './CurrencyConverter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CurrencyConverter />, div);
  div.querySelector('div.loading');
  expect(div.textContent).toBe('Loading');
  ReactDOM.unmountComponentAtNode(div);
});
