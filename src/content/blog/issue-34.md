---
title: 'Draft：常见面试题之事件循环'
pubDate: 2024-03-29T00:08:03.000Z
description: '什么是事件循环Event Loop 这个需要从浏览器和Node.js两方面讲，但是二者的初衷是一致的，但在具体实现原理和事件阶段（宿主环境不同导致）上有些许差异。'
tags:
  - JavaScript
---

# 什么是事件循环Event Loop
这个需要从浏览器和Node.js两方面讲，但是二者的初衷是一致的，但在具体实现原理和事件阶段（宿主环境不同导致）上有些许差异。

## 浏览器里的事件循环
首先看下 whatwg 官方给的定义：
> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. Each agent has an associated event loop, which is unique to that agent.
> An event loop has one or more task queues. A task queue is a set of tasks.

***为了调度/协调 事件、用户交互、脚本执行、渲染、网络请求等，user agents (一般指浏览器)必须使用官方定义的“事件循环”机制。每个 user agent 都有一个唯一关联的事件循环。***
***一个事件循环至少有一个任务队列，任务队列就是一组任务的集合。***

由此可以确定，在浏览器中，事件循环是用来处理用户交互、页面渲染和网络请求等任务的一种方法。

### 为什么要有这种方法？
因为 Javascript 是一种单线程语言，假如遇到耗时较长的任务，最好的方式将这种任务交由其他线程去处理，等处理完有了结果再交回 Javascript 的线程处理。否则，一直占用 JS 的执行线程，有可能造成渲染掉帧、用户操作无响应等问题。比如，在 Javascript 中进行一次网络请求，这件事可以交给“网络”线程去处理。当服务器数据返回到客户端时，这时候将响应数据作为参数传递给回调函数，交由 javascript 的主线程处理。
<img width="1053" alt="NetowrkandTask" src="https://files.seeusercontent.com/2026/05/30/Wis1/img_5b00f14faeb0.png">


在这个过程中，网络请求实际上变成了异步任务，因为主线程没有同步等待网络请求的返回结果。所以，如果简单来讲的话，浏览器里的事件循环就是用来**调度异步任务的回调函数调用时机**的一种机制（其实 Node.js 类似，只是二者处理的异步任务类型略有不同）。

### 浏览器的事件循环过程
1.  检查 macrotask 队列是否为空，非空则到 2 ，为空则到 3 ；
2.  执行 macrotask 中的一个任务；
3.  继续检查 microtask 队列是否为空，若有则到 4 ，否则到 5 ；
4.  取出 microtask 中的任务执行，执行完成返回到步骤 3 ；
5.  执行视图更新，假如需要的话；
![Browser-event-loop](https://files.seeusercontent.com/2026/05/30/tVa5/img_950ddce829aa.png)

## Node.js里的事件循环

Node.js 采用 V8 引擎作为 Javascript 的解析引擎，而 I/O 处理方面使用了跨平台的 `libuv`————一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API ，Node.js 的事件循环机制基于 `libuv` 实现。

## 宏任务 macro task 和微任务 micro job
### 常见的宏任务：
1. 计时器相关（`setTimeout`、 `setInterval`、 `setImmediate` ）
2. I/O，例如网络请求、用户交互事件 
4. `MessageChannel`
5. `postMessage`
6. UI rendering

### 常见的微任务
1. Promsie
2. MutationObserver
3. queueMicrotask
4. process.nextTcik（node.js only)


## 总结一下

1. js是单线程的，但是浏览器&Node.js不是单线程的；
2. 事件循环是用来处理异步任务回调函数调用时机的一种机制，目的是为了保证程序流畅高效地运行，最大限度利用计算资源；
    1. 在浏览器中，最重要的是能及时响应用户交互行为；
    2. 在Node.js中，最重要的是能提高CPU的利用率，高效的响应外部请求；
