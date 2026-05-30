---
title: '不用除法，一个简单的算法题'
pubDate: 2024-03-20T14:14:07.000Z
description: '题目描述 有一个长度为len数组arr（[1,2,3,4]），要求返回一个新数组newArr（[24, 12, 8, 6]） 对于新数组，存在newArr[i] = arr[1] arr[2] ...arr[i-1] arr[i + 1] ... arr[len-1] 算法要求： 1. 时间复杂度O(n); 2. 不可以使用除法；'
tags:
  - blog
  - algorithm
---

### 题目描述

有一个长度为len数组arr（[1,2,3,4]），要求返回一个新数组newArr（[24, 12, 8, 6]）

对于新数组，存在newArr[i] = arr[1] * arr[2] *...*arr[i-1] * arr[i + 1] *...* arr[len-1]

算法要求：
1. 时间复杂度O(n);
2. 不可以使用除法；

### 答案
``` javascript
function convertArr(arr) {
    const len = arr.length;
    const aa = [], bb = [];
    let a = 1, b = 1;
    for (let i = 0; i < len; i++) {
        aa.push(a = arr[i] * a);
        bb.unshift(b = arr[len - i - 1] * b)
    }
    const result = [];
    for (let i = 0; i < len; i++) {
        result.push((aa[i - 1] ?? 1) * (bb[i + 1] ?? 1))
    }
    return result;
}
```
