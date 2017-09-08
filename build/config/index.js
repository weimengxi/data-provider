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
    headers: { 'X-Requested-With': 'XMLHttpRequest' },

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvaW5kZXguanMiXSwibmFtZXMiOlsiRGVmYXVsdENvbmZpZyIsInVybCIsIm1ldGhvZCIsImJhc2VVUkwiLCJoZWFkZXJzIiwicGFyYW1zIiwiZGF0YSIsInJlc3BvbnNlVHlwZSIsInRpbWVvdXQiLCJ3aXRoQ3JlZGVudGlhbHMiLCJjb21ib1JlcXVlc3RFbmFibGVkIiwicGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxnQkFBZ0I7QUFDbEI7QUFDQUMsU0FBSyxFQUZhOztBQUlsQjtBQUNBQyxZQUFRLEtBTFUsRUFLSDs7QUFFZjtBQUNBO0FBQ0E7QUFDQUMsYUFBUyxFQVZTOztBQVlsQjtBQUNBQyxhQUFTLEVBQUUsb0JBQW9CLGdCQUF0QixFQWJTOztBQWVsQjtBQUNBO0FBQ0FDLFlBQVEsRUFqQlU7O0FBbUJsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsVUFBTSxFQXpCWTs7QUEyQmxCO0FBQ0E7QUFDQUMsa0JBQWMsTUE3Qkk7O0FBZ0NsQjtBQUNBO0FBQ0FDLGFBQVMsSUFsQ1MsRUFrQ0g7O0FBRWY7QUFDQTtBQUNBQyxxQkFBaUIsS0F0Q0MsRUFzQ007OztBQUd4QjtBQUNBQyx5QkFBcUIsS0ExQ0g7O0FBNENsQjtBQUNBO0FBQ0FDLGtDQUE4Qjs7QUE5Q1osQ0FBdEI7O3FCQWtEZVgsYSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IERlZmF1bHRDb25maWcgPSB7XG4gICAgLy8gYHVybGAgaXMgdGhlIHNlcnZlciBVUkwgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gICAgdXJsOiAnJyxcblxuICAgIC8vIGBtZXRob2RgIGlzIHRoZSByZXF1ZXN0IG1ldGhvZCB0byBiZSB1c2VkIHdoZW4gbWFraW5nIHRoZSByZXF1ZXN0XG4gICAgbWV0aG9kOiAnZ2V0JywgLy8gZGVmYXVsdFxuXG4gICAgLy8gYGJhc2VVUkxgIHdpbGwgYmUgcHJlcGVuZGVkIHRvIGB1cmxgIHVubGVzcyBgdXJsYCBpcyBhYnNvbHV0ZS5cbiAgICAvLyBJdCBjYW4gYmUgY29udmVuaWVudCB0byBzZXQgYGJhc2VVUkxgIGZvciBhbiBpbnN0YW5jZSBvZiBheGlvcyB0byBwYXNzIHJlbGF0aXZlIFVSTHNcbiAgICAvLyB0byBtZXRob2RzIG9mIHRoYXQgaW5zdGFuY2UuXG4gICAgYmFzZVVSTDogJycsXG5cbiAgICAvLyBgaGVhZGVyc2AgYXJlIGN1c3RvbSBoZWFkZXJzIHRvIGJlIHNlbnRcbiAgICBoZWFkZXJzOiB7ICdYLVJlcXVlc3RlZC1XaXRoJzogJ1hNTEh0dHBSZXF1ZXN0JyB9LFxuXG4gICAgLy8gYHBhcmFtc2AgYXJlIHRoZSBVUkwgcGFyYW1ldGVycyB0byBiZSBzZW50IHdpdGggdGhlIHJlcXVlc3RcbiAgICAvLyBNdXN0IGJlIGEgcGxhaW4gb2JqZWN0IG9yIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICAgIHBhcmFtczoge30sXG5cbiAgICAvLyBgZGF0YWAgaXMgdGhlIGRhdGEgdG8gYmUgc2VudCBhcyB0aGUgcmVxdWVzdCBib2R5XG4gICAgLy8gT25seSBhcHBsaWNhYmxlIGZvciByZXF1ZXN0IG1ldGhvZHMgJ1BVVCcsICdQT1NUJywgYW5kICdQQVRDSCdcbiAgICAvLyBXaGVuIG5vIGB0cmFuc2Zvcm1SZXF1ZXN0YCBpcyBzZXQsIG11c3QgYmUgb2Ygb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZXM6XG4gICAgLy8gLSBzdHJpbmcsIHBsYWluIG9iamVjdCwgQXJyYXlCdWZmZXIsIEFycmF5QnVmZmVyVmlldywgVVJMU2VhcmNoUGFyYW1zXG4gICAgLy8gLSBCcm93c2VyIG9ubHk6IEZvcm1EYXRhLCBGaWxlLCBCbG9iXG4gICAgLy8gLSBOb2RlIG9ubHk6IFN0cmVhbVxuICAgIGRhdGE6IHt9LFxuXG4gICAgLy8gYHJlc3BvbnNlVHlwZWAgaW5kaWNhdGVzIHRoZSB0eXBlIG9mIGRhdGEgdGhhdCB0aGUgc2VydmVyIHdpbGwgcmVzcG9uZCB3aXRoXG4gICAgLy8gb3B0aW9ucyBhcmUgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0JywgJ3N0cmVhbSdcbiAgICByZXNwb25zZVR5cGU6ICd0ZXh0JyxcblxuXG4gICAgLy8gYHRpbWVvdXRgIHNwZWNpZmllcyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIHJlcXVlc3QgdGltZXMgb3V0LlxuICAgIC8vIElmIHRoZSByZXF1ZXN0IHRha2VzIGxvbmdlciB0aGFuIGB0aW1lb3V0YCwgdGhlIHJlcXVlc3Qgd2lsbCBiZSBhYm9ydGVkLlxuICAgIHRpbWVvdXQ6IDUwMDAsIC8vIGRlZmF1bHQ6IDEwMDBcblxuICAgIC8vIGB3aXRoQ3JlZGVudGlhbHNgIGluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBjcm9zcy1zaXRlIEFjY2Vzcy1Db250cm9sIHJlcXVlc3RzXG4gICAgLy8gc2hvdWxkIGJlIG1hZGUgdXNpbmcgY3JlZGVudGlhbHNcbiAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXG5cbiAgICAvLyDor7fmsYLlj6/lkIjlubZcbiAgICBjb21ib1JlcXVlc3RFbmFibGVkOiBmYWxzZSxcblxuICAgIC8vIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qcXVlcnkucGFyYW0vXG4gICAgLy8ge2tleTogWyd2MScsICd2MiddfSA9PiBrZXlbXT12MSZrZXk9djJcbiAgICBwYXJhbVNlcmlhbGl6ZXJKUUxpa2VFbmFibGVkOiBmYWxzZVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRDb25maWc7XG4iXX0=