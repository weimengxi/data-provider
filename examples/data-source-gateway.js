import Conf from './config';
import DataSourceAgent from '../dist/index';


const { BASE_URL, PARAM_SERIALIZER_JQLIKE_ENABLED } = Conf;
const baseURL = BASE_URL;
const paramSerializerJQLikeEnabled = PARAM_SERIALIZER_JQLIKE_ENABLED;

// 创建一个DataSourceAgent实例
var agent = new DataSourceAgent();


import fixParamsInterceptor from './interceptors/FixParams';
import errorProcessorInterceptor from './interceptors/ErrorProcessor';

// 面向切面: 按顺序组装拦截器
agent
    .interceptors.request.use(fixParamsInterceptor.request)
    .interceptors.error.use(errorProcessorInterceptor.error)

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


// 错误类型的定义
DataSourceGateway.ErrorType = DataSourceAgent.ErrorType; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}
DataSourceGateway.createError = DataSourceAgent.createError; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}

export default DataSourceGateway;