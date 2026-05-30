---
title: '手写bind'
pubDate: 2019-06-27T03:46:54.000Z
description: 'javascript Function.prototype.bind=function(ctx){ let fn = this; if(!ctx){ ctx = typeof window !== ''undefined'' ? window : global; } return function(...args){ ctx.fn=fn; ctx.fn(...args) } } function f(…'
tags:
  - JavaScript
---

```javascript
 Function.prototype.bind=function(ctx){
    let fn = this;
    
    if(!ctx){
        ctx = typeof window !== 'undefined' ? window : global;
    }
    
    return function(...args){
        ctx.fn=fn;
        ctx.fn(...args)
    }
}

function f(){
    console.log(this.name);
}

var o = {name: 'o'};
var b = {name: 'b'};

f.bind(o)();
f.bind(b)();
```
