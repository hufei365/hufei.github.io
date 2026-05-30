---
title: '【CSS揭秘】之用CSS实现一些基本形状'
pubDate: 2019-06-17T22:38:13.000Z
description: '用border-radius实现圆形/椭圆'
tags:
  - CSS
---

# 用border-radius实现圆形/椭圆
## 圆形

借助`border-radius`

``` html
<style>
	.circle{
		width: 200px;
		height: 200px;
		background: yellowgreen;
		border-radius: 100px;
	}
</style>
<div class="circle"></div>
```

## 椭圆

借助 `border-radius: ${x}px / ${y}px;` （单独指定水平和垂直半径）

```html
<style>
    .cricle {
        height: 200px;
        width: 150px;
        border-radius: 75px / 100px;
    }
</style>

<div class="circle"></div>
```

## 自适应圆/椭圆
借助`border-raduis`的值可以是百分比的形式
```html
<style>
    .cricle {
        height: 200px;
        width: 150px;
        border-radius: 50% / 50%;
    }
</style>

<div class="circle"></div>
```

## 二分之一椭圆
借助border-radius值的另外一种写法

``` html
<style>
.half-circle{
	width: 200px;
    height: 200px;
    background: yellowgreen;
    border-radius: 50% / 100% 100% 0 0;
    border: 1px dashed;
}
</style>
<h3>二分之一椭圆</h3>
<div class="half-circle"></div>
```

![image](https://files.seeusercontent.com/2026/05/30/Mgz8/img_a7d28353671f.png)


## 四分之一椭圆

``` html
<style>
.half-circle{
	width: 200px;
    height: 200px;
    background: yellowgreen;
    border-radius: 100% 0 0;
    border: 1px dashed;
}
</style>
<h3>四分之一椭圆</h3>
<div class="half-circle"></div>
```
