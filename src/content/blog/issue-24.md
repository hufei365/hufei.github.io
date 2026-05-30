---
title: 'JavaScript 之 原型和原型链'
pubDate: 2019-06-29T13:52:05.000Z
description: 'JavaScript 之 原型和原型链'
tags:
  - JavaScript
---

# JavaScript 之 原型和原型链
## 几个概念
1. 构造函数： 构造函数实际上是一个普通函数，通过new操作符，可以利用构造函数快速创建对象；
2. prototype：每个构造函数自身上都会有一个prototype属性，该属性值为一个对象，这个对象具有一个constructor属性，constructor指向构造函数自身；
3. 实例： 通过构造函数创建的对象，可以看做是该构造函数的实例；
4. \_\_proto\_\_：通过构造函数创建的每个对象上面，都会有一个__proto__属性，该属性指向构造函数的prototype；

## 什么是原型
在JavaScript中，每个对象会有一个原型对象。对象会从原型对象继承一些属性和方法。
## 什么是原型链
在JavaScript中，访问一个对象的属性时，JS引擎会首先在该对象自身上线查找该属性。如果找到了，则直接返回该属性的值；如果没有找到，则会去改对象的原型上面继续查找。如果对象的原型上面也没有这个属性，则继续在原型对象的上原型上面查找，如此一级级继续往上，直到原型为null，此时JS引擎返回该对象的属性值为undefined。
## 继承
```javascript
		/**
		 * two methods to implement inheritance;
		*/

		function Base(type){ 
			this.type = type;
			this.nums = [1];
			this.level={
				value: 1,
				name: 'base'
			}
		}
		Base.prototype.base=function(){
			console.log(`${this.type} is in base func`);
		}
		// method one
		function Sub(type){
			Base.call(this, type);// 属性值也继承过来
			this.type = type;
			// this.level={
			// 	value: 2,
			// 	name: 'sub'
			// }
		}
		Sub.prototype = Object.create(new Base('base'));
		Sub.prototype.sub=function(){
			console.log(`${this.type} is in sub func`);
		}

		// method two
		function Foo(type){
			Sub.call(this, type);
			this.type = type;
		}
		Object.setPrototypeOf( Foo.prototype, new Sub('sub'));
		Foo.prototype.foo=function(){
			console.log(`${this.type} is in foo func`);
		}

		let sub = new Sub('sub1');
		sub.base();
		sub.sub();
		sub instanceof Sub;
		sub instanceof Base;

		let foo = new Foo('foo1');
		foo.base();
		foo.sub();
		foo.foo();
		foo instanceof Foo;
		foo instanceof Sub;
		foo instanceof Base;

		let foo2 = new Foo('foo2');

		foo2.words.push('black');

		console.log(foo.words);
```


## 一些实例
### Object.getPrototype
预测下面几个表达式的结果
```javascript
Object.getPrototypeOf(function(){}).constructor === Function;
Object.getPrototypeOf(Function).constructor === Function;
Object.getPrototypeOf(Object.getPrototypeOf(Function)).constructor === Object;
```

答案：
```javascript
true;

```
### 如何创建一个没有任何原型的对象？
``` javascript
let obj = Object.create(null);
console.log(obj);
```

![image](https://files.seeusercontent.com/2026/05/30/s8nJ/img_9a19b8ff0ecd.png)



这篇medium上获得8.6K赞的文章[Prototypes in JavaScript](https://medium.com/better-programming/prototypes-in-javascript-5bba2990e04b)讲得很清楚了。
