type UserType = {
  name: string;
  password?: string;
  index: number | string;
}

interface DataBase {
  users: UserType[];
  rooms: {roomId: number | string; roomUsers: UserType[]}[];
};

const dataBase: DataBase = {
  users: [],
  rooms: []
};

export default dataBase;
