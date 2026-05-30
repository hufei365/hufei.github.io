---
title: 'ES6之Promise'
pubDate: 2019-06-23T22:23:10.000Z
description: '什么是Promise Promise是JavaScript中为解决异步问题，结合社区已有规范，提出的一种异步编程解决方案。 在ES6中，Promise本身一个构造函数，原型链上有then、catch和finally等方法。自身的静态方法有all、race、reject和resolve等。'
tags:
  - JavaScript
  - ES6
  - Promise
---

## 什么是Promise
Promise是JavaScript中为解决异步问题，结合社区已有规范，提出的一种异步编程解决方案。
在ES6中，Promise本身一个构造函数，原型链上有then、catch和finally等方法。自身的静态方法有all、race、reject和resolve等。
![image](https://files.seeusercontent.com/2026/05/30/lE8i/img_e2248a37a100.png)



## Promise的三个状态
*请求态pending*、*完成态fulfilled*、*拒绝态rejected*。

一个需要记住的点：
> Promise的状态只可以由 `pending ——> fulfilled`或 `pending——> rejected`，一旦Promise状态发生改变，也就是说一旦Promise的状态变为fulfilled或者rejected，那么它的转态便不可再变。
> 
![image](https://files.seeusercontent.com/2026/05/30/6Cua/img_4c64e88cb01f.png)


## 手写一个Promise

```javascript
(function() {
    function P(fn) {
        var self = this;
        this.fullfilleds = [];
        this.faileds = [];

        function resolve() {
            self.fullfilled = true;
            let args = Array.prototype.slice.call(arguments);

            self.result = args;

            if (self.fullfilleds.length) {
					// 执行then方法注册的函数，真正的操作是将callbacks队列中的回调一一执行
                self.fullfilleds.forEach(fn=>{
                    fn.apply(null, args);
                })
            }
        }

        function reject() {}

        fn.call(null, resolve, reject);
    }

    P.prototype.then = function(fullfilled, failed) {
        if (this.fullfilled) {
            fullfilled.apply(null, this.result)
        } else if (this.failed) {
            failed(this.failed);
        } else {
            this.fullfilleds.push(fullfilled);
            this.faileds.push(failed);
        }
    }

    const p = new P((resolve,reject)=>{
        resolve('sync');
    });

    p.then(d=>{
        console.log(d);
    });

    setTimeout(()=>{
        p.then(d=>{
            console.log(d + 2);
        })
    }, 2000)
}
)()
```

## Promise的链式调用
### 回调地狱
使用回调解决异步编程的方案是一种比较简单直接方式。
``` javascript
// demo 1
setTimeout( ()=>{
	console.log("1秒钟后输出");
}, 1000);
// demo 2
Ajax.get('xxx', {}, function(data){
	// DO something
});
```

这种方案单层的回调还算可以，但如果回调里面又出现新的回调，产生嵌套。
像这种
```javascript
Ajax.get('xxx', {}, function(){
	Ajax.get('xxx', {}, function(){
		Ajax.get('xxx', {}, function(){
			// do something
		})
	});
})
```
Promise的链式调用则不存在此问题，在可以控制顺序 的前提下，可以比较直观地编写异步代码。
### 异常捕获
在回调函数的方案中，由于回调函数执行栈与原函数分开，导致无法捕获异常。这一点在Promise中，借助rejected，可以将错误捕获。

### 调用者主权
不同于回调函数，Promise借助then方法可以控制程序的执行。如果通过回调函数，调用者是不知道异步程序结束然后调用回调的。异步程序结束后，回回调函数被异步程序自己在后台默默调用，调用者失去了程序的控制权。但Promise中的then方法不存在此问题，因为then方法的调用者还是主程序本身。 
## Promise跟async/await的关系
简单地说，`async/await`是Promise的语法糖。因为async函数返回值是Promise类型，await 后面的语句吐出 的是一个Promise传给then方法的数据。
```javascript

(async function(){

    async function f(){
        return 1;
    }
    let a = f();
    console.log( a instanceof Promise); // true

    let b = await a;

    console.log(b); // 1

    let c = await Promise.resolve(2);

    console.log(c); // 2
})()
```
![image](https://files.seeusercontent.com/2026/05/30/Jnc3/img_714e44e7c1ff.png)


### async/await仅仅只是Promise的语法糖吗
相对于Promise，在处理 then 的调用链时，async/await的写法能够更清晰准确的写出代码 并且也能优雅地解决回调地狱问题。这更符合人类的线性思维方式。


[【翻译】Promises/A+规范-图灵社区](http://www.ituring.com.cn/article/66566)
[GitHub - tildeio/rsvp.js: A lightweight library that provides tools for organizing asynchronous code](https://github.com/tildeio/rsvp.js)
