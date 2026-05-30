---
title: '一个简单的输出测试'
pubDate: 2019-06-23T01:33:28.000Z
description: '下面这段程序的执行结果： javascript function b(){console.log(''1111'');} function b(){console.log(''22222'');} var b=3; b(); 答案：Uncaught TypeError: b is not a function'
tags:
  - JavaScript
  - 作用域
---

下面这段程序的执行结果：
```javascript
function b(){console.log('1111');}
function b(){console.log('22222');}
var b=3;
b();
```

答案：Uncaught TypeError: b is not a function
