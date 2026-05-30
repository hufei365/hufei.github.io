---
title: 'WebGL 深入浅出'
pubDate: 2024-03-24T00:47:24.000Z
description: '原文：An Introduction to WebGL — Part 1'
tags:
  - JavaScript
  - WebGL
  - canvas
---

原文：[An Introduction to WebGL — Part 1](https://dev.opera.com/articles/introduction-to-webgl-part-1/)
# 介绍
这是我们关于WebGL系列文章中的第一篇。本系列的目标是提供入门学习WebGL所需的信息和资源。在这篇文章中，我们将讨论WebGL是如何工作的，创建WebGL应用程序需要什么，以及一个简单的示例是什么样子的。
# 什么是WebGL？
WebGL是一个JavaScript API，允许我们直接在浏览器中实现交互式的三维图形。有关WebGL的功能示例，请查看此[WebGL演示视频](https://www.youtube.com/embed/KDQbXLXM_l4)(译者注：需要科学上网)（可在所有浏览器中查看！）
WebGL是由Khronos集团开发的网络标准；Opera是跟谷歌（Chrome）、Mozilla（Firefox）、苹果（Safari）和其他3D图形开发人员一样的积极者。

WebGL作为HTML`＜canvas＞`元素的特定上下文运行，它允许在JavaScript中可以直接使用硬件加速3D渲染（译者注：简单理解就是使用GPU）。因为它运行在`＜canvas＞`元素上，WebGL还与所有DOM接口完全集成。API基于OpenGL ES 2.0(译者注：作者这里的说的是WebGL1.0，目前最新版的WebGL2.0是基于OpenGL ES3.0），这意味着可以在许多不同的设备上运行WebGL，如PC、手机和电视。您可以在Khronos网站上查看[WebGL规范](https://registry.khronos.org/webgl/specs/2.0/)。

#  如何运行WebGL？
要想使用WebGL，只需要浏览器支持就可以。
- Opera 12及以上（启用WebGL需要在配置中开启，然后重启浏览器）
- Chrome 9+，Linux，Mac和Windows都OK
- Firefox 4+
- Safari 5.1+

同理，配备一张显卡能极大程度提高WebGL 在计算机上的性能（译者注：现在基本都有显卡，核显也是显卡）。

# WebGL能干什么？
WebGL允许开发者在浏览器中运行可实时交互的三维图形程序。这其中包括交互式的音视频、游戏🎮、数据可视化📊、艺术作品🎨、三维设计平台、空间三维建模、对象三维建模、绘制数学函数或创建物理模拟程序。其中，数字孪生的技术也可以借助WebGL去实现。
![image](https://files.seeusercontent.com/2026/05/30/Mre8/img_acf34ee9f149.png)


# WebGL工作原理

WebGL比通常接触的Web编程技术稍微复杂一些，因为它直接与显卡协作。因此，它是一种偏向底层的技术。这使它能够快速进行复杂的3D渲染，包括大量计算。

你不需要完全了解WebGL的内部原理。目前有一些WebGL库可以帮助我们避免这些繁杂的理念。然而，如果你想用你选择的第三方库中没有的功能来增加代码的趣味性，或者你觉得更好地掌握这项技术将帮助你找到解决库所提供问题的方法，那么了解它可能会很有用。

在WebGL中编程时，通常用于渲染某种场景。这通常包括多个连续性绘制作业或所谓的“Call”，每一个都是通过一个被称为“渲染管道”的机制在GPU中执行。

在WebGL中，与大多数实时三维图形一样，三角形是绘制模型的基本元素。因此，在WebGL中绘制的过程包括使用JavaScript定义一些信息。这些信息描述了这些三角形的创建位置和方式，以及它们的外观（颜色、阴影、纹理等）。然后，这些信息被送到GPU，GPU对其进行处理，并返回场景视图。接下来，我们将更详细地了解最后一点是如何发生的。

## 渲染管道（rendering pipeline)

本节内容改编自[Joe Groff对OpenGL中图形管道的解释](https://duriansoftware.com/joe/an-intro-to-modern-opengl.-chapter-1:-the-graphics-pipeline)

![image](https://files.seeusercontent.com/2026/05/30/fUq0/img_e13264f34ac3.png)

这个过程是从创建Vertext Array开始，这些数组包Vertex的属性，例如Vertext在3D空间中的位置以及有关Vertex的纹理、颜色或其如何受光线影响（Vertex法线）的信息。这些数组及其包含的信息可以通过以下若干方式在JavaScript程序中创建：
 - 描述3D模型的文件（例如.obj文件）；
 - Scratch程序导出的数据文件；
 -  第三方库提供的常见几何图形的Vertex数据；

然后，将Vertex Array数据存储到一个Vertex缓冲区中，之后再交给GPU处理。提交渲染任务时，还必须提供Vertex Array的附加索引数组，它们描述了这些Vertex如何组合成三角形。

GPU首先从Vertex缓冲区中读取每个选定的Vertex，并通过顶点着色器（Vertex Shader）处理。顶点着色器是一个以一组Vertex属性作为输入，然后输出一组新的属性的程序。最起码，顶点着色器会计算顶点（Vertex）在屏幕上的投影位置。但是它也可以为每个顶点（Vertex）生成其它属性，如颜色或者纹理坐标。你也可以编写自己的顶点着色器，或者使用由WebGL库提供的着色器。

接下来，GPU会将投影后的顶点连接起来形成三角形。它按照索引数组指定的顺序取出顶点，并将它们分组成一组一组的三角形。

接下来，上一步组合而成的三角形由光栅器处理，对其进行裁剪，并丢掉处于屏幕之外的部分。剩余的可见部分会被分解成单个像素大小的片段。对上一步输出的其它顶点属性，顶点着色器也会在每个三角形的光栅化表面上进行插值，为每个片段分配平滑的渐变值。例如，如果顶点着色器为每个顶点分配一个颜色值，光栅化器将在像素化的表面上将这些颜色混合成适当的颜色渐变。

生成的像素大小的片段随后交由另一个被称为片段着色器的程序处理。片段着色器输出每个像素的颜色和深度值，然后将其绘制到帧缓冲区中。常见的片段着色器操作包括纹理映射和光照。由于片段着色器独立地绘制每个像素，因此它可以执行最复杂的特效；然而，它也是图形渲染管道中的性能最敏感的部分之一。与顶点着色器一样，您可以编写自己的片段着色器，或使用由 WebGL 库提供的着色器。

帧缓冲区是渲染作业输出的最终目的地。帧缓冲区不仅仅是一个单独的二维图像：除了一个或多个颜色缓冲区外，帧缓冲区还可以有深度缓冲区或模板缓冲区，它们在将片段绘制到帧缓冲区之前可选择地过滤片段。深度测试丢弃在已绘制对象后面的片段，而模板测试使用绘制到模板缓冲区的形状来约束帧缓冲区的可绘制部分，"刻画"渲染作业。幸存下来的片段将其颜色值与它们覆盖的颜色值进行 alpha 混合。最终的颜色、深度和模板值会被绘制到相应的缓冲区中。这些缓冲区的输出也可以作为其他渲染作业的纹理输入。

# 如何开始使用WebGL
要想使用WebGL，第一件事便是找一个支持WebGL的浏览器。然后，你可以在你最喜欢的代码编辑器中编写WebGL程序。

对于第一个WebGL项目，我建议你使用WebGL库。如果你已经阅读了前面的章节，你可能会想到为什么直接使用 WebGL API 会有点累。与其他Web程序 API 不同，"赤裸裸 "的 WebGL 是非常低级的语言。设计 WebGL 的人希望保持其灵活性并适用于任何用例，所以他们将WebGL设计成今天这个样子。他们的想法是以后可以通过库来提高开发体验，以加速和简化开发过程。

大多数库都提供了现成的模型、顶点着色器和片段着色器，可以大大减少你需要编写的代码量。如果您还不相信，请看一下引入库和未引入库的 “月球 3D 模型“的代码示例。即使只是快速浏览一下，代码长度和复杂度的差异也是显而易见的，这也为使用封装库提供了充分的理由。

有许多 WebGL 库，它们大都是在 WebGL 的基础上创建 3D 环境的直观元素，如场景、摄像头、光源、环境光、封装好的形状、材质、纹理以及模糊和浮动粒子等效果。这些元素的理念在不同的库中基本相同。不过，如何使用这些元素取决于库的架构。由于 WebGL 可以是交互式的，因此大多数库也提供了处理事件的简便方法。最后，大多数库还提供一些顶点和片段着色器。当你探索自己的库时，你会发现这绝不是对库所提供功能的详尽描述，但它为你提供了一个良好的入门思路。

# 常见的WebGL库

（排名不分先后）

1. [Three.js](https://github.com/mrdoob/three.js#readme)[（Github](https://github.com/mrdoob/three.js)）是一个轻量级 3D 引擎，其复杂度非常低，这是个好办法。该引擎可使用`<canvas>`、 `<svg>`和 WebGL 进行渲染。这是一些关于[如何入门](http://aerotwist.com/tutorials/getting-started-with-three-js/)的信息，其中对场景中的元素有很好的描述。这里是 Three.js[API 文档](https://github.com/mrdoob/three.js/wiki/API-Reference)。就用户数量而言，Three.js 也是最受欢迎的 WebGL 库，所以如果你遇到问题，可以指望热情的社区[（irc.freenode.net 上的 #three.js](http://webchat.freenode.net/?channels=three.js)）来帮助你。
2. [PhiloGL](http://senchalabs.github.com/philogl/)[（Github](https://github.com/senchalabs/philogl)）专注于 JavaScript 良好实践和习语。其模块涵盖了从程序和着色器管理到 XHR、JSONP、特效、Web Worker 等多个类别。您可以通过[PhiloGL](http://www.senchalabs.org/philogl/demos.html#lessons)的大量[课程](http://www.senchalabs.org/philogl/demos.html#lessons)开始学习。[PhiloGL 文档](http://senchalabs.github.com/philogl/doc/index.html)也非常详尽。
3. [GLGE](http://www.glge.org/)[（Github](https://github.com/supereggbert/GLGE)）有一些更复杂的功能，如骨骼动画和动画材质。你可以[在他们的项目网站上](http://www.glge.org/about/)找到[GLGE 的功能](http://www.glge.org/about/)列表。这里是 GLGE[API 文档](http://www.glge.org/api-docs/)的链接。
4. [J3D](https://github.com/drojdjou/J3D#readme)[(Github](https://github.com/drojdjou/J3D)) 不仅可以创建自己的场景，还可以将场景从[Unity](http://unity3d.com/)导出到 WebGL。[J3D "Hello cube "教程](https://github.com/drojdjou/J3D/wiki/How-to-create-a-cube)可以帮助您入门。此外，您还可以查看本教程——[了解如何从 Unity 导出到 J3D](https://github.com/drojdjou/J3D/wiki/Unity-exporter-tutorial)。

如前所述，你也可以不使用任何库，从零开始编写自己的 WebGL程序。可以访问[Learning WebGL 博客](http://learningwebgl.com/blog/?page_id=1217)了解具体的方法。

# 直观地感受一下WebGL代码

现在我们来看看一些实际的 WebGL 代码。为了简单起见，我们使用 WebGL 库创建了这段代码。在下面的示例中，我选择了[PhiloGL](http://senchalabs.github.com/philogl/)，因为它有非常好的[文档](http://senchalabs.github.com/philogl/doc/index.html)，对于想要入门 WebGL 的人来说是一个很好的库。
这段代码展示了一些基本的 WebGL 功能，你可能想在一个简单的程序中加入这些功能。随附的注释提供了充分的解释，并链接到 PhiloGL 文档以了解更多细节。您可以利用这个示例进行实验，对已有的功能进行修改，甚至添加一些自己设计的功能。如果您好奇，可以将 PhiloGL 实现与["原始 "WebGL](http://learningwebgl.com/blog/?p=1253) 实现进行比较。
这个场景是从[学习 WebGL 第 11 课](http://learningwebgl.com/blog/?p=1253)翻译成[PhiloGL](http://learningwebgl.com/blog/?p=1253) 的。它显示的是月球的 3D 模型，并应用了[NASA 月球地图](http://maps.jpl.nasa.gov/)的纹理。月球可以通过拖放进行旋转。你可以[看到实时运行的月球示例](http://senchalabs.github.com/philogl/PhiloGL/examples/lessons/11/)。
下一个代码片段显示了 HTML 文件的外观。我们导入从[PhiloGL 网站](http://senchalabs.github.com/philogl/)下载的[PhiloGL](http://senchalabs.github.com/philogl/) 脚本，并导入写入代码的index.js文件。我们还创建了一个<canvas>元素，用于呈现 WebGL 场景。加载文档时，将调用webGLStart();。该函数位于index.js中，将初始化 WebGL 应用程序。

``` html
<!DOCTYPE html>
<html>
<head>
	<title>Learning WebGL lesson 11 in PhiloGL</title>
	<link href="path/to/file.css" type="text/css" rel="stylesheet" media="screen">
	<script src="path/to/PhiloGL.js"></script>
	<script src="path/to/index.js"></script>
</head>
<body onload="webGLStart()">
	<canvas id="lesson11-canvas" width="500" height="500"></canvas>
	<!-- More HTML elements here… -->
</body>
</html>
```
接下来，我们看下`index.js`里面的代码，有一个`webGLStart`函数，这是创建WebGL图形的入口。

``` javascript
function webGLStart() {
    var pos, $ = function(d) { 
        return document.getElementById(d); 
    }
};
```

月球是使用 PhiloGL[O3D 模块](http://senchalabs.github.com/philogl/doc/o3d.html)创建的。O3D 提供模型管理和 3D 基元，如本例中使用的球体。指定了平行线（nlat）和经线（nlong）的数量以及半径。通过图像文件为球体添加纹理：

``` javascript
//Create moon
var moon = new PhiloGL.O3D.Sphere({
	nlat: 30,
	nlong: 30,
	radius: 2,
	textures: 'moon.gif'
});
```
接下来，通过调用[PhiloGL 构造函数](http://senchalabs.github.com/philogl/doc/core.html#PhiloGL:constructor)创建 WebGL 应用[程序](http://senchalabs.github.com/philogl/doc/program.html)。PhiloGL 构造函数会自动创建 WebGL 上下文、程序、摄像机、[场景](http://senchalabs.github.com/philogl/doc/scene.html)、通过 IO 加载纹理的选项、事件处理程序等。在本例中，我们将使用默认着色器，因此无需在构造函数中指定程序。场景也未指定。它将以默认值创建。[摄像机](http://senchalabs.github.com/philogl/doc/camera.html)的位置被修改。我们从图像源（moon.gif）中声明纹理，并使用一些[事件](http://senchalabs.github.com/philogl/doc/event.html)处理程序：拖放可旋转模型，鼠标滚动可缩放模型。

``` javascript
//Create application
PhiloGL('lesson11-canvas', {
	camera: {
		position: {
		x: 0, y: 0, z: -7
		}
	},
	textures: {
		src: ['moon.gif'],
		parameters: [{
			name: 'TEXTURE_MAG_FILTER',
			value: 'LINEAR'
		}, {
			name: 'TEXTURE_MIN_FILTER',
			value: 'LINEAR_MIPMAP_NEAREST',
			generateMipmap: true
		}]
	},
events: {
	onDragStart: function(e) {
		pos = {
			x: e.x,
			y: e.y
		};
	},
	onDragMove: function(e) {
		var z = this.camera.position.z,
		sign = Math.abs(z) / z;

		moon.rotation.y += -(pos.x - e.x) / 100;
		moon.rotation.x += sign * (pos.y - e.y) / 100;
		moon.update();
		pos.x = e.x;
		pos.y = e.y;
	},
	onMouseWheel: function(e) {
		e.stop();
		var camera = this.camera;
		camera.position.z += e.wheel;
		camera.update();
	}
},
```
一旦应用程序创建成功（编译 WebGL 程序、加载图像并将其转换为纹理等），就会执行onLoad回调。onLoad回调的第一个参数是[WebGL](http://senchalabs.github.com/philogl/doc/webgl.html#WebGL:Application) 应用程序。WebGL 应用程序类有很多有用的方法来操作程序、摄像机和场景等。我们还可以通过gl属性获得 WebGL 上下文的句柄，以备在 WebGL API 层面进行微调：

``` javascript
onError: function() {
	alert('There was an error creating the app');
},
onLoad: function(app) {
	// Unpack app properties
	var gl = app.gl,
	program = app.program,
	scene = app.scene,
	canvas = app.canvas,
	camera = app.camera;
```

在这个示例中，用户可以使用页面上的表单动态修改光照数据（环境光颜色、点光源颜色和位置）。在这里，我们获得了这些表单元素的一个句柄：
``` javascript
// Get light config from forms
lighting = $('lighting'),
ambient = {
	r: $('ambientR'),
	g: $('ambientG'),
	b: $('ambientB')
},
direction = {
	x: $('lightDirectionX'),
	y: $('lightDirectionY'),
	z: $('lightDirectionZ'),

	r: $('directionalR'),
	g: $('directionalG'),
	b: $('directionalB')
};
```
接下来，我们定义一些基本的 WebGL 设置信息：清除画布时将背景颜色设置为不透明的黑色，启用深度测试（隐藏场景中 "位于 "其他对象后面的对象），并将视窗设置为占据画布的总宽度和总高度。
``` javascript
// Basic gl setup
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.viewport(0, 0, canvas.width, canvas.height);
```
现在我们将月球添加到场景中并绘制。对于场景中的每一帧，draw()函数都会清除屏幕、设置灯光、渲染月球，并请求绘制下一帧：
``` javascript
// Add object to the scene
scene.add(moon);

// Draw the scene
draw();

function draw() {
	// Clear the screen
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Setup lighting
	var lights = scene.config.lights;
	lights.enable = lighting.checked;
	lights.ambient = {
		r: +ambient.r.value,
		g: +ambient.g.value,
		b: +ambient.b.value
	};
	lights.directional = {
		color: {
			r: +direction.r.value,
			g: +direction.g.value,
			b: +direction.b.value
		},
		direction: {
			x: +direction.x.value,
			y: +direction.y.value,
			z: +direction.z.value
		}
	};

	// Render moon
	scene.render();
	// Animate
	Fx.requestAnimationFrame(draw);
}
```

# 总结
我希望这篇文章能让你对 WebGL 有一个很好的了解，并知道如何开始构建一个简单的 WebGL 应用程序。但最重要的是，我希望这篇文章能让你对亲自尝试 WebGL 感到兴奋。我们希望在不久的将来发表更多有关 WebGL 的文章。敬请期待！

更多有用信息的链接：
[Khronos WebGL 论坛](http://www.khronos.org/message_boards/viewforum.php?f=34)
[有关 WebGL 的常见问题](http://learningwebgl.com/cookbook/index.php/WebGL:_Frequently_Asked_Questions)
[学习 WebGL 博客](http://learningwebgl.com/blog/)，一个提供 WebGL 新闻和资源的好地方

阅读本系列的第 2 部分： [WebGL 简介 - 第 2 部分：3D图像移植](https://dev.opera.com/articles/introduction-to-webgl-part-2-porting-3d/) 。
