import DataProvider from "../../lib/index";

import Locale from "../locale";

const ErrorLocales = Locale.Errors;
const {ErrorType, Deferred, createComboPromise} = DataProvider;
const BizCommonErrorLocales = ErrorLocales[ErrorType.BUSINESS]["COMMON"];
const BizModulesErrorLocales = ErrorLocales[ErrorType.BUSINESS]["MODULES"];

/* 给error 增加一个locale字段 */
export default {
  request: config => {
    return Promise.resolve(config);
  },
  response: (result, config) => {},
  error: (error, config) => {
    let defer = new Deferred();
    let resolveDefer = () => {
      defer.resolve(error);
    };

    if (error.type === ErrorType.NETWORK) {
      error.locale = ErrorLocales[error.type]["default"];
    } else if (error.type === ErrorType.TIMEOUT) {
      error.locale = ErrorLocales[error.type]["default"];
    } else if (error.type === ErrorType.ABORT) {
      error.locale = ErrorLocales[error.type]["default"];
    } else if (error.type === ErrorType.PARSER) {
      error.locale = ErrorLocales[error.type]["default"];
    } else {
      // business Error
      let locale;

      if (error.code && error.subcode) {
        // biz-modules 模块操作错误
        let module = config.url.split("/")[0],
          moduleErrorLocales =
            BizModulesErrorLocales[module.toUpperCase()] || {};
        locale =
          moduleErrorLocales[error.subcode] || moduleErrorLocales["default"];
      } else if (error.code) {
        // biz-common错误
        locale = BizCommonErrorLocales[error.code];
      } else {
        // 兜底文案
        locale =
          error.submessage || error.message || BizCommonErrorLocales["default"];
      }

      error.locale = locale;
    }
    resolveDefer(error);

    return defer.promise;
  }
};
