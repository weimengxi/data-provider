//本地化文案
import DataProvider from "../../lib/index";

const {ErrorType, Deferred, createComboPromise} = DataProvider;

/* 业务-[通用|模块}'错误提示信息 */
const Errors = {
  // 网络异常
  [ErrorType.NETWORK]: {
    // 'default': '亲爱的用户现在网络异常，请检查网络连接或稍后重试!'
    default: "亲爱的用户现在网络异常，请稍后重试!"
  },
  // 取消
  [ErrorType.ABORT]: {
    default: "请求取消"
  },
  // 前端址时
  [ErrorType.TIMEOUT]: {
    default: "请求超时，请稍后重试"
  },
  // 解析错误， 返回数据结构异常
  [ErrorType.PARSER]: {
    default: "数据解析失败，请稍后重试"
  },
  [ErrorType.BUSINESS]: {
    // 通用错误, code, 首字符代表错误级别：4代表请求端错误，5带面server段发生错误）
    COMMON: {
      400: "参数内容错误", // 参数内容错误
      401: "缺少必要参数", // 缺少必要参数
      402: "未登录，请先登录", // 未登录
      403: "表单重复提交", // 表单重复提交
      404: "请求资源不存在", // 请求资源不存在
      405: "无权操作", // 无权操作，受限
      406: "", // 资源不满足请求条件
      408: "请求超时，请稍后重试", // 请求超时
      409: "", // 操作不满足超限(limit)
      410: "请求的资源不可用", // 请求的资源不可用
      502: "系统发生异常，请稍后重试", // 依赖的服务报错
      503: "系统发生异常，请稍后重试", // 系统发生临时错误
      504: "系统发生异常，请稍后重试", //系统发生致命错误
      default: "操作失败，请稍后重试" // 兜底文案
    },
    // 模块级错误， subcode
    MODULES: {
      // 商品
      GOODS: {
        1901: "商品不存在" // 商品不存在
      }
    }
  }
};

export default {
  Errors
};
