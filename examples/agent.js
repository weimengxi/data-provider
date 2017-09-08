import Conf from './config';
// import DataSource from '../index';
import DataSource from '../src/index';

const { BASE_URL, PARAM_SERIALIZER_JQLIKE_ENABLED } = Conf;
const baseURL = BASE_URL;
const paramSerializerJQLikeEnabled = PARAM_SERIALIZER_JQLIKE_ENABLED;

var dataSource = new DataSource();

// 面向切面: 按顺序组装拦截器
import fixParamsInterceptor from './interceptors/FixParams';
import errorProcessorInterceptor from './interceptors/ErrorProcessor';

dataSource
    .interceptors.request.use(fixParamsInterceptor.request)
    .interceptors.error.use(errorProcessorInterceptor.error)

var DataSourceAgent = {

    post: function(uri, data) {
        var config = {
            url: uri,
            method: 'post',
            // to methods of that instance.
            baseURL: baseURL,
            // data仅用于post请求， 放在http请求体中
            data: data
        };

        return DataSourceAgent.request(config);

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

        return DataSourceAgent.request(config);
    },

    cacheFirstGet: function(uri, params, { maxAge, ignoreExpires } = { maxAge: 60 * 60 * 1000, ignoreExpires: false }) {
        var config = {
            url: uri,
            // to methods of that instance.
            baseURL: baseURL,
            method: 'get',
            // params仅用于get请求， 会拼接在url后面
            params: params,
            // 默认get请求可合并
            comboRequestEnabled: true,
            // ============= 新增缓存数据参数  ============
            // [Number|null] 缓存时间， 单位ms. 如果需要缓存 ，请给maxAge 赋一个数值
            maxAge: maxAge,
            // [Boolean] 是否忽略缓存过期
            ignoreExpires: ignoreExpires
        };

        return DataSourceAgent.request(config);
    },

    // let {url, baseURL, method, params, comboRequestEnabled, paramSerializerJQLikeEnabled, maxAge, ignoreExpires} = config
    request: function(config) {
        let mixedConfig = { paramSerializerJQLikeEnabled, ...config };
        return new Promise((resolve, reject) => {
            dataSource.request(mixedConfig)
                .then(data => { resolve(data) }, err => { reject(err); })
        });

    },
    start: () => {
        dataSource.start();
    },
    stop: () => {
        dataSource.stop();
    }

}


// 错误类型的定义
DataSourceAgent.ErrorType = DataSource.ErrorType; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}
DataSourceAgent.createError = DataSource.createError; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}

export default DataSourceAgent;