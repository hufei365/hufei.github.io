---
title: 'background-clip和半透明边框'
pubDate: 2019-06-09T02:45:40.000Z
description: '用CSS实现半透明边框效果。 1. hsla的使用 2. background-clip html <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv…'
tags:
  - blog
  - CSS
---

用CSS实现半透明边框效果。

1. hsla的使用
2. background-clip

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>background-clip和半透明边框</title>
    <style>
        html {
            height: 100%;
        }

        body {
            background: #ccc;
        }
    </style>
</head>

<body>
    <h3>background-clip的作用</h3>
    <style>
        .background-clip {
            width: 20vw;
            height: 20vh;
            background: hsla(0, 100%, 100%, 1);
            color: gray;
            padding: 10px;
            border: 5px dashed hsla(0, 0%, 100%, 0.5);
        }

        pre {
            background: white;
            color: gray;
            padding: 10px;
            width: 20vw;
        }
    </style>
    <div class="background-clip">
        文本文字
    </div>
    <button id="switch">switch background-clip</button>
    <pre>
        <code lang="css">

        </code>
    </pre>
    <script>
        const btn = document.getElementById('switch');
        const ele = document.querySelector('.background-clip');

        const values = ['padding-box', 'content-box', 'text', 'border-box'];

        function switchBclip() {
            const next = values.shift();
            ele.style.backgroundClip = next;
            ele.style.webkitBackgroundClip = next;
            if (next === 'text') {
                ele.style.color = "transparent";
            } else {
                ele.style.color = "gray";
            }
            values.push(next);
            updateStyleCode();
        }

        function getCurrentStyle() {
            return ['backgroundColor', 'color', 'backgroundClip'].map(v => {
                return v + ':' + getStyle(v) + ';';
            });
        }

        function getStyle(key) {
            if (!key) {
                return false;
            }
            key = key.replace(/^[a-z]/, v => v.toUpperCase());
            return window['getStyle' + key]();
        }

        function getStyleBackgroundColor() {
            return ele.style.backgroundColor || window.getComputedStyle(ele).backgroundColor;
        }

        function getStyleColor() {
            return ele.style.color || window.getComputedStyle(ele).color;
        }

        function getStyleBackgroundClip() {
            return ele.style.backgroundClip || window.getComputedStyle(ele).backgroundClip;
        }

        function updateStyleCode() {
            const styles = getCurrentStyle();
            let preCode = document.querySelector('pre code');
            preCode.textContent = '\n' + styles.join('\n');
        }
        btn.addEventListener('click', switchBclip);
    </script>

    <h3>半透明边框</h3>
    <style>
        .tran-border {
            width: 10vw;
            height: 10vh;
            background: hsla(0, 100%, 100%, 1);
            border: 10px dashed hsla(0, 0%, 100%, 0.5);
            background-clip: padding-box;
            /* this is the key */
        }
    </style>
    <div class="tran-border"></div>
</body>

</html>
```
