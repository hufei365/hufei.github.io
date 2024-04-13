declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"0001_DOM扩展.md": {
	id: "0001_DOM扩展.md";
  slug: "0001_dom扩展";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0002_float元素换行展示的问题.md": {
	id: "0002_float元素换行展示的问题.md";
  slug: "0002_float元素换行展示的问题";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0003_CSS中的盒模型.md": {
	id: "0003_CSS中的盒模型.md";
  slug: "0003_css中的盒模型";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0004_CSS2中的有关盒模型与布局的一些概念.md": {
	id: "0004_CSS2中的有关盒模型与布局的一些概念.md";
  slug: "0004_css2中的有关盒模型与布局的一些概念";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0005_现代浏览器的背后的工作原理.md": {
	id: "0005_现代浏览器的背后的工作原理.md";
  slug: "0005_现代浏览器的背后的工作原理";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0006_ES6中箭头函数的作用.md": {
	id: "0006_ES6中箭头函数的作用.md";
  slug: "0006_es6中箭头函数的作用";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0007_JS模块规范回炉再造.md": {
	id: "0007_JS模块规范回炉再造.md";
  slug: "0007_js模块规范回炉再造";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0008_聊聊CSS中counter.md": {
	id: "0008_聊聊CSS中counter.md";
  slug: "0008_聊聊css中counter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0009_CSS中的内联元素.md": {
	id: "0009_CSS中的内联元素.md";
  slug: "0009_css中的内联元素";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0010_利用clear清除浮动的一些问题.md": {
	id: "0010_利用clear清除浮动的一些问题.md";
  slug: "0010_利用clear清除浮动的一些问题";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0011_BFC及自适应布局.md": {
	id: "0011_BFC及自适应布局.md";
  slug: "0011_bfc及自适应布局";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0012_A trick 用JS获取随机颜色.md": {
	id: "0012_A trick 用JS获取随机颜色.md";
  slug: "0012_a-trick-用js获取随机颜色";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0013_图解HTTP.md": {
	id: "0013_图解HTTP.md";
  slug: "0013_图解http";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0014_元素总是居中且高度是宽度的50%.md": {
	id: "0014_元素总是居中且高度是宽度的50%.md";
  slug: "0014_元素总是居中且高度是宽度的50";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0015_background-clip和半透明边框.md": {
	id: "0015_background-clip和半透明边框.md";
  slug: "0015_background-clip和半透明边框";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0016_CSS揭秘之多重边框.md": {
	id: "0016_CSS揭秘之多重边框.md";
  slug: "0016_css揭秘之多重边框";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0017_【CSS揭秘】之用CSS实现一些基本形状.md": {
	id: "0017_【CSS揭秘】之用CSS实现一些基本形状.md";
  slug: "0017_css揭秘之用css实现一些基本形状";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0018_一个简单的输出测试.md": {
	id: "0018_一个简单的输出测试.md";
  slug: "0018_一个简单的输出测试";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0019_ES6之Promise.md": {
	id: "0019_ES6之Promise.md";
  slug: "0019_es6之promise";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0020_三种基本排序.md": {
	id: "0020_三种基本排序.md";
  slug: "0020_三种基本排序";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0021_js取0到50之间10个不重复的随机数.md": {
	id: "0021_js取0到50之间10个不重复的随机数.md";
  slug: "0021_js取0到50之间10个不重复的随机数";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0022_js深拷贝与循环引用.md": {
	id: "0022_js深拷贝与循环引用.md";
  slug: "0022_js深拷贝与循环引用";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0023_手写bind.md": {
	id: "0023_手写bind.md";
  slug: "0023_手写bind";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0024_JavaScript 之 原型和原型链.md": {
	id: "0024_JavaScript 之 原型和原型链.md";
  slug: "0024_javascript-之-原型和原型链";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0025_JS之防抖(debounce)和节流（throttle）.md": {
	id: "0025_JS之防抖(debounce)和节流（throttle）.md";
  slug: "0025_js之防抖debounce和节流throttle";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0026_JS中的函数.md": {
	id: "0026_JS中的函数.md";
  slug: "0026_js中的函数";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0027_浏览器页面渲染——经典题目：输入URL后发生了什么？.md": {
	id: "0027_浏览器页面渲染——经典题目：输入URL后发生了什么？.md";
  slug: "0027_浏览器页面渲染经典题目输入url后发生了什么";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0028_不用除法，一个简单的算法题.md": {
	id: "0028_不用除法，一个简单的算法题.md";
  slug: "0028_不用除法一个简单的算法题";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0029_洋葱模型.md": {
	id: "0029_洋葱模型.md";
  slug: "0029_洋葱模型";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0030_WebGL 深入浅出.md": {
	id: "0030_WebGL 深入浅出.md";
  slug: "0030_webgl-深入浅出";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0031_MacOS设置 ReactNative iOS开发环境的常见问题解决方案.md": {
	id: "0031_MacOS设置 ReactNative iOS开发环境的常见问题解决方案.md";
  slug: "0031_macos设置-reactnative-ios开发环境的常见问题解决方案";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0032_Set VS Array.md": {
	id: "0032_Set VS Array.md";
  slug: "0032_set-vs-array";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0033_比Map自由度更高一些的flatMap.md": {
	id: "0033_比Map自由度更高一些的flatMap.md";
  slug: "0033_比map自由度更高一些的flatmap";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0034_Draft：常见面试题之事件循环.md": {
	id: "0034_Draft：常见面试题之事件循环.md";
  slug: "0034_draft常见面试题之事件循环";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"0035_CSS 布局之如何使用CSS构建一个瀑布流.md": {
	id: "0035_CSS 布局之如何使用CSS构建一个瀑布流.md";
  slug: "0035_css-布局之如何使用css构建一个瀑布流";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"books": {
};
"movies": {
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
