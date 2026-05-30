---
title: 'JS模块规范回炉再造'
pubDate: 2019-01-08T23:17:47.000Z
description: 'commonJS'
tags:
  - blog
  - JavaScript
---

### commonJS

### AMD （Asynchronous Module Definition）
[AMD Specifics](https://github.com/amdjs/amdjs-api/wiki/AMD) 
在AMD的中，一个模块由定义，依赖和工厂函数 三部分组成。

这是一个典型AMD模块：

```javascript
define("alpha",  // module ID 
             ["require", "exports", "beta"],  // 依赖列表
             function (require, exports, beta) {  // 模块工厂函数
   exports.verb = function() {
       return beta.verb();
   }
});
```
define方法中的第一个参数是模块本身的名称，其它模块通过这个名称引用该模块。
第二个参数，是模块的依赖列表。列表中的依赖会在后面的工厂函数执行之前加载完毕，然后将导出的对象根据依赖的顺序注入到工厂函数中。
第三个参数就是模块的工厂函数了，也是模块的主体。工厂函数的参数就是依赖模块的导出对象。所以说，AMD中，在所有依赖模块加载完成前，模块本身的定义代码是无法被执行的。

### CMD
[CMD Specifics](https://github.com/seajs/seajs/issues/242)
与AMD不同的是，CMD遵循就近加载的方式，只有在模块被用到的地方才会去加载，而不会像AMD那样提前加载完所有依赖。

同样一段代码：

main.js
``` javascript
define(function(require, exports, module) {
    console.log('entry');

    var a = require('./a');
    a();
    var b = require('./b');
    b();

    return function(){};
});
```

a.js
``` javascript
define(function(require, exports, module) {
    console.log('entry a.js'); 

    return function(){
        console.log('a is running');
    };
});
``` 

b.js
``` javascript
define(function(require, exports, module) {
    console.log('entry b.js'); 

    return function(){
        console.log('b is running');
    };
});
```

在main.js中引用了a.js和 b.js。
cmd中，只有在代码运行到require('./a.js')的 时候，才会去停下加载依赖。所以输出结果应该如下：

```
entry
entry a.js
a is running
entry b.js
b is running
```

而在AMD的定义中，会预先加载所有依赖，所有AMD的规范下，输出结果应该如下

``` 
entry a.js
entry b.js
entry
a is running
b is running
```
在上面的这个例子中，模块规范的实际实现我们分别使用seaJS（CMD规范实现者）和 requireJS（AMD规范实现者）。
然后你会发现例子中两套规范用了同一种代码，是因为requireJS本身也支持这种在代码中写写依赖的方式。但是依赖的加载时间依然是在工厂函数运行之前（更确切的说，是工厂函数只有在所有依赖加载完成后才会被调用执行）

### ES6 module

不同于AMD 和 CMD的两点：

1. ES6 模块输出的是值的引用；
2. ES6模块是编译时加载，AMD/CMD是运行时加载；

第一个不同点：在ES6中，import一个模块得到是一个引用，如果由多个都引用了该模块；那么如果其中某个模块修改了的引用模块的中的值，那么其它引用该模块的模块也可以读取到这次变化。

第二个不同点：ES6加载模块是在代码运行前，这也就意味着无法在import 中使用表达式，因为表达式未执行，我们无法得到import的输入值。
