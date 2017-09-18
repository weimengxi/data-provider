class Mission {
  constructor(type, config) {
    this.type = type;
    this.config = config;
    //假设JSON.stringify序列化结果是稳定得
    this.signature = JSON.stringify({type: type, config: config});
    this.createTime = Date.now();
  }
}

export default Mission;
