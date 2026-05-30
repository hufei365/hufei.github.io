---
title: '三种基本排序'
pubDate: 2019-06-23T22:25:51.000Z
description: '三种基本排序 javascript / name： 快速排序 1. 在数据集之中，选择一个元素作为"基准"（pivot）。 2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。 3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。 / function quickSort(arr){ if(arr.length…'
tags:
  - JavaScript
  - sort
---

# 三种基本排序
```javascript
/**
name： 快速排序
1. 在数据集之中，选择一个元素作为"基准"（pivot）。
2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
*/
function quickSort(arr){
    if(arr.length <= 1){
        return arr;
    }

   let middle = Math.floor(arr.length / 2 );
   let e = arr.splice( middle, 1)[0];

   let left = [], right = [];

    arr.forEach( v => {
        if( v < e ){
             left.push( v );
        } else {
            right.push(v);
        }
    });

    return quickSort(left).concat( [e], quickSort(right));
}
/**
name： 选择排序
1. 拿第一个数与后面数相比较，如果比后面的数大则交换
2. 拿第二个数与后面的数比较，如果比后面的数大则交换
3. 直到比较到倒数第二个数，最后一个数不用比较
*/
function selectSort(arr){
    let len = arr.length;
    for(let i = 0; i < len; i++){
        for(let j = i; j < len; j++){
            if( arr[j] < arr[i]){
                arr[i] = arr[i] + arr[j];
                arr[j] = arr[i] - arr[j];
                arr[i] = arr[i] - arr[j];
            }
        }
    }
    return arr;
}


/**
name： 冒泡排序
1. 每轮依次比较相邻两个数的大小，后面比前面小则交换
*/
function bubbleSort(arr){
    let len = arr.length;
    for( let i = 0; i < len-1; i++){
        for(let j = 0; j < len-i-1; j++){
            if(arr[j+1] < arr[j]){
                arr[j] = arr[j+1] + arr[j];
                arr[j+1] = arr[j] - arr[j+1];
                arr[j] = arr[j] - arr[j+1];
            }
        }
    }
    return arr;
}
```

### 延伸
快速交换两个变量的方法：
1. 位运算
``` javascript
var a = 1, b = 2;
a = a ^ b;
b = a ^ b;
a = a ^ b;
console.log(a,b);
```
2. 解构赋值
```javascript
var a = 1, b = 2;
[a, b] = [b, a];
console.log(a,b);
```

3. 
```javascript
var a = 1, b = 2;
a = [b, b=a][0];
console.log(a,b);
```
4. 
```javascript
var a = 1, b = 2;
a = a + b;
b = a - b;
a = a - b;
console.log(a,b);
```
