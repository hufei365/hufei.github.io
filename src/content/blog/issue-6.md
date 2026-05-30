---
title: 'ES6中箭头函数的作用'
pubDate: 2019-01-08T13:12:23.000Z
description: '关于ES6中的箭头函数，箭头函数 MDN这篇文章讲得已经很全面了。'
tags:
  - blog
  - JavaScript
---

关于ES6中的箭头函数，[箭头函数 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)这篇文章讲得已经很全面了。

## 箭头函数的两个作用

1. 更简短的函数写法
``` javascript
let arr = ['hello', 'book'];

arr.map(function(v){
    return v;
}); // ['hello', 'book']

arr.map((v)=>{
    return v;
}); // ['hello', 'book']

arr.map(v=>v);  //  ['hello', 'book']
```
2. 不绑定this
在箭头函数出现之前，每个新定义的函数都有它自己的 this值（在构造函数的情况下是一个新对象，在严格模式的函数调用中为 undefined，如果该函数被作为“对象方法”调用则为基础对象等）。
箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this。对箭头函数调用call/apply方法会忽略第一个参数。

``` javascript
let a = 1;
let f = ()=>{ console.log(this.a);}
f(); // 1
f.call({a:2}); // 1
```
3. 箭头函数不绑定arguments

``` javascript
let f = ()=>{ console.log(arguments);}
f(); // Uncaught ReferenceError: arguments is not defined

function a(n){
    let f = () => arguments[0] + n;
    return f();
}
a(1); // 2
```

4. 箭头函数不可以使用new操作符作为构造器，也没有prototype属性

``` javascript
let f = ()=>{};
new f(); // Uncaught TypeError: f is not a constructor
console.log(f.prototype); // undefined

function F(){};
console.log(F.prototype);  // {constructor: ƒ} F的构造函数
```
