---
title: '洋葱模型'
pubDate: 2024-03-21T11:35:28.000Z
description: 'Koa 的洋葱模型指的是以 next() 函数为分割点，先由外到内执行 Request 的逻辑，再由内到外执行 Response 的逻辑。通过洋葱模型，将多个中间件之间通信等变得更加可行和简单。其实现的原理并不是很复杂，主要是 compose 方法。'
tags:
  - JavaScript
---

Koa 的洋葱模型指的是以 `next()` 函数为分割点，先由外到内执行 `Request` 的逻辑，再由内到外执行 `Response` 的逻辑。通过洋葱模型，将多个中间件之间通信等变得更加可行和简单。其实现的原理并不是很复杂，主要是 `compose` 方法。

# 同步版本

``` javascript
;(()=>{
    function compose(middlewares) {
        let index = -1;

        if (Array.isArray(middlewares)) {
            return ()=>dispatch(0);
        }

        function dispatch(i) {
            if (i <= index)
                return new Error('next() called multiple times')

            index = i;
            let fn = middlewares[i];

            if (fn) {
                return fn(function next() {
                    // 将下一个待执行的函数作为参数传入到当前函数的参数之中
                    return dispatch(i + 1); 
                })
            }

        }
    }

    const fn1 = (next)=>{
        console.log(1)
        next();
        console.log(2)
    }

    const fn2 = (next)=>{
        console.log(3)
        next();
        console.log(4)
    }

    const fn3 = (next)=>{
        console.log(5)
        next()
        console.log(6)
    }

    const middlewares = [fn1, fn2, fn3];

    const a = compose(middlewares)

    a();
}
)();
```
[![JhVEuRI.md.jpg](https://files.seeusercontent.com/2026/05/30/7svM/img_10e5de651d49.jpg)](https://freeimage.host/i/JhVEuRI)
