"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sort;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _debug.default)('koa:sort');

function sort(options) {
  const defaults = {
    param: 'sort',
    asObject: false,
    ...options
  };
  return async function sortMiddleware(ctx, next) {
    const {
      query,
      method
    } = ctx.request;
    const {
      asObject,
      param: paramName,
      stateParam
    } = defaults;
    const param = query[paramName];

    if (method === 'GET' && param && typeof param === 'string') {
      const params = param.split(',');
      const sortObj = {};
      const sortArr = params.map(sortField => {
        const asc = sortField.charAt(0) === '-';
        const field = asc ? sortField.substring(1) : sortField;
        const direction = asc ? 'asc' : 'desc';
        sortObj[field] = direction;
        return [field, direction];
      });

      if (sortArr.length > 0) {
        const key = stateParam || paramName;
        const value = asObject === true ? sortObj : sortArr;
        ctx.state[key] = value;
        logger('%s: %O', `ctx.state.${key}`, value);
      }
    }

    return next();
  };
}
