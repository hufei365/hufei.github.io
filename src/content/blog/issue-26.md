---
title: 'JS中的函数'
pubDate: 2019-07-08T15:08:50.000Z
description: 'JavaScript函数式编程'
tags:
  - JavaScript
---

# JavaScript函数式编程
## 函数也是对象
之所以说函数也是对象，是因为我们在命令式编程中，习惯于把非函数的普通对象当做参数进行传递。而实际上，普通对象能做的事情，函数也可以。

## 函数的两种定义方式
函数定义方式有两种：
1. 声明式（`function f(){}`);
2. 表达式（`var f = function(){}`）
## 函数中的形参和实参

## 函数中的arguments

## 函数中的this
`this`一般表示某个函数执行时，所处的上下文。这个上下文对象不仅跟函数定义的位置相关，也跟函数的调用方式相关。会影响函数执行上下文的主要下面四种调用方式。

## 函数的四种使用方式
1. 直接调用
```javascript
function f(){
	console.log(this.name);
}
f();
```
2. 通过对象调用
```javascript
let o = {
	name: 'O',
	f: function(){
		console.log(this.name);
	}
}
o.f();
```
3. 通过构造函数
```javascript
function f(){
	this.name = 'function f';
}
let f1 = new  f();
```
4. 通过apply/call的方式调用
```javascript
function f(){}
f.apply({}, []);
```

## 箭头函数
箭头函数通过定义的方式影响函数的上下文。

```javascript
(function () {
let name = 'window';

function fn() {
console.log(this);
}
let arrowFn = () => {
console.log(this);
}
let fnObj = {
name: 'fnObj',
fn: function () {
console.log(this.name);
},
arrowFn: () => {
console.log(this.name)
},
fnNestArrow: function () {
let fn = () => {
console.log(this);
};

fn();
}
}
fn();
arrowFn();
arrowFn.call({
name: 'arrowFn apply'
});
fnObj.fn();
fnObj.arrowFn();
let newArrowFn = fnObj.arrowFn;
newArrowFn();

fnObj.fnNestArrow();
fnObj.fnNestArrow.call(this);
})()

```

## bind方法

## 闭包与作用域

## 生成器函数Generator
