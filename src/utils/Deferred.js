class Deferred {
  constructor() {
    this.promise = new Promise(
      function(resolve, reject){
        this._resolve = resolve;
        this._reject = reject;
      }.bind(this)
    );
  }

  resolve(value) {
    this._resolve.call(this.promise, value);
  }

  reject(reason) {
    this._reject.call(this.promise, reason);
  }
}

export default Deferred;
