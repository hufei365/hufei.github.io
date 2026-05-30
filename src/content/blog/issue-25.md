---
title: 'JS之防抖(debounce)和节流（throttle）'
pubDate: 2019-07-02T07:04:46.000Z
description: 'javascript function debounce(fn, time) { let timer = null; return function (...args) { let ctx = this; clearTimeout(timer); timer = setTimeout(function () { fn.apply(ctx, args); timer = null; }, time)…'
tags:
  - JavaScript
---

```javascript
        function debounce(fn, time) {
            let timer = null;
            return function (...args) {
                let ctx = this;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(ctx, args);
                    timer = null;
                }, time);
            }
        }

        function testDebounce(event){
            console.log(this);
            console.log(event.type);
            console.log(`debounce ${new Date}`);
        }

        document.body.addEventListener('mousemove', debounce(testDebounce, 300))

        function throttle(fn, time){
            let timer = null;

            return function(...args){
                let ctx = this;
                if(!timer){
                    timer = setTimeout(function(){
                        fn.apply(ctx, args);
                        timer = null;
                    }, time);
                }
            }
        }
        function testThrottle(event){
            console.log(this);
            console.log(event.type);
            console.log(`throttle ${new Date}`);
        }

        document.addEventListener('mousemove', throttle(testThrottle, 1000).bind({event:"document"}))
```
