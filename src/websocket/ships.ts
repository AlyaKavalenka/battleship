import dataBase from '../db/dataBase';

interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface AddShipsData {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}

export function addShips(data: AddShipsData) {
  dataBase.games.push(data);
}

export function startGame(data: AddShipsData) {
  const { gameId, ships, indexPlayer } = data;

  const foundGame = dataBase.games.findIndex((game) => game.gameId === gameId);
  dataBase.games[foundGame].turn = indexPlayer;

  return {
    type: 'start_game',
    data: JSON.stringify({
      ships,
      currentPlayerIndex: indexPlayer,
    }),
    id: 0,
  };
}
