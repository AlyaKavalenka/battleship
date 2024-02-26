import dataBase from '../db/dataBase';

export function createRoom(wsId: number | string) {
  const foundUser = dataBase.users.find((user) => user.index === wsId);

  if (foundUser) {
    const { name, index } = foundUser;
    dataBase.rooms.push({
      roomId: dataBase.rooms.length,
      roomUsers: [{ name, index }],
      isAvailable: true,
    });
  } else {
    console.error(
      'Custom Error: Something went wrong with founded user: ',
      foundUser,
      '.',
      ` wsId: ${wsId}.`,
      ' users in db: ',
      dataBase.users
    );
  }
}

export function updateRoom() {
  return JSON.stringify({
    type: 'update_room',
    data: JSON.stringify(dataBase.rooms.filter((room) => room.isAvailable)),
    id: 0,
  });
}

export function addUserToRoom(
  data: { indexRoom: number | string },
  wsId: number | string
) {
  const { indexRoom } = data;

  const foundRoomId = dataBase.rooms.findIndex(
    (room) => room.roomId === indexRoom
  );
  const foundUserByWsId = dataBase.users.find((user) => user.index === wsId);
  let res: number | string = '';

  if (foundRoomId !== -1) {
    const copiedRooms = [...dataBase.rooms];

    if (foundUserByWsId) {
      const { name, index } = foundUserByWsId;
      copiedRooms[foundRoomId].roomUsers.push({ name, index });
      copiedRooms[foundRoomId].isAvailable = false;
      dataBase.rooms = copiedRooms;

      res = foundRoomId;
    } else {
      console.error(
        'Something went wrong when finding user in db',
        ' wsId: ',
        wsId,
        ' users in db: ',
        dataBase.users
      );
    }
  } else {
    console.error(
      "Something went wrong with room. Room didn't find",
      'rooms in db: ',
      dataBase.rooms,
      ' index room from front: ',
      indexRoom
    );
  }
  return res;
}

export function createGame(props: {
  idGame: number | string;
  idPlayer: number | string;
}) {
  const { idGame, idPlayer } = props;

  const data = {
    idGame,
    idPlayer,
  };

  return JSON.stringify({
    type: 'create_game',
    data: JSON.stringify(data),
    id: 0,
  });
}
