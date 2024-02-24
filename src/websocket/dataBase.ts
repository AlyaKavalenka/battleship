type UserType = {
  name: string;
  password: string;
  userId: number;
}

interface DataBase {
  users: UserType[];
};

const dataBase: DataBase = {
  users: []
};

export default dataBase;
