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
  turn?: number | string;
  killsCount?: number;
};

type WinType = {
  winPlayer: number | string;
  name: string;
  wins: number;
};

interface DataBase {
  users: UserType[];
  rooms: {
    roomId: number | string;
    roomUsers: UserType[];
    isAvailable: boolean;
  }[];
  games: GameType[];
  wins: WinType[];
}

const dataBase: DataBase = {
  users: [],
  rooms: [],
  games: [],
  wins: [],
};

export default dataBase;
