const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.response.body = {status: 'ok'};
});

module.exports = router;