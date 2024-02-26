import dataBase, { GameType } from '../db/dataBase';

interface AttackData {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

function createMatrix() {
  const arr: number[][] = [];

  for (let i = 0; i < 10; i++) {
    arr[i] = [];
    for (let j = 0; j < 10; j++) {
      arr[i][j] = 0;
    }
  }

  return arr;
}

function checkShot(props: { currGame: GameType; x: number; y: number }) {
  const { currGame, x, y } = props;

  const ships = currGame.ships;
  let status = '';
  let lastShipLength = 0;
  let shotCounter = 0;

  if (currGame.matrix)
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const direction = ship.direction;
      const length = ship.length;
      const shipX = ship.position.x;
      const shipY = ship.position.y;

      lastShipLength = length;

      shotCounter = 0;

      if (direction === false) {
        const xEnd = shipX + length;

        if (x < xEnd && x >= shipX && y === shipY) {
          for (let k = shipX; k < xEnd; k++) {
            if (currGame.matrix[shipY][k] === 1) shotCounter++;
          }
          break;
        }
      } else {
        const yEnd = shipY + length;

        if (y < yEnd && y >= shipY && x === shipX) {
          for (let j = shipY; j < yEnd; j++) {
            if (currGame.matrix[j][shipX] === 1) shotCounter++;
          }
          break;
        }
      }
    }
  if (lastShipLength === shotCounter) {
    status = 'killed';
  } else if (shotCounter > 0) {
    status = 'shot';
  } else {
    status = 'miss';
  }
  return status;
}

export function attack(data: AttackData) {
  const { gameId, x, y, indexPlayer } = data;

  const foundById = dataBase.games.findIndex(
    (game) => game.gameId === gameId && game.indexPlayer !== indexPlayer
  );
  let status = '';

  if (foundById !== -1) {
    const currGame = dataBase.games[foundById];

    if (currGame.matrix === undefined) currGame.matrix = createMatrix();

    if (currGame.matrix[y][x] === 1) {
      console.log('already clicked');
    } else {
      currGame.matrix[y][x] = 1;
      status = checkShot({ currGame, x, y }) || '';
    }
  } else {
    console.error('Custom Error: This game was not found');
  }

  return status !== ''
    ? JSON.stringify({
        type: 'attack',
        data: JSON.stringify({
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status,
        }),
        id: 0,
      })
    : null;
}
