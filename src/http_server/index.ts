/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import Registration from '../websocket/reg';
import {
  addUserToRoom,
  createGame,
  createRoom,
  updateRoom,
} from '../websocket/room';
import dataBase from '../db/dataBase';
import playersTurn from '../websocket/playersTurn';
import { addShips, startGame } from '../websocket/ships';
import { attack } from '../websocket/game';

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
    const messageString = message.toString();
    const parsedMessage = JSON.parse(messageString);
    if (parsedMessage.data) {
      parsedMessage.data = JSON.parse(parsedMessage.data);
    }

    const { type, data, id } = parsedMessage;

    if (ws.id) {
      const respData = Registration(data, ws.id);
      const resp = {
        type: 'reg',
        data: JSON.stringify(respData),
        id,
      };
      let idGame: number | string = '';

      switch (type) {
        case 'reg':
          ws.send(JSON.stringify(resp));
          ws.send(updateRoom());

          break;

        case 'create_room':
          createRoom(ws.id);

          ws.send(updateRoom());

          break;

        case 'add_user_to_room':
          idGame = addUserToRoom(data, ws.id);

          ws.send(updateRoom());
          ws.send(createGame({ idGame, idPlayer: ws.id }));

          break;

        case 'add_ships':
          addShips(data);

          const currentGames = dataBase.games.filter(
            (game) => game.gameId == data.gameId
          );

          if (currentGames.length === 2) {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                currentGames.map((game) => {
                  client.send(JSON.stringify(startGame(game)));
                });

                client.send(playersTurn(data.gameId));
              }
            });
          }

          break;

        case 'attack':
          const attackFeedback = attack(data);

          if (attackFeedback !== null) {
            ws.send(attackFeedback);
          }
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
