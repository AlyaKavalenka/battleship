import dataBase from '../db/dataBase';

export function createRoom(wsId: number | string) {
  
  const foundedUser = dataBase.users.find((user) => user.index === wsId);
  
  if (foundedUser) {
    const {name, index} = foundedUser;
    dataBase.rooms.push({roomId: dataBase.rooms.length, roomUsers: [{name, index}]})
  } else {
    console.error('Custom Error: Something went wrong with founded user: ', foundedUser, ".", 
    ` wsId: ${wsId}.`, 
    " users in db: ", dataBase.users);
  }

}

export function updateRoom () { 
  return JSON.stringify({
    type: "update_room",
    data: JSON.stringify(dataBase.rooms),
    id: 0
  })
}