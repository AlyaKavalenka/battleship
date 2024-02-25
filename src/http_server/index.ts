/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import Registration from '../websocket/reg';
import { createRoom, updateRoom } from '../websocket/room';

interface CustomWebSocket extends WebSocket {
  id?: string;
}

const httpServer = http.createServer((req, res) => {
  const __dirname = path.resolve(path.dirname(''));
  const filePath = path.join(
    __dirname,
    req.url === '/' ? '/front/index.html' : `/front${req.url}`
  );
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
wss.on('connection', (ws: CustomWebSocket, req) => {
  console.log('WebSocket client connected');
  ws.id = req.headers['sec-websocket-key'];

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const messageString = message.toString();
    const parsedMessage = JSON.parse(messageString);
    if (parsedMessage.data) {
      parsedMessage.data = JSON.parse(parsedMessage.data);
    }

    console.log('parsedMessage: ', parsedMessage);

    const { type, data, id } = parsedMessage;

    if (ws.id) {
      const respData = Registration(data, ws.id);
      const resp = {
        type: 'reg',
        data: JSON.stringify(respData),
        id,
      };

      switch (type) {
        case 'reg':
          ws.send(JSON.stringify(resp));
          ws.send(updateRoom());

          break;

        case 'create_room':
          createRoom(ws.id);

          ws.send(updateRoom());

          break;

        default:
          break;
      }
    } else {
      console.error(
        'Custom Error: "Something went wrong with ws.id: ',
        ws.id,
        ' "'
      );
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

export default httpServer;
