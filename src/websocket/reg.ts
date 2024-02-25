import dataBase from '../db/dataBase.ts';

export type ResType = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string
}

export default function Registration(data: { name: string; password: string; }) {
  const { name, password } = data;

  const userId = dataBase.users.length;

  const res: ResType = {
    name,
    index: '',
    error: true,
    errorText: 'User is already exist'
  }

  const isFoundInDB = dataBase.users.find((item) => item.name === name);

  if (!isFoundInDB) {
    dataBase.users.push({name, password, userId})
    res.index = userId;
    res.error = false;
    res.errorText = '';
  } 

  return res;
}
