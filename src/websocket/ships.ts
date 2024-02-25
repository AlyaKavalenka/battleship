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

  let resData: {
    ships: Ship[];
    currentPlayerIndex: number | string;
  } | null = null;

  if (dataBase.games.filter((game) => game.gameId == gameId).length === 2) {
    resData = {
      ships,
      currentPlayerIndex: indexPlayer,
    };
  }

  return {
    type: 'start_game',
    data: resData !== null ? JSON.stringify(data) : null,
    id: 0,
  };
}
