---
title: "深拷贝——忘记JSON.parse 和 JSON.stringify，拥抱structuredClone"
pubDate: "2024-09-10T02:11:30Z"
description: "深拷贝——忘记JSON.parse 和 JSON.stringify，拥抱structuredClone"
tags: []
sourceIssue: 45
sourceUrl: "https://github.com/hufei365/notebook/issues/45"
sourceHash: "97e7a5a8560f449bf4daa80e2453480802267da02581695763779d4132121470"
---

*   **`structuredClone()`是什么？**
    
    *   `structuredClone()`是在2022年引入的一个全局函数，它能够深度克隆JavaScript对象。与传统的方法`JSON.stringify()`和`JSON.parse()`不同。之前的方法在处理复杂结构和循环引用时存在一定的问题，而`structuredClone()`则能够轻松应对这些挑战。

*   **为什么它是一个游戏规则改变者？**
    
    *   它是一个强大的工具，用于实现真正的深度克隆，保留嵌套对象和循环引用的完整性，无需额外的逻辑或hack方法。此外，它在现代浏览器中可用，这其中也包括Web Workers。

* * *

#### [](#1-简单对象克隆基础)**1. 简单对象克隆：基础**

*   **使用`{...obj}`（浅拷贝）**
```javascript
      const original = { name: "Alice", details: { age: 25 } };
      const shallowCopy = { ...original };
    
      shallowCopy.details.age = 30;
    
      console.log(original.details.age); // 30
      console.log(shallowCopy.details.age); // 30
```


*   **发生了什么？**
    
    *   展开运算符`{...obj}`只创建浅拷贝。`details`对象没有被深度克隆，因此对`shallowCopy.details`的更改也会影响原始的`details`。
    *   **使用`JSON.stringify()` + `JSON.parse()`（深度拷贝）**
```javascript
      const original = { name: "Alice", details: { age: 25 } };
      const deepCopy = JSON.parse(JSON.stringify(original));
    
      deepCopy.details.age = 30;
    
      console.log(original.details.age); // 25
      console.log(deepCopy.details.age); // 30
```


*   **发生了什么？**
    
    *   这种方法创建了一个深度拷贝，但它有局限性：它无法处理`Function`、`undefined`或循环引用。
    *   **使用`structuredClone()`（深度拷贝）**
```javascript
      const original = { name: "Alice", details: { age: 25 } };
      const clone = structuredClone(original);
    
      clone.details.age = 30;
    
      console.log(original.details.age); // 25
      console.log(clone.details.age); // 30
```


*   **发生了什么？**
    *   `structuredClone()`创建了一个深度克隆，保留了结构，没有任何`JSON.stringify()`的限制，并能够处理复杂的数据类型，如循环引用和`undefined`。

* * *

#### [](#2-处理循环引用一个挑战)**2. 处理循环引用：一个挑战**

*   **使用`{...obj}`的循环引用**
```javascript
      const original = { name: "Alice" };
      original.self = original;
    
      // 这将导致一个错误：
      const shallowCopy = { ...original }; // TypeError: Converting circular structure to JSON
```


*   **发生了什么？**
    
    *   `{...obj}`无法处理循环引用，导致错误。
    *   **使用`JSON.stringify()`的循环引用**
```javascript
      const original = { name: "Alice" };
      original.self = original;
    
      // 这将导致一个错误：
      const jsonCopy = JSON.parse(JSON.stringify(original)); // TypeError: Converting circular structure to JSON
```


*   **发生了什么？**
    
    *   `JSON.stringify()`也处理不了循环引用，抛出错误。
    *   **使用`structuredClone()`的循环引用**
```javascript
      const original = { name: "Alice" };
      original.self = original;
    
      const clone = structuredClone(original);
    
      console.log(clone !== original); // true
      console.log(clone.self === clone); // true
```


*   **发生了什么？**
    *   `structuredClone()`能够无缝处理循环引用，创建一个正确的深度克隆，没有错误。

* * *

#### [](#3-克隆包含函数和undefined的另一个测试)**3. 克隆包含函数和`undefined`：另一个测试***   **使用 `{...obj}`**
```javascript
      const original = { name: "Alice", greet: () => "Hello!", value: undefined };
      const shallowCopy = { ...original };
      
      console.log(shallowCopy.greet()); // "Hello!"
      console.log(shallowCopy.value); // undefined
```


*   **发生了什么？**
    
    *   `{...obj}` 按预期复制函数和 `undefined`，但只是浅拷贝。
    *   **使用 `JSON.stringify()`**
```javascript
      const original = { name: "Alice", greet: () => "Hello!", value: undefined };
      const jsonCopy = JSON.parse(JSON.stringify(original));
    
      console.log(jsonCopy.greet); // undefined
      console.log(jsonCopy.value); // undefined
```


*   **发生了什么？**
    
    *   `JSON.stringify()` 无法序列化函数或 `undefined`，导致在克隆对象中丢失它们。
    *   **使用 `structuredClone()`**
```javascript
      const original = { name: "Alice", greet: () => "Hello!", value: undefined };
      const clone = structuredClone(original);
    
      console.log(clone.greet); // undefined
      console.log(clone.value); // undefined
```


*   **发生了什么？**
    *   `structuredClone()` 也不克隆函数，但保留 `undefined` 值，使其比 `JSON.stringify()` 更可靠，适用于复杂对象。

* * *

#### [](#4速度和效率-性能提示)**4. 速度和效率：性能提示**

*   **处理大数据的效率**
```javascript
      const largeArray = new Array(1e6).fill({ key: "value" });
    
      console.time("structuredClone");
      const clone = structuredClone(largeArray);
      console.timeEnd("structuredClone");
    
      console.time("JSON.stringify + JSON.parse");
      const jsonCopy = JSON.parse(JSON.stringify(largeArray));
      console.timeEnd("JSON.stringify + JSON.parse");
```


*   **发生了什么？**
    *   `structuredClone()` 通常比 `JSON.stringify()` + `JSON.parse()` 更快，适用于大型复杂数据，避免了序列化和反序列化的陷阱。

* * *

#### [](#5结论-为什么-raw-structuredclone-endraw-是未来)**5. 结论：为什么 `structuredClone()` 是未来**

*   **可靠性**：更可预测地处理循环引用、函数和 `undefined` 值。
*   **效率**：对于大型数据集执行深度克隆更快，不需要变通方法。
*   **简洁性**：一种方法统治所有——不再需要在 `{...obj}`, `JSON.stringify()` 或自定义深度克隆函数之间选择。
