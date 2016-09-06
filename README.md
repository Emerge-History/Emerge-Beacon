# wechat-ibeacon
emerge团队的beacon项目，就是很厉害的那种

## Useage

### 安装

需要安装两个地方
```javascript
$ npm i // 服务端
$ cd web && npm i // web端
```

### 调试

web端

可以一上来就直接 gulp dist
如果全局没有安装gulp，需要 cd node_module/.bin/

```javascript
// dev 带浏览器自刷新功能
$ cd web && gulp dev 

// dist 文件压缩合并到server目录下
$ cd web && gulp dist
```

服务端

需要 beacon 数据必须要下载QQ浏览器微信调试，内网穿透 普通调试本地就好

run server
```javascript
npm start
```

## 测试页面
```javascript
http://localhost:3000/h5/demo1
```