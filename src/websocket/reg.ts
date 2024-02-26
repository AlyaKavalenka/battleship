import dataBase from '../db/dataBase.ts';

export type ResType = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string;
};

export default function Registration(
  data: { name: string; password: string },
  wsId: number | string
) {
  const { name, password } = data;

  const res: ResType = {
    name,
    index: '',
    error: true,
    errorText: 'User is already exist',
  };

  const isFoundInDB = dataBase.users.findIndex(
    (user) => user.index === wsId || user.name === name
  );

  if (isFoundInDB === -1) {
    dataBase.users.push({ name, password, index: wsId });
    res.index = wsId;
    res.error = false;
    res.errorText = '';
  }

  return res;
}
