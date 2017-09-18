import Deferred from "./utils/Deferred";
import createError from "./utils/createError";
import createComboPromise from "./utils/comboPromise";

import DefaultConfig from "./config";
import Const from "./const";

import HttpWorkerFactory from "./workers/Ajax";
import HttpMission from "./missions/Http";

import MissionDispatcher from "./MissionDispatcher";

function mixConfig(requestConfig){
  return Object.assign({}, DefaultConfig, requestConfig);
}

function DataSource(workerCount = 10){
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
        Array.prototype.push.apply(interceptors.request, args);
        return this;
      }
    },
    response: {
      use: (...args) => {
        Array.prototype.push.apply(interceptors.response, args);
        return this;
      }
    },
    error: {
      use: (...args) => {
        Array.prototype.push.apply(interceptors.error, args);
        return this;
      }
    }
  };

  this.start = () => {
    httpMD.start();
  };

  this.stop = () => {
    httpMD.stop();
  };

  this.request = requestConfig => {
    let missionConfig = mixConfig(requestConfig || {});
    let requestDefer = new Deferred();

    // 1. requestInterceptors
    interceptors.request
      .reduce((configPromise, interceptor) => {
        return configPromise.then(interceptor);
      }, Promise.resolve(missionConfig))
      .then(
        config => {
          return config;
        },
        interceptorError => {
          console.log("Request Intercept Fail ... ", interceptorError);
          if (!interceptorError instanceof Error) {
            interceptorError = createError({
              message: interceptorError
            });
          }
          throw interceptorError;
        }
      )
      // 2. doRequest
      .then(config => {
        var mission = new HttpMission(config);
        // 2.1 doRequest
        httpMD
          .put(mission)
          // 2.2. response or error
          .then(
            result => {
              // 2.2.1 responseInterceptors
              interceptors.response
                .reduce((resultPromise, interceptor) => {
                  return resultPromise.then(result => {
                    return interceptor(result, requestConfig);
                  });
                }, Promise.resolve(result))
                .then(
                  result => {
                    requestDefer.resolve(result);
                  },
                  error => {
                    /* 
                 * @TODO
                 * error instanceof Error && requestDefer.reject(error); 
                 */
                    console.error("Response Intercept Exception ... ", error);
                    throw error;
                  }
                );
            },
            error => {
              // 洗数据,约定： interceptorError instanceof Error
              let transformedError;
              if (error instanceof Error) {
                transformedError = error;
              } else {
                transformedError = createError({
                  message: error
                });
              }
              // 2.2.2. errorInterceptors
              interceptors.error
                .reduce((errorPromise, interceptor) => {
                  return errorPromise.then(error => {
                    return interceptor(error, requestConfig);
                  });
                }, Promise.resolve(transformedError))
                .then(
                  errorOrData => {
                    /*
                 * 【注意！！！】
                 *　处理过的异常, errorInterceptor可能把error转换为正常的数据(非Error类型)
                 *  error(一定是一个Error类型的实例)
                 */
                    let handler =
                      errorOrData instanceof Error ? "reject" : "resolve";
                    requestDefer[handler](errorOrData);
                  },
                  exceptionError => {
                    // 未处理异常
                    console.log(
                      "Error Intercept Exception ... ",
                      exceptionError
                    );
                    throw exceptionError;
                  }
                );
            }
          );
      })
      .catch(err => {
        requestDefer.reject(err);
      });

    return requestDefer.promise;
  };
}

DataSource.ErrorType = Const.ERROR_TYPE;
DataSource.Deferred = Deferred;
DataSource.createError = createError;
DataSource.createComboPromise = createComboPromise;

export default DataSource;
