---
title: 'A trick 用JS获取随机颜色'
pubDate: 2019-03-16T14:31:37.000Z
description: '在CSS中， 颜色一般用#000000 #ffffff 6位十六进制数表示。 那么只要生成 #000000 #ffffff之间的随机数即可。 javascript (''00000''+Math.random()(0xffffff+1)<<0).toString(16) 1. Math.random() 函数返回一个浮点, 伪随机数在范围[0，1)，也就是说，从0（包括0）往上，但是不包括1（排除1）'
tags:
  - JavaScript
---

在CSS中， 颜色一般用#000000 ~ #ffffff 6位十六进制数表示。

那么只要生成 #000000 ~ #ffffff之间的随机数即可。

``` javascript
('00000'+Math.random()*(0xffffff+1)<<0).toString(16)
```

1. Math.random() 函数返回一个浮点,  伪随机数在范围[0，1)，也就是说，从0（包括0）往上，但是不包括1（排除1）
