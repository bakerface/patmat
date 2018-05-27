# patmat
Pattern matching in vanilla JavaScript

This package was inspired by [Bram Stein's write up](https://www.bramstein.com/writing/advanced-pattern-matching.html). Below are a few examples from that article, which can be used to demonstrate functionality.

## Factorial

``` javascript
const { $, match } = require("patmat");

const factorial = match([
  [0, () => 1],
  [$, n => n * factorial(n - 1)]
]);

console.log(factorial(5)); // 120
```

## Binary Tree

``` javascript
const { $, _, type, match } = require("patmat");

const nil = type();
const node = type(t => [Number, t, t]);

const leaves = match([
  [nil, () => 0],
  [node(_, nil, nil), () => 1],
  [node(_, $, $), (a, b) => leaves(a) + leaves(b)]
]);

const toArray = match([
  [nil, () => []],
  [node($, $, $), (x, l, r) => toArray(l).concat(x, toArray(r))]
]);

const tree =
  node(4,
    node(2,
      node(1, nil, nil),
      node(3, nil, nil)),
    node(8,
      node(6,
        node(5, nil, nil),
        node(7, nil, nil)),
      node(9, nil, nil)));

console.log(leaves(tree)); // 5
console.log(toArray(tree)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
