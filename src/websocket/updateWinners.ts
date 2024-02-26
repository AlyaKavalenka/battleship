import { WebSocket } from 'ws';
import dataBase from '../db/dataBase';
import { wss } from '../http_server';

export default function updateWinners() {
  console.log('update_winners');

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'update_winners',
          data: JSON.stringify(
            dataBase.wins.map((win) => ({ name: win.name, wins: win.wins }))
          ),
          id: 0,
        })
      );
    }
  });
}
