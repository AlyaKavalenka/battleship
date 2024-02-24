/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import Registration from '../websocket/reg';

const httpServer = http.createServer((req, res) => {
  const __dirname = path.resolve(path.dirname(''));
  const filePath = path.join(__dirname, (req.url === '/' ? '/front/index.html' : `/front${req.url}`));
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocketServer({ port: 3000, clientTracking: true });
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const messageString = message.toString();
    const parsedMessage = JSON.parse(messageString);
    if (parsedMessage.data) {
      parsedMessage.data = JSON.parse(parsedMessage.data);
    }
    
    console.log('parsedMessage: ', parsedMessage);

    const { type, data, id } = parsedMessage;

    switch (type) {
      case 'reg':
        const respData = Registration(data);
        const resp = {
          type: "reg",
          data: JSON.stringify(respData),
          id: 0,
        }

        ws.send(JSON.stringify(resp));

        break;

      default:
        break;
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

export default httpServer;
