import querystring from 'querystring';
import axios from 'axios';
// import 'axios-response-logger';

import Const from '../const';

import createError from '../utils/CreateError';

var ERROR_TYPE = Const.ERROR_TYPE;

var JSON = (typeof window === 'undefined' ? global : window).JSON || {};

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 * @refer https://github.com/mzabriskie/axios/blob/master/lib/utils.js
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}

function transformMissionConfig(config) {

    let transformedConfig = Object.assign({}, config)

    if (config.method === 'post' && isObject(transformedConfig.data)) {
        transformedConfig.data = querystring.stringify(transformedConfig.data);
    }

    return transformedConfig;
}

class AjaxWorkerFactory {

    do(mission) {
        return new Promise((resolve, reject) => {
            // axiosSchema: https://github.com/mzabriskie/axios
            let transformedConfig = transformMissionConfig(mission.config);

            axios.request(transformedConfig).then(({ data, status, statusText, headers, config, response }) => {
                if (Object.prototype.toString.call(data) !== "[object Object]") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        let message = "response is not a instance of JSON ";
                        console.error("response of '%s' is not JSON ", config.url);
                        let parserError = createError({ message: message, type: ERROR_TYPE.PARSER });
                        reject(parserError);

                    }
                }

                // reslove 
                // [!important] 新增的 (data.code) 逻辑判断是为了兼容服务端api error返回结构争议
                if (data.error || data.code) {
                    // 2. bizError
                    let rawError = data.error || data;
                    let businessError = createError(rawError);
                    reject(businessError);
                } else {
                    resolve(data);
                }

            }, (error) => {
                if (axios.isCancel(error)) {
                    // abort error
                    console.log('Request canceled', error.message);
                    let abortError = createError({ message: error.message, type: ERROR_TYPE.ABORT, code: error.code, subcode: error.subcode });
                    reject(abortError);
                } else if (error.code === 'ECONNABORTED') {
                    // timeout error
                    let timeoutError = createError({ message: error.message, type: ERROR_TYPE.TIMEOUT, code: error.code, subcode: error.subcode });
                    reject(timeoutError);
                } else if (error.response) {
                    // network error 
                    // The request was made, but the server responded with a status code
                    // that falls out of the range of 2xx
                    let { status, statusText, headers, config } = error.response;
                    let networkError = createError({ message: statusText, type: ERROR_TYPE.NETWORK, code: status, subcode: error.subcode });
                    reject(networkError);
                } else {
                    console.error("another error: ", error);
                    let networkError1 = createError({ message: error.message, type: ERROR_TYPE.NETWORK });
                    reject(networkError1);
                }
            })
        });
    }
}

export default AjaxWorkerFactory;