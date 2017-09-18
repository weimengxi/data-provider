import querystring from "querystring-es3";
import param from "jquery-param";

/*
 * @desc 序列化请求参数的方式
 * @param Boolean
 * @ret Function
 */
export function getParamSerializer(paramSerializerJQLikeEnabled){
  let paramSerializerFn = paramSerializerJQLikeEnabled
    ? param
    : querystring.stringify;
  return paramSerializerFn;
}
