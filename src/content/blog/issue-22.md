---
title: 'js深拷贝与循环引用'
pubDate: 2019-06-25T21:54:26.000Z
description: '在 JavaScript 中，深拷贝（deep copy）意味着创建一个新的对象，并递归地复制原始对象的所有属性，包括嵌套的对象和数组。深拷贝确保原始对象和副本之间不共享任何引用，因此修改副本不会影响原始对象。 然而，当原始对象中存在循环引用时，深拷贝的实现可能会变得复杂。循环引用是指两个或多个对象相互引用，形成一个闭环。在这种情况下，深拷贝函数需要能够识别并处理循环引用，以避免无限循环。 jav…'
tags:
  - JavaScript
---

在 JavaScript 中，深拷贝（deep copy）意味着创建一个新的对象，并递归地复制原始对象的所有属性，包括嵌套的对象和数组。深拷贝确保原始对象和副本之间不共享任何引用，因此修改副本不会影响原始对象。

然而，当原始对象中存在循环引用时，深拷贝的实现可能会变得复杂。循环引用是指两个或多个对象相互引用，形成一个闭环。在这种情况下，深拷贝函数需要能够识别并处理循环引用，以避免无限循环。

``` javascript
function deepCopy(target) {
    var arr = []; // use array store the used refrence, and avoid repeat
    return _deepCopy(target);
    
    function _deepCopy(target) {
        let result = {};
        for (let k in target) {
            if (target.hasOwnProperty(k)) {
                if (target[k] && typeof target[k] === 'object') {
                    if ((arr.filter(v=>v === target[k])).length === 0) {
                        arr.push(target[k]);
                        result[k] = _deepCopy(target[k]);
                    }

                } else {
                    result[k] = target[k];
                }
            }
        }
        return result;
    }
}

// test code
var a = {
    n: 1,
    m: 2
};
var b = {
    m: 1,
    n: 2
};
a.b = b;
b.a = a;
var c = deepCopy(a);
```

另外，我们可以在深拷贝函数中使用一个映射（如 Map 或 WeakMap）来跟踪已经拷贝过的对象。以下是一个处理循环引用的深拷贝函数的示例：

``` javascript
function deepCopy(obj, map = new WeakMap()) {
    if (obj === null) return null; // 处理 null 值
    if (typeof obj !== 'object') return obj; // 处理非对象值
    if (map.has(obj)) return map.get(obj); // 处理循环引用

    const clone = Array.isArray(obj) ? [] : {};
    map.set(obj, clone); // 记录当前对象的副本

    Object.keys(obj).forEach((key) => {
        clone[key] = deepCopy(obj[key], map); // 递归拷贝对象的属性
    });

    return clone;
}
```
