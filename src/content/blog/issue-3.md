---
title: 'CSS中的盒模型'
pubDate: 2019-01-05T08:56:00.000Z
description: '在对文档进行布局时，浏览器渲染引擎会根据盒模型（CSS-Box）,将所有的元素表现一个矩形盒子。 这个盒子的构成由里到外分别是 内容区域，内边距，边框和外边距。 每个区域的大小尺寸都可以被其对应的属性指定。 盒模型分为两种： 标准盒模型 和 IE盒模型。 标准盒模型： 元素的宽度 = 内容区域宽度 IE盒模型： 元素的宽度 = 内容区域 + 内边距 + 边框 在CSS中，box-sizing属性可…'
tags:
  - CSS
---

在对文档进行布局时，浏览器渲染引擎会根据盒模型（CSS-Box）,将所有的元素表现一个矩形盒子。

这个盒子的构成由里到外分别是 **内容区域**，**内边距**，**边框**和**外边距**。

每个区域的大小尺寸都可以被其对应的属性指定。

盒模型分为两种： 标准盒模型 和 IE盒模型。

标准盒模型： 元素的宽度 = 内容区域宽度
IE盒模型： 元素的宽度 = 内容区域 + 内边距 + 边框

在CSS中，box-sizing属性可以指定元素采用哪种盒模型。

`box-sizing: content-box;` 表示采用标准盒模型；
`box-sizing: border-box;` 表示采用IE盒模型；


``` html
<div id="content-box" 
style="box-sizing:content-box;width: 100px; border: 10px solid #ccc; padding: 20px;"
>content-box</div>

<div id="border-box" 
style="box-sizing:border-box;width: 100px; border: 10px solid #ccc; padding: 20px;"
>border-box;</div>
```
上面两个div在浏览器中的表现是不一样的, border-box 设置了border 和 padding的大小，故内容区域的大小需要减去这部分占用的（100 - 10\*2 - 20\*2 = 40 , 乘以2是因为左右两边都占用 ）。

https://www.w3.org/TR/CSS22/box.html

另外一个问题，**外边距重叠(collapsed margin)**。
当两个元素外边距相遇时，会发生重合现象。合并后，两元素的外边距 二者取其大。


在接下来要讲的就是BFC（Block Formatting Contexts）块级格式化上下文 和  IFC(Inline Formatting Contexts)。

### Block formatting contexts
Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.
