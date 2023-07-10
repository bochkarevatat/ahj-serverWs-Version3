const Router = require('koa-router');
const router = new Router({ prefix: '/users'});
const fs = require('fs');
const path = require('path');
const pathDb = path.resolve(__dirname, '../../users.json');
const { v4 } = require('uuid');

router.get('/list', async (ctx) => {
  const db = require('../../users.json');

  ctx.response.body = {status: 'ok'}; 
});

router.post('/entry', async (ctx) => {
  console.log(ctx.request.body)
  let { name } = ctx.request.body;
  
  const db = require('../../users.json');
  const id = v4();

  const findName = db.find((item) => item.name === name.toLowerCase());
  if (findName) {
    ctx.response.body = { status: 'find' };
    return;
  } else {
    db.push({ id, name: name.toLowerCase() });
  }

  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      ctx.response.body = { status: 'err' };
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok', name: name, id: id};   
});

module.exports = router;