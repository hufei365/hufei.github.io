---
title: 'CSS 布局之如何使用CSS构建一个瀑布流'
pubDate: 2024-04-05T13:56:23.000Z
description: '如何使用CSS构建一个瀑布流布局 瀑布流布局是一种常见的网页布局方式，其中元素以不同的大小排列，且行与列之间没有不均匀的间隙。在瀑布流布局中，即使某一行或列中的元素较短，下一个元素也会占据空间。'
tags: []
---

# 如何使用CSS构建一个瀑布流布局

瀑布流布局是一种常见的网页布局方式，其中元素以不同的大小排列，且行与列之间没有不均匀的间隙。在瀑布流布局中，即使某一行或列中的元素较短，下一个元素也会占据空间。

## 如何实现瀑布流布局

实现这一目标的方法有很多，但最好的方法就是使用`grid-template-columns`和`repeat()`函数。

### `grid-template-columns` 属性
除了明确的列大小之外，CSS Grid最有价值、最实用的功能之一就是重复列，直到列满为止，然后自动将项目放置其中。尤其是，我们可以在网格中指定所需的列数，然后让浏览器控制这些列的响应性，这样就能在视口尺寸较小的情况下显示较少的列，而在屏幕宽度增加时显示较多的列。

这可以通过使用 `repeat()` 函数和`auto-placement`属性来实现。简而言之，`repeat()`函数允许我们根据需要重复列。例如，如果我们要创建一个 12 列的网格，我们可以写如下代码：

``` css
.grid {
  display: grid;
  /* 定义网格列数 */
  grid-template-columns: repeat(12, 1fr);
}
```
我们使用`1fr`告诉浏览器将可用空间平均分配给每一列，使每一列获得相等的份额。也就是说，无论网格有多大，本例中的网格总是有 12 列。然而，这还不够好，因为在较小的视口中，内容会被挤压得太厉害。

因此，我们需要指定列的最小宽度，确保它们不会太窄。为此，我们可以使用minmax()函数。
``` css
grid-template-columns: repeat(12, minmax(300px, 1fr));
```
但由于CSS Grid的特性，该行会溢出。我们明确指示浏览器每行重复列 12 次，因此即使视口宽度太小，无法按照新的最小宽度要求全部容纳这些列，超出视窗范围的列也不会自动换行。

要实现换行，我们可以使用`auto-fit`或`auto-fill`属性。
``` css
grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
```
通过使用这些关键字，我们可以指示浏览器为我们处理元素换行和列的大小，使原本会溢出的元素自动换行。

这就是Grid现在的样子：
<img width="1357" alt="截屏2024-04-05 21 41 09" src="https://files.seeusercontent.com/2026/05/30/9Wsb/img_999bb2ba576d.png">



但这不是砌体布局。那么如何实现呢？让我们来看看。

### `grid-column` 和 `grid-row`属性

`grid-column`和`grid-row`属性指定了grid item在网格布局中的大小和位置。因此，我们可以指定网格中单个grid item的宽度或高度。为此，我们可以使用`span`特性。

要增加第一个grid item的宽度，我们可以这样写：
``` css
.grid-item:nth-child(1) {
    grid-column: span 2;
    grid-row: span 1;
}
```
因此，第一个网格单元格将横跨两列，展示结果如下：
<img width="1370" alt="截屏2024-04-05 21 43 03" src="https://files.seeusercontent.com/2026/05/30/W5hf/img_1d5950c40659.png">


同理，如果要增加第二个grid item的高度，我们可以这样写：
``` css
.grid-item:nth-child(2) {
    grid-column: span 1;
    grid-row: span 2;
}
```
因此，第二个grid item将横跨两行，展示效果如下：
<img width="1364" alt="截屏2024-04-05 21 45 07" src="https://files.seeusercontent.com/2026/05/30/k9Dk/img_ba90c3b065d5.png">


同样，如果我们以所需的方式处理每个grid item，就会得到以下结果：
<img width="1361" alt="截屏2024-04-05 21 47 56" src="https://files.seeusercontent.com/2026/05/30/o6Ke/img_a1a83dd9556c.png">



但是，如果grid item的数量过多，就无法为每个grid item指定精确的高度和宽度。因此，我们可以动态分配这些值：
``` css

.grid-item: nth-child(7n+1) {
    grid-column: span 2;
    grid-row: span 1;
}

.grid-item: nth-child(7n+2) {
    grid-column: span 1;
    grid-row: span 2;
}

.grid-item: nth-child(7n+4) {
    grid-column: span 1;
    grid-row: span 2;
}

.grid-item: nth-child(7n+5) {
    grid-column: span 3;
    grid-row: span 1;
}
```
最终效果如下：
<img width="1361" alt="截屏2024-04-05 21 47 56" src="https://files.seeusercontent.com/2026/05/30/o6Ke/img_a1a83dd9556c.png">
