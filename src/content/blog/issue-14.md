---
title: '元素总是居中且高度是宽度的50%'
pubDate: 2019-04-26T01:07:36.000Z
description: '有一个元素element，实现如下需求： 1. 元素e水平垂直居中； 2. 元素e水平方向与父元素保持10px间距； 3. 元素e的高度是宽度的一半； 解决思路 1. 水平垂直居中，这个还好处理。网上已经有若干种解决方案了CSS实现水平垂直居中的1010种方式。 注意其中一种方式：absolute+margin:auto。这种方式，margin的值通常设为auto。实际上也可以在水平或垂直方向设定…'
tags:
  - blog
  - CSS
---

#### 有一个元素element，实现如下需求：
      
1. 元素e水平垂直居中；
2. 元素e水平方向与父元素保持10px间距；
3. 元素e的高度是宽度的一半；

**解决思路**

1. 水平垂直居中，这个还好处理。网上已经有若干种解决方案了[CSS实现水平垂直居中的1010种方式](https://yanhaijing.com/css/2018/01/17/horizontal-vertical-center/)。
注意其中一种方式：**absolute+margin:auto**。这种方式，margin的值通常设为`auto`。实际上也可以在水平或垂直方向设定具体数值，只要保持左右或上下margin值相等即可。
2. 水平方向与父元素保持10px间距，达到这个要求，可以借助`margin:auto 10px;`实现；
3. 高度总是宽度的一半。实现这个有两种方式：
    1. padding：在CSS中，如果padding值为百分比的形式，则其参考维度为父级元素的宽度。即如果如果元素e的父级元素宽度是100px，当设置元素e `padding: 10% 20%;`，则元素e的padding值为“10px 20px 10px 20px”(上->右->下->左)。而且，元素的padding在`box-sizing:border-box; width:0;height:0;`模式下，则上下左右的padding的值构成了元素的整个宽高。
    2. vw：这个就比较好说了，vh：视口高度的 1/100；vw：视口（Viewport）宽度的 1/100。

so，最终示例代码如下：

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>always-center</title>
</head>

<body>

    <div class="text-box">
        <h4>有一个元素element, 实现如下需求：</h4>
        <ul>
            <ol>元素e水平垂直居中</ol>
            <ol>元素e水平方向与父元素保持10px间距</ol>
            <ol>元素e的高度是宽度的一半</ol>
        </ul>
    </div>

    <style>
        html,
        body {
            height: 100%;
        }

        .element {
            position: absolute;
            margin: auto 10px;
            /* 垂直方向不可定值 */
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            font-size: 24px;
        }

        .v-padding {
            padding-bottom: calc(50% - 10px);
            height: 0;
            background: #ddd;
        }

        .v-vw {
            height: calc(50vw - 10px - (100vh - 100%));
            background: #ccc;
        }

        .none {
            display: none;
        }

        .toggle {
            position: fixed;
            z-index: 1;
            top: 200px;
            left: 150px;
        }

        .text-box {
            width: 400px;
            display: inline-block;
            font-size: 20px;
            position: relative;
            margin-bottom: 0;
        }
    </style>

    <h6><button id="toggle" class="toggle"> 点我切换不同实现效果 </button></h6>
    <div class="element none"> </div>


    <script>
        const toggle = document.getElementById('toggle');
        const cycles = ['v-padding', 'v-vw', 'none'];
        const element = document.querySelector('.element');
        toggle.addEventListener('click', () => {
            const current = cycles.shift();
            element.className = 'element ' + current;
            element.innerText = current.replace('v-', '');
            cycles.push(current);
        });
    </script>



    <style>
        .padding-box {
            width: 600px;
            background: #BBB;
        }

        .padding-box .padding {
            padding: 10%;
            background: rgb(200, 255, 0);
        }
        .padding-box .content{
            background: #ccc;
        }
    </style>

    <div class="padding-box">
        <div class="padding">
            <p class="content">
                用来说明： padding 使用百分比时， 相对于父容器宽度进行计算。
            </p>
        </div>


        <input type="range" name="padding" id="padding" title="调整父级元素宽度" aria-label="调整父级元素宽度"> <span title="调整父级元素宽度" >拖动我试试</span>
    </div>
    <script>
        const r = document.getElementById('padding');
        const pbox = document.querySelector('.padding-box');
        r.addEventListener('input', () => {
            pbox.setAttribute('style', 'width: ' + (600 * r.value / 100) + 'px;');
        });
    </script>
</body>

</html>
```
