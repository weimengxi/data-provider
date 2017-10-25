(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.index = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  exports.__esModule = true;
  var DefaultConfig = {
    // `url` is the server URL that will be used for the request
    url: "",

    // `method` is the request method to be used when making the request
    method: "get", // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: "",

    // `headers` are custom headers to be sent
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    },

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {},

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream
    data: {},

    // `responseType` indicates the type of data that the server will respond with
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: "text",

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 5000, // default: 1000

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: false, // default: false

    // 请求可合并
    comboRequestEnabled: false,

    // http://api.jquery.com/jquery.param/
    // {key: ['v1', 'v2']} => key[]=v1&key=v2
    paramSerializerJQLikeEnabled: false
  };

  exports["default"] = DefaultConfig;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvaW5kZXguanMiXSwibmFtZXMiOlsiRGVmYXVsdENvbmZpZyIsInVybCIsIm1ldGhvZCIsImJhc2VVUkwiLCJoZWFkZXJzIiwicGFyYW1zIiwiZGF0YSIsInJlc3BvbnNlVHlwZSIsInRpbWVvdXQiLCJ3aXRoQ3JlZGVudGlhbHMiLCJjb21ib1JlcXVlc3RFbmFibGVkIiwicGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU1BLGdCQUFnQjtBQUNwQjtBQUNBQyxTQUFLLEVBRmU7O0FBSXBCO0FBQ0FDLFlBQVEsS0FMWSxFQUtMOztBQUVmO0FBQ0E7QUFDQTtBQUNBQyxhQUFTLEVBVlc7O0FBWXBCO0FBQ0FDLGFBQVM7QUFDUCwwQkFBb0I7QUFEYixLQWJXOztBQWlCcEI7QUFDQTtBQUNBQyxZQUFRLEVBbkJZOztBQXFCcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLFVBQU0sRUEzQmM7O0FBNkJwQjtBQUNBO0FBQ0FDLGtCQUFjLE1BL0JNOztBQWlDcEI7QUFDQTtBQUNBQyxhQUFTLElBbkNXLEVBbUNMOztBQUVmO0FBQ0E7QUFDQUMscUJBQWlCLEtBdkNHLEVBdUNJOztBQUV4QjtBQUNBQyx5QkFBcUIsS0ExQ0Q7O0FBNENwQjtBQUNBO0FBQ0FDLGtDQUE4QjtBQTlDVixHQUF0Qjs7dUJBaURlWCxhIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRGVmYXVsdENvbmZpZyA9IHtcbiAgLy8gYHVybGAgaXMgdGhlIHNlcnZlciBVUkwgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gIHVybDogXCJcIixcblxuICAvLyBgbWV0aG9kYCBpcyB0aGUgcmVxdWVzdCBtZXRob2QgdG8gYmUgdXNlZCB3aGVuIG1ha2luZyB0aGUgcmVxdWVzdFxuICBtZXRob2Q6IFwiZ2V0XCIsIC8vIGRlZmF1bHRcblxuICAvLyBgYmFzZVVSTGAgd2lsbCBiZSBwcmVwZW5kZWQgdG8gYHVybGAgdW5sZXNzIGB1cmxgIGlzIGFic29sdXRlLlxuICAvLyBJdCBjYW4gYmUgY29udmVuaWVudCB0byBzZXQgYGJhc2VVUkxgIGZvciBhbiBpbnN0YW5jZSBvZiBheGlvcyB0byBwYXNzIHJlbGF0aXZlIFVSTHNcbiAgLy8gdG8gbWV0aG9kcyBvZiB0aGF0IGluc3RhbmNlLlxuICBiYXNlVVJMOiBcIlwiLFxuXG4gIC8vIGBoZWFkZXJzYCBhcmUgY3VzdG9tIGhlYWRlcnMgdG8gYmUgc2VudFxuICBoZWFkZXJzOiB7XG4gICAgXCJYLVJlcXVlc3RlZC1XaXRoXCI6IFwiWE1MSHR0cFJlcXVlc3RcIlxuICB9LFxuXG4gIC8vIGBwYXJhbXNgIGFyZSB0aGUgVVJMIHBhcmFtZXRlcnMgdG8gYmUgc2VudCB3aXRoIHRoZSByZXF1ZXN0XG4gIC8vIE11c3QgYmUgYSBwbGFpbiBvYmplY3Qgb3IgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gIHBhcmFtczoge30sXG5cbiAgLy8gYGRhdGFgIGlzIHRoZSBkYXRhIHRvIGJlIHNlbnQgYXMgdGhlIHJlcXVlc3QgYm9keVxuICAvLyBPbmx5IGFwcGxpY2FibGUgZm9yIHJlcXVlc3QgbWV0aG9kcyAnUFVUJywgJ1BPU1QnLCBhbmQgJ1BBVENIJ1xuICAvLyBXaGVuIG5vIGB0cmFuc2Zvcm1SZXF1ZXN0YCBpcyBzZXQsIG11c3QgYmUgb2Ygb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZXM6XG4gIC8vIC0gc3RyaW5nLCBwbGFpbiBvYmplY3QsIEFycmF5QnVmZmVyLCBBcnJheUJ1ZmZlclZpZXcsIFVSTFNlYXJjaFBhcmFtc1xuICAvLyAtIEJyb3dzZXIgb25seTogRm9ybURhdGEsIEZpbGUsIEJsb2JcbiAgLy8gLSBOb2RlIG9ubHk6IFN0cmVhbVxuICBkYXRhOiB7fSxcblxuICAvLyBgcmVzcG9uc2VUeXBlYCBpbmRpY2F0ZXMgdGhlIHR5cGUgb2YgZGF0YSB0aGF0IHRoZSBzZXJ2ZXIgd2lsbCByZXNwb25kIHdpdGhcbiAgLy8gb3B0aW9ucyBhcmUgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0JywgJ3N0cmVhbSdcbiAgcmVzcG9uc2VUeXBlOiBcInRleHRcIixcblxuICAvLyBgdGltZW91dGAgc3BlY2lmaWVzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgcmVxdWVzdCB0aW1lcyBvdXQuXG4gIC8vIElmIHRoZSByZXF1ZXN0IHRha2VzIGxvbmdlciB0aGFuIGB0aW1lb3V0YCwgdGhlIHJlcXVlc3Qgd2lsbCBiZSBhYm9ydGVkLlxuICB0aW1lb3V0OiA1MDAwLCAvLyBkZWZhdWx0OiAxMDAwXG5cbiAgLy8gYHdpdGhDcmVkZW50aWFsc2AgaW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGNyb3NzLXNpdGUgQWNjZXNzLUNvbnRyb2wgcmVxdWVzdHNcbiAgLy8gc2hvdWxkIGJlIG1hZGUgdXNpbmcgY3JlZGVudGlhbHNcbiAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2VcblxuICAvLyDor7fmsYLlj6/lkIjlubZcbiAgY29tYm9SZXF1ZXN0RW5hYmxlZDogZmFsc2UsXG5cbiAgLy8gaHR0cDovL2FwaS5qcXVlcnkuY29tL2pxdWVyeS5wYXJhbS9cbiAgLy8ge2tleTogWyd2MScsICd2MiddfSA9PiBrZXlbXT12MSZrZXk9djJcbiAgcGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZDogZmFsc2Vcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRDb25maWc7XG4iXX0=