---
title: 'js取0到50之间10个不重复的随机数'
pubDate: 2019-06-25T14:50:41.000Z
description: 'javascript function getRandom( len=10, total=50 ){ // step 1: generate a array, and its length is 50 let arr = Object.keys(Array.from(new Array(total))); let out=[], i = 0; while(i<len){ let r = Math.…'
tags:
  - JavaScript
---

```javascript
function getRandom( len=10, total=50 ){
    // step 1: generate a array, and its length is 50
    let arr = Object.keys(Array.from(*new* Array(total)));

    let out=[], i = 0; 
    while(i<len){
        let r = Math.floor(Math.random(0, 1)*arr.length);
        out.push(arr[r]);
	// delete the num and ensure it will not be repeat
        arr.splice(r, 1);
        i++;
    }
    return out;
}
getRandom();
```
