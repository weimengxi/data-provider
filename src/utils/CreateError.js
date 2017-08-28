import Const from '../const';

var ERROR_TYPE = Const.ERROR_TYPE;

const DEFAULT_ERROR_MSG = 'undefined message';
const DEFAULT_ERROR_TYPE = ERROR_TYPE.BUSINESS;

/* 说明 */
export default function createError({ traceid, code, message = DEFAULT_ERROR_MSG, type = ERROR_TYPE.BUSINESS, ...args }) {
    // need a real Error 
    var error = new Error(message);
    error.type = type;
    error.code = code;
    error.traceid = traceid;
    Object.assign(error, args);
    return error;
}
