'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DefaultConfig = {
    // `url` is the server URL that will be used for the request
    url: '',

    // `method` is the request method to be used when making the request
    method: 'get', // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: '',

    // `headers` are custom headers to be sent
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Forwarded-Host': 'weimengxi.xiangyun.org'
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
    responseType: 'text',

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

exports['default'] = DefaultConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvaW5kZXguanMiXSwibmFtZXMiOlsiRGVmYXVsdENvbmZpZyIsInVybCIsIm1ldGhvZCIsImJhc2VVUkwiLCJoZWFkZXJzIiwicGFyYW1zIiwiZGF0YSIsInJlc3BvbnNlVHlwZSIsInRpbWVvdXQiLCJ3aXRoQ3JlZGVudGlhbHMiLCJjb21ib1JlcXVlc3RFbmFibGVkIiwicGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxnQkFBZ0I7QUFDbEI7QUFDQUMsU0FBSyxFQUZhOztBQUlsQjtBQUNBQyxZQUFRLEtBTFUsRUFLSDs7QUFFZjtBQUNBO0FBQ0E7QUFDQUMsYUFBUyxFQVZTOztBQVlsQjtBQUNBQyxhQUFTO0FBQ0wsNEJBQW9CLGdCQURmO0FBRUwsNEJBQW9CO0FBRmYsS0FiUzs7QUFrQmxCO0FBQ0E7QUFDQUMsWUFBUSxFQXBCVTs7QUFzQmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxVQUFNLEVBNUJZOztBQThCbEI7QUFDQTtBQUNBQyxrQkFBYyxNQWhDSTs7QUFtQ2xCO0FBQ0E7QUFDQUMsYUFBUyxJQXJDUyxFQXFDSDs7QUFFZjtBQUNBO0FBQ0FDLHFCQUFpQixLQXpDQyxFQXlDTTs7O0FBR3hCO0FBQ0FDLHlCQUFxQixLQTdDSDs7QUErQ2xCO0FBQ0E7QUFDQUMsa0NBQThCOztBQWpEWixDQUF0Qjs7cUJBcURlWCxhIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRGVmYXVsdENvbmZpZyA9IHtcbiAgICAvLyBgdXJsYCBpcyB0aGUgc2VydmVyIFVSTCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAgICB1cmw6ICcnLFxuXG4gICAgLy8gYG1ldGhvZGAgaXMgdGhlIHJlcXVlc3QgbWV0aG9kIHRvIGJlIHVzZWQgd2hlbiBtYWtpbmcgdGhlIHJlcXVlc3RcbiAgICBtZXRob2Q6ICdnZXQnLCAvLyBkZWZhdWx0XG5cbiAgICAvLyBgYmFzZVVSTGAgd2lsbCBiZSBwcmVwZW5kZWQgdG8gYHVybGAgdW5sZXNzIGB1cmxgIGlzIGFic29sdXRlLlxuICAgIC8vIEl0IGNhbiBiZSBjb252ZW5pZW50IHRvIHNldCBgYmFzZVVSTGAgZm9yIGFuIGluc3RhbmNlIG9mIGF4aW9zIHRvIHBhc3MgcmVsYXRpdmUgVVJMc1xuICAgIC8vIHRvIG1ldGhvZHMgb2YgdGhhdCBpbnN0YW5jZS5cbiAgICBiYXNlVVJMOiAnJyxcblxuICAgIC8vIGBoZWFkZXJzYCBhcmUgY3VzdG9tIGhlYWRlcnMgdG8gYmUgc2VudFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnLFxuICAgICAgICAnWC1Gb3J3YXJkZWQtSG9zdCc6ICd3ZWltZW5neGkueGlhbmd5dW4ub3JnJ1xuICAgIH0sXG5cbiAgICAvLyBgcGFyYW1zYCBhcmUgdGhlIFVSTCBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgd2l0aCB0aGUgcmVxdWVzdFxuICAgIC8vIE11c3QgYmUgYSBwbGFpbiBvYmplY3Qgb3IgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gICAgcGFyYW1zOiB7fSxcblxuICAgIC8vIGBkYXRhYCBpcyB0aGUgZGF0YSB0byBiZSBzZW50IGFzIHRoZSByZXF1ZXN0IGJvZHlcbiAgICAvLyBPbmx5IGFwcGxpY2FibGUgZm9yIHJlcXVlc3QgbWV0aG9kcyAnUFVUJywgJ1BPU1QnLCBhbmQgJ1BBVENIJ1xuICAgIC8vIFdoZW4gbm8gYHRyYW5zZm9ybVJlcXVlc3RgIGlzIHNldCwgbXVzdCBiZSBvZiBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlczpcbiAgICAvLyAtIHN0cmluZywgcGxhaW4gb2JqZWN0LCBBcnJheUJ1ZmZlciwgQXJyYXlCdWZmZXJWaWV3LCBVUkxTZWFyY2hQYXJhbXNcbiAgICAvLyAtIEJyb3dzZXIgb25seTogRm9ybURhdGEsIEZpbGUsIEJsb2JcbiAgICAvLyAtIE5vZGUgb25seTogU3RyZWFtXG4gICAgZGF0YToge30sXG5cbiAgICAvLyBgcmVzcG9uc2VUeXBlYCBpbmRpY2F0ZXMgdGhlIHR5cGUgb2YgZGF0YSB0aGF0IHRoZSBzZXJ2ZXIgd2lsbCByZXNwb25kIHdpdGhcbiAgICAvLyBvcHRpb25zIGFyZSAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnLCAnc3RyZWFtJ1xuICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuXG5cbiAgICAvLyBgdGltZW91dGAgc3BlY2lmaWVzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgcmVxdWVzdCB0aW1lcyBvdXQuXG4gICAgLy8gSWYgdGhlIHJlcXVlc3QgdGFrZXMgbG9uZ2VyIHRoYW4gYHRpbWVvdXRgLCB0aGUgcmVxdWVzdCB3aWxsIGJlIGFib3J0ZWQuXG4gICAgdGltZW91dDogNTAwMCwgLy8gZGVmYXVsdDogMTAwMFxuXG4gICAgLy8gYHdpdGhDcmVkZW50aWFsc2AgaW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGNyb3NzLXNpdGUgQWNjZXNzLUNvbnRyb2wgcmVxdWVzdHNcbiAgICAvLyBzaG91bGQgYmUgbWFkZSB1c2luZyBjcmVkZW50aWFsc1xuICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cblxuICAgIC8vIOivt+axguWPr+WQiOW5tlxuICAgIGNvbWJvUmVxdWVzdEVuYWJsZWQ6IGZhbHNlLFxuXG4gICAgLy8gaHR0cDovL2FwaS5qcXVlcnkuY29tL2pxdWVyeS5wYXJhbS9cbiAgICAvLyB7a2V5OiBbJ3YxJywgJ3YyJ119ID0+IGtleVtdPXYxJmtleT12MlxuICAgIHBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQ6IGZhbHNlXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdENvbmZpZzsiXX0=