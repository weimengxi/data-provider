import Mission from "./Super";

class HttpMission extends Mission {
  constructor(config) {
    super("http", config);
  }
}

export default HttpMission;
