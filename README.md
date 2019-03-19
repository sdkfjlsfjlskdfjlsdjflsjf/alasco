# Alasco Interview Problems

For the first two items there are no dependencies. I used `node v8.10.0`

## Rectangles

`node ./rectangles`

If the tests pass this is silent, so it is more useful to read the code than to run it.

## Dice

```
node ./dice.js
Stop when you lose money: bad!
Stop when you run out of money: bad!
Take out a loan: bad!
```

For this problem I realized that the rules on how to finish betting we ambigious, so I ran it three ways:
1) You stop once you loose more than the initial bet
2) You stop when you run out of money
3) You can go as negative as you want, and you stop after n iterations.

I stopped work on this to make time for other things. The results are currently not stable, you can run it multiple times and get different results.

## Currency Converter

I created a react app in `./currency-converter` using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). Setup should be:

```
cd ./currency-converter;
npm install;
npm test;
npm start;
```

But with npm, you can never be certain :)
