---
title: '比Map自由度更高一些的flatMap'
pubDate: 2024-03-28T02:16:44.000Z
description: '比Map自由度更高一些的flatMap 在使用Array.prototype.map方法时，会返回一个新的数组，新的数组长度总是跟原有数组相同。 javascript const array1 = [1, 4, 9, 16]; // Pass a function to map const map1 = array1.map((x) => x 2); console.log(map1); // E…'
tags: []
---

# 比Map自由度更高一些的flatMap

在使用`Array.prototype.map`方法时，会返回一个新的数组，新的数组长度总是跟原有数组相同。
``` javascript
const array1 = [1, 4, 9, 16];

// Pass a function to map
const map1 = array1.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

如果我们想增删一些元素，那么该如何去做呢？
## 增加元素

``` javascript
const arr1 = [1, 2, 1];

const result = arr1.flatMap((num) => (num === 2 ? [num * 2, num * 4] : num));

console.log(result);
// Expected output: Array [1, 4, 8, 1]
```

## 删除元素
``` javascript
const arr1 = [1, 2, 1];

const result = arr1.flatMap((num) => (num === 2 ? [] : 1 * 10));

console.log(result);
// Expected output: Array [10, 10]
```

## 上述两个例子的输出结果该如何理解
`flatMap`方法其实等价于`arr.map(...args).flat()`。如果这样再去看上面的输出结果，是不是就瞬间清晰了很多。
``` javascript
const arr1 = [1, 2, 1];

const result = arr1.map((num) => (num === 2 ? [num * 2, num * 4] : num));

console.log(result); 
// output: [1, [4, 8], 1];

console.log(result.flat());
// Expected output: Array [1, 4, 8, 1]
```
