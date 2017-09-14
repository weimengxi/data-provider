[TOC]

# data-source-agent

### Installation

```
npm install data-source-agent
```

### Features

- 提供面向切面的统一处理能力， 分为三个阶段`request`请求发起前， `response` 接收到正常响应时, `error` 接收响应异常时
- 高频发生请求的合并处理功能

### Example 

参考`examples/data-source-gateway.js` 示例

#### 拦截器的用法

 **请注意**：拦截器的每个切面接受请求config参数， 应该返回一个 Promise， 以完成后续流程。 

1. 编写一个拦截器。 一个拦截器的结构如下

```
// example/interceptors/fixParams.js
export default {
    request: async (config) => {
        // 给所有的get请求添加一个_t参数 
        let baseParams = {
        	_t:  +new Date()//1314
        };

        return new Promise((resolve, reject) => {
            let assignTarget = config.method === 'get' ? 'params' : 'data';
            config[assignTarget] = config[assignTarget] || {};
            Object.assign(config[assignTarget], baseParams);
            resolve(config);
        })
    },
    response: async (config) => {
      // return Promise
    },
    error: async (config) => {
      // return Promise
    }
}
```

2.  在data-source-gateway中注册拦截器

```
// example/data-source-gateway.js

import DataSourceAgent from 'data-source-agent';
import fixParamsInterceptor from './interceptors/FixParams';

// 创建一个DataSourceAgent实例
var agent = new DataSourceAgent();

// 面向切面: 按顺序组装拦截器
agent
    .interceptors.request.use(fixParamsInterceptor.request)
    .interceptors.error.use(errorProcessorInterceptor.error)

```

#### 控制频发请求是否合并

`data-source-agent` 在配置中提供了一个开关 `comboRequestEnabled` 来决定是否合并频发请求。 

可以在`data-source-agent.request(config)` 的基础上封装语法糖， 简化config的传入操作。

以封装的data-source-gateway 为例：

```
// example/data-source-gateway.js

var DataSourceGateway = {

    post: function(uri, data) {
        var config = {
            url: uri,
            method: 'post',
            // to methods of that instance.
            baseURL: baseURL,
            // data仅用于post请求， 放在http请求体中
            data: data
        };

        return DataSourceGateway.request(config);

    },

    get: function(uri, params) {

        var config = {
            url: uri,
            // to methods of that instance.
            baseURL: baseURL,
            method: 'get',
            // params仅用于get请求， 会拼接在url后面
            params: params,
            // 默认get请求可合并
            comboRequestEnabled: true
        };

        return DataSourceGateway.request(config);
    },

    // let {url, baseURL, method, params, comboRequestEnabled, paramSerializerJQLikeEnabled, maxAge, ignoreExpires} = config
    request: function(config) {
    // paramSerializerJQLikeEnabled: 默认开启用jquery.param进行请求参数的序列化
        let mixedConfig = { paramSerializerJQLikeEnabled, ...config };
        return new Promise((resolve, reject) => {
            agent.request(mixedConfig)
                .then(data => { resolve(data) }, err => { reject(err); })
        });

    },
    start: () => {
        agent.start();
    },
    stop: () => {
        agent.stop();
    }

}
```

### API

#### Instance Methods

- `request`开始一个请求流程
- `start` 开始接受请求任务
- `stop` 停止接受请求处理任务

#### Static Methods

- `createError` 创建一个Error类型的异常
- `createComboPromise`合并promise

#### Static Properties

- `ErrorType`

- `Deferred`  一个延迟对象的构造函数

  ​



