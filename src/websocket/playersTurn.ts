import dataBase from '../db/dataBase';

export default function playersTurn(gameId: number | string) {
  const currentPlayer = dataBase.games.find(
    (game) => game.gameId === gameId
  )?.turn;

  console.log('playersTurn: ', currentPlayer);

  return JSON.stringify({
    type: 'turn',
    data: JSON.stringify({
      currentPlayer,
    }),
    id: 0,
  });
}
