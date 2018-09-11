"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = order;

function order(options) {
  const defaults = {
    param: 'sort',
    asObject: false,
    ...options
  };
  return async function orderMiddleware(ctx, next) {
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
      const sortArr = param.split(',');
      const orderObj = {};
      const orderArr = sortArr.map(orderField => {
        const asc = orderField.charAt(0) === '-';
        const field = asc ? orderField.substring(1) : orderField;
        const direction = asc ? 'asc' : 'desc';
        orderObj[field] = direction;
        return [field, direction];
      });

      if (orderArr.length > 0) {
        ctx.state[stateParam || paramName] = asObject === true ? orderObj : orderArr;
      }
    }

    return next();
  };
}
