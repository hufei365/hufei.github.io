---
title: 'Transfer Size vs. Resource Size'
pubDate: 2024-05-29T10:39:32.000Z
description: '原文：【Transfer Size vs. Resource Size】'
tags: []
---

![roman-logov-f5QWC1a3tOA-unsplash.jpg](https://files.seeusercontent.com/2026/05/30/Sk6u/img_8aac5366bfb4.jpg)

原文：[【Transfer Size vs. Resource Size】](https://webperf.tips/tip/resource-size-vs-transfer-size/)


# Transfer Size vs. Resource Size

Web应用程序传递给用户的资源（如图像、JavaScript文件、CSS文件等）的大小，直接影响着应用的性能表现。

在这一过程中，有两个核心概念至关重要：**传输大小（Transfer Size）**和**资源大小（Resource Size）**。

本文将探讨这两个概念对性能的具体影响。

### 传输大小（Transfer Size）

Web应用程序通常需要从远程服务器获取资源，并将它们加载到用户的浏览器中。

**Transfer Size**指的是通过网络传输所需的总字节数，有时也被称作**bytes over the wire**。这个数值包括了传输的有效数据以及请求和响应的头部信息。
![image](https://files.seeusercontent.com/2026/05/30/Gw8b/img_43578df7f3a4.png)


一般来说，资源的传输大小越大，其通过网络传输所需的时间也就越长。

### 优化传输大小

为了减少网络资源传输所需的时间，存在多种技术手段。

#### 资源压缩
利用 gzip、brotli 等标准压缩算法，可以显著降低传输大小。

这通常是通过服务器或构建过程，在资源传输给用户之前进行压缩实现的：
![image](https://files.seeusercontent.com/2026/05/30/eLd6/img_4efc027bf579.png)


例如，某个资源的传输大小为24 kB，这意味着24 kB的数据通过网络传输。

资源一旦传输完成，用户的浏览器需要对其进行解压缩，以便进一步处理：
![image](https://files.seeusercontent.com/2026/05/30/2wlH/img_e4d50e888240.png)


通过在资源发送到网络前进行**压缩**，Web应用程序优化了向用户交付资源的流程。

#### 资源缓存
大多数Web应用程序会利用浏览器缓存，将资源持久化存储在用户的设备上。

当资源被缓存后，就无需再通过网络传输任何数据。
![image](https://files.seeusercontent.com/2026/05/30/z3Nt/img_7612daba8160.png)


这也是缓存如此受欢迎的原因之一——毕竟，如果资源是从用户的浏览器缓存中加载的，它的网络传输大小为0字节！

### 资源大小

与传输大小不同，资源大小完全独立于网络概念；它简单地表示构成资源的总字节数，无论是否应用了缓存或压缩手段。

例如，一个JavaScript文件的资源大小为80 kB，但其传输大小可能仅为24 kB：
![image](https://files.seeusercontent.com/2026/05/30/eLd6/img_4efc027bf579.png)


### 资源大小的成本

Web开发者普遍存在一个误解，认为如果资源经过优化交付或缓存，就不会对Web应用程序的性能造成影响。

然而，事实远非如此！

一旦资源传输到用户的浏览器（或从缓存中加载），我们就会看到它对用户CPU的影响。

通常，资源的资源越大，在用户CPU上处理所需的时间就越长。

> 注意：用户的CPU和硬件通常比开发者的至少差一个档次，低配置的硬件会进一步增加资源大小的成本。

#### 示例：JavaScript的成本
例如，如果我们将一个未压缩的80 kB JavaScript文件加载到用户的浏览器中，这意味着80 kB的文件需要在用户的设备上进行解析、编译和执行。这一成本与资源的传输速度无关，也与它是否从浏览器缓存中加载无关。
![image](https://files.seeusercontent.com/2026/05/30/r0sR/img_f6d0679c6c9a.png)


#### 示例：图像的成本
图像需要在用户的设备上解码后才能显示在屏幕上。这一成本与图像的传输速度或是否从浏览器缓存中加载无关：
![image](https://files.seeusercontent.com/2026/05/30/5caD/img_ae86f21686c0.png)

### 优化资源大小

存在多种技术来优化资源大小，每个技术的目标都是从根本上减少资源的大小及其对用户CPU的影响。

这些技术包括：

- JavaScript和CSS的压缩
- 图像格式的优化
- JavaScript代码的拆分
- 资源的延迟加载

通过减少资源的大小，你可以直接最小化它对用户CPU的负载。

例如，浏览器解析和编译一个10 kB的JavaScript文件，比解析和编译一个80 kB的文件所需的时间要少：
![image](https://files.seeusercontent.com/2026/05/30/3Pbm/img_94df9331952f.png)

> 有了这些知识，当你将一个新的JavaScript库（或其他依赖项）导入到你的Web应用程序时，要格外小心！当一个库声称只消耗"N字节"时，确保这说的是压缩字节还是资源字节。


### 优化资源大小有助于传输大小

当你优化资源大小时，你也直接优化了传输大小！

由于传输大小通常是资源压缩的结果，更小的资源会产生更小的压缩资源！

例如，如果你将一个80 kB资源大小的JavaScript有效载荷优化和修剪到10 kB的资源大小，这对用户的CPU利用率是一个巨大的改进。它也对传输大小是一个巨大的改进。



压缩一个10 kB的资源会产生大约4 kB的传输大小，这可以比压缩的80 kB资源在大约24 kB的传输大小下更快地通过网络传输！
![image](https://files.seeusercontent.com/2026/05/30/iJ0u/img_78b28ee88b33.png)


### 测量资源和传输大小

为了本地测量资源和传输大小，可以使用 DevTools 中的 Network 标签。

您还可以利用`performance`标签 来收集用户在运行该资源时的耗时大小。
