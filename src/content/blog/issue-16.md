---
title: 'CSS揭秘之多重边框'
pubDate: 2019-06-09T13:16:40.000Z
description: '多重边框的两种实现方案： 1. border-shadow 2. outline html <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-…'
tags:
  - blog
  - CSS
---

多重边框的两种实现方案：

1. border-shadow
2. outline

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mutiple border</title>
</head>

<body>
    <style>
        .common {
            width: 25vw;
            height: 20vh;
            margin: 10%;
            background: gray;
        }

        .box-shadow {
            box-shadow: 0 0 0 10px #655,
                0 0 0 15px deeppink,
                0px 2px 5px 15px hsla(240, 100%, 50%, .5);
        }

        .inner-box-shadow {
            background: white;
            box-shadow: inset 0 0 40px hsla(0, 100%, 50%, 1);
        }

        .outline {
            border: 2px solid hsla(280, 100%, 50%, 1);
            outline: 2px dashed hsla(0, 0%, 100%, 1);
            outline-offset: -15px;
            border-radius: 10px;
            outline-width: 2px;
        }
    </style>
    <div class="common box-shadow"></div>
    <div class="common inner-box-shadow"></div>
    <div class="common outline"></div>
</body>

</html>
```
