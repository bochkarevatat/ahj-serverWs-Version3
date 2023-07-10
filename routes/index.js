const combineRouters = require('koa-combine-routers');

const index = require('./index/index');
const users = require('./users/users');

const router = combineRouters(
  index,
  users,
);

module.exports = router;