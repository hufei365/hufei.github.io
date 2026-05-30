---
title: 'BFC及自适应布局'
pubDate: 2019-01-20T22:28:11.000Z
description: '什么是BFC 简单来说，BF可以看做是一个独立的布局区域。这个区域内元素的布局不会受到区域外元素的影响。同理，区域内的元素也不会影响外部元素的布局。'
tags:
  - CSS
  - BFC
---

## 什么是BFC

简单来说，BF可以看做是一个独立的布局区域。这个区域内元素的布局不会受到区域外元素的影响。同理，区域内的元素也不会影响外部元素的布局。

## 产生BFC的几种方式

- `<html>`根元素
- `float`的值不为`none`
- `overflow`的值为 `auto`，`scroll`和`hidden`
- `display`的值为`table-cell`、`table-caption` 和 `inline-block`中的任何一个
- `positon`的值不为`relative`和`static`

借助BFC可以实现更加健壮的自适应布局。

自适应布局的两个特性

- 流动性
- 水平方向自动填充


`float`：方式具有流动性，但是没有自动填充的特性。且已经破坏了正常流；
`position:absolute;`： 脱离了正常文档流，不能和非定位元素一起玩耍；
`overflow：hidden`：不会让元素脱离正常的文档流，同时保持了水平方向的流动性；布局外的子元素可能会被隐藏掉；
`display: inline-block;`：让元素尺寸包裹收缩，失去水平方向的流动性；but，在IE6和IE7下，会自动填充水平方向的可用宽度；
`display:table-cell;`：IE8以上版本支持，让元素表现得像单元格一样；有个特性就是实际宽度设置的再大，也不会超出实际宽度。这样以来，如果我们给元素设置的宽度足够大，就能在水平方向表现出填充性的特性。


能担任BFC自适应布局的几种方式：

1. `overflow:hidden;`：适用于IE7及以上版本；
2. `display:inline-block;`：适用于IE6 和 IE7；
3. `display:table-cell;`：适用于IE8及以上版本；

则实际实现代码如下：

1. overflow版本：

``` css
.bfc-content{
    overflow: hidden;
}
```

2. table-cell 版本：

``` css
.bfc-content{
    display: table-cell;
    width: 9999px;
    /* 兼容IE7 则需要下面这行代码*/
    *display: inline-block; *width: auto;
}
```
