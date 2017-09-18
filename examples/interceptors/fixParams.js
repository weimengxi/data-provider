export default {
  request: async config => {
    // 给所有的get请求添加一个_t参数
    let baseParams = {
      _t: +new Date() //1314
    };

    return new Promise((resolve, reject) => {
      let assignTarget = config.method === "get" ? "params" : "data";
      config[assignTarget] = config[assignTarget] || {};
      Object.assign(config[assignTarget], baseParams);
      resolve(config);
    });
  }
};
