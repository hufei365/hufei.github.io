---
title: 'MacOS设置 ReactNative iOS开发环境的常见问题解决方案'
pubDate: 2024-03-24T06:06:49.000Z
description: '> 同一个坑不能摔两次'
tags:
  - bug
  - question
---

> 同一个坑不能摔两次


# 安装cocoapods时出错：Failed to build gem native extension.

Mac系统通常自带ruby，但是版本一般比较旧
``` bash
ruby -v
# ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.x86_64-darwin22]
```
``` bash
which ruby
# /usr/bin/ruby
```

# 解决方法

使用brew安装最新的ruby
``` bash
brew install ruby
```
安装成功后，还需要如下改动：在${bash_profile}文件中追加如下内容。
``` bash
# Ruby Start

export PATH="/usr/local/opt/ruby/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/ruby/lib"
export CPPFLAGS="-I/usr/local/opt/ruby/include"

# Ruby End
```

bash_profile取决于你所使用的bash工具，如果是`oh-my-zsh`，那么路径应该是`~/.zshrc`。

当然，也可以借助ruby版本管理工具，替换系统自带的ruby。


# pod install时，Hermes引擎下载速度太慢的问题
手动下载安装
``` bash
$ export HERMES_ENGINE_TARBALL_PATH=/${YOUR_PATH_TO_TAR_GZ}/react-native-artifacts-0.71.11-hermes-ios-debug.tar.gz
$ pod install
...
```
# 参考信息
[Error installing cocoapods: Failed to build gem native extension](https://www.rubyonmac.dev/error-installing-cocoapods-failed-to-build-gem-native-extension)
