import Conf from "./config";
import DataProvider from "../lib";

const {BASE_URL, PARAM_SERIALIZER_JQLIKE_ENABLED} = Conf;
const baseURL = BASE_URL;
const paramSerializerJQLikeEnabled = PARAM_SERIALIZER_JQLIKE_ENABLED;

// 创建一个DataProvider实例
var service = new DataProvider();

import fixParamsInterceptor from "./interceptors/fixParams";
import errorProcessorInterceptor from "./interceptors/errorProcessor";

// 面向切面: 按顺序组装拦截器
service.interceptors.request
  .use(fixParamsInterceptor.request)
  .interceptors.error.use(errorProcessorInterceptor.error);

var DataService = {
  post: function(uri, data){
    var config = {
      url: uri,
      method: "post",
      // to methods of that instance.
      baseURL: baseURL,
      // data仅用于post请求， 放在http请求体中
      data: data
    };

    return DataService.request(config);
  },

  get: function(uri, params){
    var config = {
      url: uri,
      // to methods of that instance.
      baseURL: baseURL,
      method: "get",
      // params仅用于get请求， 会拼接在url后面
      params: params,
      // 默认get请求可合并
      comboRequestEnabled: true
    };

    return DataService.request(config);
  },

  // let {url, baseURL, method, params, comboRequestEnabled, paramSerializerJQLikeEnabled, maxAge, ignoreExpires} = config
  request: function(config){
    let mixedConfig = {
      paramSerializerJQLikeEnabled,
      ...config
    };

    return new Promise((resolve, reject) => {
      service.request(mixedConfig).then(
        data => {
          resolve(data);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  start: () => {
    service.start();
  },
  stop: () => {
    service.stop();
  }
};

// 错误类型的定义
DataService.ErrorType = DataProvider.ErrorType; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}
DataService.createError = DataProvider.createError;

export default DataService;
