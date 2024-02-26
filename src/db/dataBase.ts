type UserType = {
  name: string;
  password?: string;
  index: number | string;
};

export type GameType = {
  gameId: number | string;
  ships: {
    position: {
      x: number;
      y: number;
    };
    direction: boolean;
    length: number;
    type: 'small' | 'medium' | 'large' | 'huge';
  }[];
  indexPlayer: number | string;
  matrix?: number[][];
};

interface DataBase {
  users: UserType[];
  rooms: {
    roomId: number | string;
    roomUsers: UserType[];
    isAvailable: boolean;
  }[];
  games: GameType[];
}

const dataBase: DataBase = {
  users: [],
  rooms: [],
  games: [],
};

export default dataBase;
