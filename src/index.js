import querystring from 'querystring';

import Deferred from './utils/Deferred';
import createError from './utils/CreateError';
import createComboPromise from './utils/ComboPromise';

import DefaultConfig from './config';
import Const from './const';

import HttpWorkerFactory from './workers/Ajax';
import HttpMission from './missions/Http';

import MissionDispatcher from './MissionDispatcher';

import CacheData from './CacheData';

const AppCache = new CacheData('DATA_SOURCE_PROXY', 'v0.0.1');

function mixConfig(requestConfig) {
    return Object.assign({}, DefaultConfig, requestConfig);
}

/* 生成cache key*/
function getCacheKey({ url, maxAge, params } = requestConfig) {

    let cacheKey = null;
    if (typeof maxAge === 'number') {
        cacheKey = url + '_' + querystring.stringify(params);
    }
    return cacheKey;
}

function DataSource(workerCount = 10) {

    var interceptors = {
        request: [],
        response: [],
        error: []
    };

    var requestDefers = new Map();

    var httpMD = new MissionDispatcher(HttpWorkerFactory, workerCount);
    httpMD.start();

    this.interceptors = {
        request: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.request, args)
                return this;
            }
        },
        response: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.response, args)
                return this;
            }
        },
        error: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.error, args)
                return this;
            }
        }
    }


    this.start = () => {
        httpMD.start();
    }

    this.stop = () => {
        httpMD.stop();
    }

    this.request = (requestConfig) => {

        return new Promise((resolve, reject) => {

            let cacheKey = getCacheKey(requestConfig);
            let { maxAge, ignoreExpires } = requestConfig;
            let cacheItem, data;

            if (cacheKey === null) {
                // 没有maxAge配置，直接发起serverRequest
                resolve(this.serverRequest(requestConfig));
            } else {
                // 有maxAge配置，需要先检查cache
                cacheItem = AppCache.item(cacheKey, { maxAge, ignoreExpires });
                data = cacheItem.get();

                if (data === null) {
                    //  cache中没取到数据 || 数据过期,  发起serverRequest
                    this.serverRequest(requestConfig)
                        .then(data => {
                            cacheItem.set(data);
                            resolve(data);
                        })
                        .catch(err => reject(err))
                } else {
                    // 命中缓存
                    resolve(data)
                }
            }

        });

    }


    this.serverRequest = (requestConfig) => {

        let missionConfig = mixConfig(requestConfig || {});
        let requestDefer = new Deferred();

        // 1. requestInterceptors
        interceptors.request.reduce((configPromise, interceptor) => {
                return configPromise.then(interceptor);
            }, Promise.resolve(missionConfig))
            .then((config) => {
                return config;
            }, (interceptorError) => {
                console.log('Request Intercept Fail ... ', interceptorError);
                if (!interceptorError instanceof Error) {
                    interceptorError = createError({ message: interceptorError });
                }
                throw interceptorError;
            })
            // 2. doRequest
            .then((config) => {
                var mission = new HttpMission(config);
                // 2.1 doRequest
                httpMD.put(mission)
                    // 2.2. response or error
                    .then((result) => {
                        // 2.2.1 responseInterceptors
                        interceptors.response.reduce((resultPromise, interceptor) => {
                                return resultPromise.then((result) => {
                                    return interceptor(result, requestConfig);
                                })
                            }, Promise.resolve(result))
                            .then((result) => {
                                requestDefer.resolve(result);
                            }, (error) => {
                                /* 
                                 * @TODO
                                 * error instanceof Error && requestDefer.reject(error); 
                                 */
                                console.error('Response Intercept Exception ... ', error);
                                throw error;
                            })
                    }, (error) => {
                        // 洗数据,约定： interceptorError instanceof Error
                        let transformedError;
                        if (error instanceof Error) {
                            transformedError = error;
                        } else {
                            transformedError = createError({ message: error });
                        }
                        // 2.2.2. errorInterceptors
                        interceptors.error.reduce((errorPromise, interceptor) => {
                                return errorPromise.then((error) => {
                                    return interceptor(error, requestConfig);
                                })
                            }, Promise.resolve(transformedError))
                            .then((errorOrData) => {
                                /*
                                 * 【注意！！！】
                                 *　处理过的异常, errorInterceptor可能把error转换为正常的数据(非Error类型)
                                 *  error(一定是一个Error类型的实例)
                                 */
                                let handler = errorOrData instanceof Error ? 'reject' : 'resolve';
                                requestDefer[handler](errorOrData);

                            }, (exceptionError) => {
                                // 未处理异常
                                console.log("Error Intercept Exception ... ", exceptionError);
                                throw exceptionError;
                            })
                    })
            })
            .catch(err => {
                requestDefer.reject(err);
            })

        return requestDefer.promise;
    }
}

DataSource.ErrorType = Const.ERROR_TYPE;
DataSource.Deferred = Deferred;
DataSource.createError = createError;
DataSource.createComboPromise = createComboPromise;

export default DataSource;
