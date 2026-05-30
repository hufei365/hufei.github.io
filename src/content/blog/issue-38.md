---
title: '真得懂了？自定义实现 Javascript 中的 call、apply 和 bind 方法'
pubDate: 2024-04-18T00:25:45.000Z
description: '自定义实现 Javascript 中的 call、apply 和 bind 方法 通常情况下，在调用函数时，函数内部的 this 的值是访问该函数的对象。利用 call、apply 和 bind，你可以在调用现有函数时将任意值分配给 this，而无需先将函数作为属性附加到对象上。这使得你可以将一个对象的方法用作通用的实用函数。'
tags: []
---

# 自定义实现 Javascript 中的 call、apply 和 bind 方法

通常情况下，在调用函数时，函数内部的 this 的值是访问该函数的对象。利用 `call`、`apply` 和 `bind`，你可以在调用现有函数时将任意值分配给 `this`，而无需先将函数作为属性附加到对象上。这使得你可以将一个对象的方法用作通用的实用函数。

## call 方法

`call` 方法的原始使用方式：

``` javascript
function sayName(hello) {
    console.log(hello, this.name);
}
const p1 = {
    name: "HuFei"
};
sayName.call(p1, "welcome ");
```

上面的示例将输出：welcome  HuFei 。

分析 `call` 函数的基本原理，就会注意到以下几点：
1. 调用函数调用的原型改变了它的指向，即上面的函数调用变成了`p1.name`；
2. 无论我们传递给 `sayName.call` 的参数是什么，都应作为arg1、arg2、......传递给原来的 `sayName`；
3. 不会对 `p1` 和 `sayName` 函数产生副作用，即 `call` 函数不会以任何方式修改原始的 `p1` 或 `sayName`；

尝试实现自定义 `call` 函数的第一步，将自定义的 `myCall` 追加到 `Function` 的原型对象上面。
``` javascript
Function.prototype.myCall = function(newThis) {
    newThis.fnName = this;
    const result = newThis.fnName();
    delete newThis.fnName;
    return result;
};
```
然后我们呢就可以像下面这样改变  `sayName` 的 `this` 指向了。
``` javascript
sayName.myCall(p1, 'welcome ');
```
这么写存在一个问题，就是函数第一个参数后面的参数无法进行传递，所以需要对 `myCall` 做一些改动。

想要传递参数，需要借助 JavaScript 中的  `eval` 函数。

`eval` 函数会将传入的字符串当做 JavaScript 代码进行执行。传入的字符串可以是 JavaScript 表达式、语句或语句序列；表达式可以包括变量和现有对象的属性

``` javascript
Function.prototype.myCall = function(newThis, ...args) {
    newThis.fnName = this;
    const argsStr = [];
    args.forEach((x, i) => [
        argsStr.push(`argsStr[${i}]`)
    ])
    const result = eval("newThis.fnName(" + args.toString() + ")");
    delete newThis.fnName;
    return result;
};
```

但是上面的实现，还有一个问题，假如newThis 本身已经存在属性 `fnName`，那么 `myCall` 方法最终会删除 `newThis` 原有的 `fnName`。

所以该怎么办呢？ 

可以生成一个uuid，用于新的属性。
``` javascript
Function.prototype.myCall = function(newThis, ...args) {
    const key = String(parseInt(1000 * Math.random())) + Date.now();
    newThis[key] = this;
    const argsStr = [];
    args.forEach((x, i) => [
        argsStr.push(`args[${i}]`)
    ])
    const result = eval("newThis[key](" + argsStr.toString() + ")");
    delete newThis[key];
    return result;
};
```


这时候可以借助 ES6 引入的 `Symbol` 特性。

``` javascript
Function.prototype.myCall = function(newThis, ...args) {
    const key = Symbol('fnName');
    newThis[key] = this;
    const argsStr = [];
    args.forEach((x, i) => [
        argsStr.push(`args[${i}]`)
    ])
    const result = eval("newThis[key](" + argsStr.toString() + ")");
    delete newThis[key];
    return result;
};
```

`Symbols` 在 `for...in` 迭代中不可枚举。另外，`Object.getOwnPropertyNames()` 不会返回 `symbol` 对象的属性，但是你能使用 `Object.getOwnPropertySymbols()` 得到它们。

虽然不能完全避免副作用，但对 `Object.getOwnPropertySymbols()` 的应用 必然比不上 `for...in` 或 `Object.keys` 那样普遍。


## apply 方法
这个函数与 `call()` 几乎完全相同，只是函数参数在 `call()` 中逐个作为列表传递，而在 `apply()` 中它们会组合在一个对象中，通常是一个数组——例如：
`func.call(this, "eat", "bananas")` 
等价于
`func.apply(this, ["eat", "bananas"])`。

所以，它的自定义实现跟 `call` 相比，差别不大（只在第一行啊）。

``` javascript
Function.prototype.myApply = function(newThis, args) {
    const key = Symbol('fnName');
    newThis[key] = this;
    const argsStr = [];
    args.forEach((x, i) => [
        argsStr.push(`args[${i}]`)
    ])
    const result = eval("newThis[key](" + argsStr.toString() + ")");
    delete newThis[key];
    return result;
};
```


## bind 方法
相比 `call` 和 `apply`，`Function` 原型对象上的 `bind()` 方法会创建一个新函数。当调用该新函数时，它会调用原始函数并将其 `this` 指向设定为给定的值。同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。

`bind` 方法有以下几个特点：
1. 创建并返回一个新函数，可称之为绑定函数。该绑定函数封装了原始函数对象；
``` javascript
Function.prototype.myBind = function(newThis) {
    if (typeof this !== "function") {
        throw new Error(this + " cannot be bound as it's not callable");
    }
    const fn = Symbol('key')
    newThis[fn] = this;
    return function boundFunction() {
        return newThis[fn]();
    };
};

```

``` javascript
const person = {
    lastName: "Fei"
};

function fullName(salutaion, firstName) {
    console.log(salutaion, firstName, this.lastName);
}

const bindFullName = fullName.myBind(person, "Mr");

bindFullName("Hu ");
```
如果我们运行上述代码，得到的输出结果是：undefined undefined Fei
因此，如果你仔细观察一下，参数 "Mr" 是在创建绑定函数 `bindFullName` 时提供的，而参数 "Hu" 是在调用 `bindFullName` 时提供的，而 `bindFullName` 又会调用目标函数。因此，当我们调用带有参数 "Hu " 的 `bindFullName` 时，参数 "Mr" 被添加到参数列表中。

让我们尝试在自己的 `myBind` 方法中实现同样的功能。

``` javascript
Function.prototype.myBind = function (newThis, ...boundArguments) {
    if (typeof this !== "function") {
        throw new Error(this + "cannot be bound as it's not callable");
    }
    const key = Symbol('key')
    newThis[key] = this;
    return function boundFunction(...args) {
        const argsStr = [];
        boundArguments.forEach((x, i) => {
            argsStr.push(`boundArguments[${i}]`)
        })
        args.forEach((x, i) => [
            argsStr.push(`args[${i}]`)
        ])
        return eval("newThis[key](" + argsStr.toString() + ")");
    };
};
```
绑定完成了吗？还没有，我们还漏掉了 MDN 定义中 thisArg 的绑定。

> 如果使用 new 运算符构造绑定函数，则忽略该值。

这意味着，当使用`new` 操作符调用绑定函数时，我们需要忽略在创建绑定函数时传递的这个值。以上面的例子 `new bindFullName("Hu")` 为例，输出结果应该是：Mr Hu undefined。

所以，此时应当判断当点函数是作为普通函数调用还是作为构造函数调用。

``` javascript
Function.prototype.myBind = function (newThis, ...boundArguments) {
    if (typeof this !== "function") {
        throw new Error(this + "cannot be bound as it's not callable");
    }
    const key = Symbol('key')
    newThis[key] = this;
    return function boundFunction(...args) {
        const argsStr = [];
        boundArguments.forEach((x, i) => {
            argsStr.push(`boundArguments[${i}]`)
        })
        args.forEach((x, i) => [
            argsStr.push(`args[${i}]`)
        ])
        const isConstructor = this instanceof boundFunction;
        if (isConstructor) {
            // new operator
            return 
        } else {
            return eval("newThis[key](" + argsStr.toString() + ")");
        }
    };
};
```


MDN 有一个很好的 bind polyfill，可以解决 `new` 操作符的问题。它的基本思路是设置一个中间构造函数 `fNOP`，以便绑定函数和 `bind()` 函数调用在同一个原型链上，因为使用 `new` 操作符调用绑定函数涉及到原型链的传递。
