---
title: 'JavaScript中的 "Illegal invocation" 异常'
pubDate: 2024-05-20T13:11:00.000Z
description: '"Illegal invocation" 何时会出现？ 当调用一个函数时，如果其this关键字没有指向它最初指向的对象，即函数的“上下文”丢失时，就会抛出这个错误。'
tags: []
---

## "Illegal invocation" 何时会出现？

当调用一个函数时，如果其`this`关键字没有指向它最初指向的对象，即函数的“上下文”丢失时，就会抛出这个错误。

### 示例问题

在代理后的HTML元素上调用原来所具有的放法就会跑出该异常。例如：

```javascript
const proxyBody = new Proxy(document.body, {});

proxyBody.getClientRects();
// Uncaught TypeError: Illegal invocation
```

另外，除了 `Proxy`包装后对对象，在解构对象时，也会出现类似对情况。例如， 在调用`AbortController`解构后的`abort`方法时，也会出现“Illegal invocation”错误：

```javascript
const abortController = new AbortController();
const { abort } = abortController;

abort(); //=> TypeError: Illegal invocation
```

另一个案例：尝试为`document.querySelector`和`document.querySelectorAll`实现类似`jQuery`的简写：

```javascript
const $ = document.querySelector;
const $$ = document.querySelectorAll;

$("#foo"); //=> TypeError: Illegal invocation

$$(".bar"); //=> TypeError: Illegal invocation
```

（PS：其实大多数现代浏览器都在控制台Console中内置了`$`和`$$`方法。）

## 错误描述

“invocation” 是调用函数的意思，这与‘call’函数相同。invocation === call。

当**调用一个函数时，如果其`this`关键字没有指向它最初指向的对象**，就会抛出“Illegal invocation”错误。换句话说，就是函数的原始“上下文”丢失了。

### 手动演示 “Illegal invocation” 异常的检查机制

```javascript
const foo = {
  bar: function () {
    console.log("Calling foo.bar; `this` refers to", this);

    if (this !== foo) {
      throw new TypeError("Illegal invocation 🛑");
    }

    console.log("Successfully called foo.bar ✅");
  },
};

foo.bar();
//=> Calling foo.bar; `this` refers to foo
//=> Successfully called foo.bar ✅

const { bar } = foo;
bar();
//=> Calling foo.bar; `this` refers to window
//=> TypeError: Illegal invocation 🛑

const bar2 = foo.bar;
bar2();
//=> Calling foo.bar; `this` refers to window
//=> TypeError: Illegal invocation 🛑
```

注释：

- 在实际代码中，应该使用更好的错误消息。“Illegal invocation”这个说法不够清晰。
- 在严格模式下，错误情况下的`this`将是`undefined`，不会是`window`。

## 为什么`this`关键字会改变？

因为[JavaScript中的`this`关键字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)是令人困惑的！

关键在于方法调用和函数调用之间的区别。

### 方法调用

方法是一个作为对象属性存储的函数。当使用"**.**"表示法或方括号"**[]**"表示法调用（即调用）方法时，`this`关键字绑定到对象上：

```javascript
const foo = {
  bar() {
    console.log(this);
  },
};

const method = "bar";

// 方法调用：
foo.bar(); //=> foo
foo["bar"](); //=> foo
foo[method](); //=> foo
```

### 函数调用

当调用一个不是对象属性的函数时，`this`关键字是：

- 在[宽松模式](https://developer.mozilla.org/en-US/docs/Glossary/Sloppy_mode)下绑定到全局对象（window）。
- 在[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)下为`undefined`。

在任何模式下，原始上下文都会丢失，因为`this`关键字没有指向它最初指向的对象：

```javascript
const { bar } = foo;
const bar2 = foo.bar;
const bar3 = foo["bar"];

// 函数调用：
bar(); //=> window（在宽松模式下）/ undefined（在严格模式下）
bar2(); //=> window（在宽松模式下）/ undefined（在严格模式下）
bar3(); //=> window（在宽松模式下）/ undefined（在严格模式下）
```

至于为什么会丢失上下文——[Douglas Crockford的书《JavaScript: The Good Parts》](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/)：

> 当一个函数不是某个对象的属性时，那么它就是作为一个函数被调用的：
>
> ```javascript
> var sum = add(3, 4); // sum是7
> ```
>
> 当一个函数以这种模式被调用时，`this`绑定到全局对象`window`。
> 但，**这是语言设计中的一个错误。**

### 箭头函数

> 如果语言被合理设计，当内部函数被调用时，`this`仍然绑定到函数定义位置的`this`变量。
>
> 这个错误的后果是方法不能使用内部函数来帮助它完成工作，因为内部函数不共享方法对对象的访问，它的`this`绑定到了错误的值。
>
> 幸运的是，有一个简单的解决方法。如果方法定义了一个变量并将其赋值为`this`，
> 内部函数将通过该变量访问`this`。按照惯例，那个变量的名称是`that`：
>
> ```javascript
> var myObject = {
>   value: 3,
> };
>
> // 给myObject增加一个double方法
> myObject.double = function () {
>   var that = this; // 解决方案
>
>   var helper = function () {
>     that.value = add(that.value, that.value);
>   };
>
>   helper(); // 作为函数调用helper
> };
>
> myObject.double(); // 作为方法调用double
>
> console.log(myObject.value); //=> 6
> ```
>
> 现在你可以改用箭头函数：
>
> ```javascript
> myObject.double = function () {
>   const helper = () => {
>     this.value = add(this.value, this.value);
>   };
>
>   helper(); // 作为函数调用helper
> };
>
> myObject.double(); // 作为方法调用double
>
> console.log(myObject.value); //=> 6
> ```

箭头函数增加了围绕`this`关键字的复杂性。

无论如何，JavaScript中的`this`关键字令人困惑。

## 三种修复错误的方法

这是原始的有问题的示例代码：

```javascript
const proxyBody = new Proxy(document.body, {});
proxyBody.getClientRects();

const abortController = new AbortController();
const { abort } = abortController;

const $ = document.querySelector;
const $$ = document.querySelectorAll;
```

问题的要点在于调用`getClientRects`、`abort`、`$`或`$$`是函数调用，而不是方法调用，因为函数执行上下文会丢失。

## 创建一个调用方法的函数

正如我们上面学到的，使用方法调用（与函数调用相对），`this`关键字绑定到对象上。
因此，创建一个调用`abortController.abort`方法的abort函数：

```javascript
const abortController = new AbortController();
const abort = () => abortController.abort();

abort(); // OK!
```

调用`abort`是一个函数调用，但是`abort`反过来使用方法调用`abortController.abort`，因此上下文没有丢失。 对于`$`和`$$`也是一样的：

```javascript
const $ = (selectors) => document.querySelector(selectors);
const $$ = (selectors) => document.querySelectorAll(selectors);

$("#foo"); // OK!

$$(".bar"); // OK!
```

（顺便说一下：注意函数参数是复数形式：selectors而不是selector。那是因为`document.querySelector`和`document.querySelectorAll`接受逗号分隔的CSS选择器列表。）

但是，这种方式不适用于 `Proxy` 对象，因为它是在内部更改了方法调用的 `this` 指向。

### 使用bind()更改`this`关键字

一个更强大的解决方法是使用`Function.prototype.bind()`将`this`关键字设置为指向正确的对象：

```javascript
const proxyBody = new Proxy(document.body, {});
const getClientRects = proxyBody.getClientRects.bind(document.body);

const abortController = new AbortController();
const abort = abortController.abort.bind(abortController);

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

getClientRects(); // OK!

abort(); // OK!

$("#foo"); // OK!
$$(".bar"); // OK!
```

`Function.prototype.bind()` 会生成一个指向新`this`d的函数，除此之外，更多情况下一般是使用`Function.prototype.apply()`和`Function.prototype.call()`

### 导出整个对象

在`AbortController`的情况下，最初是解构出 `abort`方法，因为只想导出这一个方法，而不是整个`AbortController`。

但如果不介意导出整个`AbortController`，直接调用其`abort`方法也是可以的（因为这将是一个方法调用）：

```javascript
export const abortController = new AbortController();

// 在另一个文件中：

import { abortController } from "...";
abortController.abort(); // OK!
```

但这个解决方案不适用于`Proxy`、`$`和`$$`的情况。

## 来源/更多资源

Stack Overflow 上关于“Illegal invocation”的解释：

- ["Chrome中的Uncaught TypeError: Illegal invocation"](https://stackoverflow.com/q/9677985/1079869)
- [为什么某些JavaScript函数调用被称为“Illegal invocation”？](https://stackoverflow.com/q/10743596/1079869)
- [JavaScript中的Uncaught TypeError: Illegal invocation](https://stackoverflow.com/q/8904782/1079869)
