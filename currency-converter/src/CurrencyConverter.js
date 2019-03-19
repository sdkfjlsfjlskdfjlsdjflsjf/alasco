import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

// Default values (UI won't load until these are updated)
let currentConversions = {
  'USD': {
    'EUR': 0.88,
    'JPY': 111.29,
  },
  'EUR': {
    'USD': 1.13,
    'JPY': 126.34,
  },
  'JPY': {
    'USD': 0.0090,
    'EUR': 0.0079, 
  }
};

const currencyList = ['USD', 'JPY', 'EUR' ];

async function getConversions() {
  const newConversions = {};
  const conversions = await Promise.all(currencyList
    .map(async (currency) => {
      const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`)
      return [
        currency,
        await response.json(),
      ]
    }));
  conversions.forEach(conversion => {
    newConversions[conversion[0]] = {};
    currencyList.forEach(currency => {
      newConversions[conversion[0]][currency] = conversion[1].rates[currency];
    });
  });
  console.log(newConversions);
  return newConversions;
}

function convert(amount, from, to) {
  if (from === to) { return amount; }
  if (currentConversions[from] && currentConversions[from][to]) {
    return amount * currentConversions[from][to];
  }
  // Trap a possible setup error
  console.error(`Currency conversion not available ${from} -> ${to}`);
  return amount;
}

function showNumber(value) {
  if (typeof(value) === 'number') {
    if (value >= 1) {
      return value.toFixed(2);
    }
    return value.toFixed(6);
  }
  return value;
}
class CurrencyItem extends React.Component {
  render() {
    const { amount, currency, changeCurrency, changeAmount } = this.props;
    return (
      <Form.Row>
        <Col>
          <Form.Label>Amount</Form.Label>
          <Form.Control type="text" value={showNumber(amount)} onChange={changeAmount} />
        </Col>
        <Col>
          <Form.Label>Currency</Form.Label>
          <Form.Control as="select" onChange={changeCurrency} value={currency}>
            {currencyList.map(availableCurrency => (<option key={availableCurrency} value={availableCurrency}>{availableCurrency}</option>))}
          </Form.Control>
        </Col>
      </Form.Row>
    );
  }
}

class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversionsLoaded: false,
      a: {
        currency: props.currency || 'EUR',
        amount: props.amount || 1,
      },
      b: {
        currency: props.currency || 'USD',
        amount: props.amount || 1.13,
      },
    };
  }

  componentDidMount() {
     getConversions().then(result => {
      currentConversions = result;
      console.log(result);
      this.setState({ conversionsLoaded: true });
    });
  }

  changeCurrency(item, evt) {
    const newCurrency = evt.target.value;
    if (currencyList.includes(newCurrency)) {
      const newState = Object.assign({}, this.state);
      if (item === 'a') {
        newState.a.currency = newCurrency;
        newState.b.amount = convert(newState.a.amount, newState.a.currency, newState.b.currency);
      } else {
        newState.b.currency = newCurrency;
        newState.a.amount = convert(newState.b.amount, newState.b.currency, newState.a.currency);
      }
      return this.setState(newState);
    }
  }

  changeAmount(item, evt) {
    const newAmount = Number(evt.target.value);
    console.log(newAmount);
    const newState = Object.assign({}, this.state);
    if (item === 'a') {
      newState.a.amount = evt.target.value;
      if (!Number.isNaN(newAmount)) {
        newState.b.amount = convert(newState.a.amount, newState.a.currency, newState.b.currency);
      }
    } else {
      newState.b.amount = evt.target.value;
      if (!Number.isNaN(newAmount)) {
        newState.a.amount = convert(newState.a.amount, newState.b.currency, newState.a.currency);
      }

    }
    console.log(newState);
    return this.setState(newState);
  }

  render() {
    if (!this.state.conversionsLoaded) {
      return <div className="loading">Loading</div>;
    }
    const changeCurrencyA = (evt) => this.changeCurrency('a', evt);
    const changeCurrencyB = (evt) => this.changeCurrency('b', evt);
    const changeAmountA = (evt) => this.changeAmount('a', evt);
    const changeAmountB = (evt) => this.changeAmount('b', evt);
    return (
      <Container>
        <Form>
            <CurrencyItem item='a' changeCurrency={changeCurrencyA} changeAmount={changeAmountA} {...this.state.a} />
            <CurrencyItem item='b' changeCurrency={changeCurrencyB} changeAmount={changeAmountB}  {...this.state.b} />
        </Form>
      </Container>
    );
  }
}

export default CurrencyConverter;