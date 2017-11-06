[TOC]

# data-provider

### Installation

```
npm install @bbfe/data-provider
```

### Features

- 提供面向切面的统一处理能力， 分为三个阶段`request`请求发起前， `response` 接收到正常响应时, `error` 接收响应异常时
- 高频发生请求的合并处理功能

### Example 

参考`examples/dataService.js` 示例, 运行examples命令

```
npm run dev
```

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
// example/dataService.js

import DataProvider from '@bbfe/data-provider';
import fixParamsInterceptor from './interceptors/FixParams';

// 创建一个DataProvider实例
var service = new DataProvider();

// 面向切面: 按顺序组装拦截器
service
    .interceptors.request.use(fixParamsInterceptor.request)
    .interceptors.error.use(errorProcessorInterceptor.error)

```

#### 控制频发请求是否合并

`data-provider` 在配置中提供了一个开关 `comboRequestEnabled` 来决定是否合并频发请求。 

可以在`data-provider.request(config)` 的基础上封装语法糖， 简化config的传入操作。

以封装的data-source-gateway 为例：

```
// example/dataService.js

var DataService = {

    post: function(uri, data) {
        var config = {
            url: uri,
            method: 'post',
            // to methods of that instance.
            baseURL: baseURL,
            // data仅用于post请求， 放在http请求体中
            data: data
        };

        return DataService.request(config);

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

        return DataService.request(config);
    },

    // let {url, baseURL, method, params, comboRequestEnabled, paramSerializerJQLikeEnabled} = config
    request: function(config) {
    // paramSerializerJQLikeEnabled: 默认开启用jquery.param进行请求参数的序列化
        let mixedConfig = { paramSerializerJQLikeEnabled, ...config };
        return new Promise((resolve, reject) => {
            service.request(mixedConfig)
                .then(data => { resolve(data) }, err => { reject(err); })
        });

    },
    start: () => {
        service.start();
    },
    stop: () => {
        service.stop();
    }

}
```

### API

data-provider 判断请求是否成功的标准为 response httpCode 是否为 2xx

#### Constructor Params
- `workerCount` 默认是 10
- `strategy` response 处理策略，类型是 Function，参数为(data, status, resolve, reject)，内置默认策略，
http 2xx 如果返回值中存在 error 属性或 code 属性，则标记为 Biz Error

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



