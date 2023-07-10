const fs = require('fs');
const path = require('path');
const pathDb = path.resolve(__dirname, '../msg.json');
const { v4 } = require('uuid');

let arrWS = [];
let userOnline = [];

const wSocket = (ws) => {
  ws.id = v4();
  console.log('connect');
  arrWS.push(ws);
  ws.send(JSON.stringify({ joining: ws.id }));
  ws.on('message', (message) => {
    const dbMsg = require('../msg.json');
    const msg = JSON.parse( message.toString());
    if (msg.name) {
      console.log('msg.name')
      console.log('add user: ', msg.name);
      userOnline.push({ name: msg.name, id: ws.id });
      arrWS.forEach(item => item.send(JSON.stringify({ online: userOnline})));
      ws.send(JSON.stringify({ loadMsg: dbMsg}));
    } else {
      console.log('message: ', msg.message);
      const name = userOnline.find(item => item.id === ws.id).name;
      
      const newMsg = {id: v4(), user: name, created: msg.message.date, text: msg.message.text};
      dbMsg.push(newMsg);
      console.log('push(newMsg)')
      fs.writeFile(pathDb, JSON.stringify(dbMsg, null, 2), (err) => { 
        if (err) {
          console.error(err)
          ctx.response.body = { status: 'err' };
          throw err; 
        } 
      }); 
      arrWS.forEach(item => item.send(JSON.stringify({message: newMsg})));
    }   

  })
    
  ws.on('close', () => {
    console.log("close");
    arrWS = arrWS.filter(item => item.id !== ws.id);
    userOnline = userOnline.filter(item => item.id !== ws.id);
    arrWS.forEach(item => item.send(JSON.stringify({ online: userOnline})));
  });
}

module.exports = wSocket;