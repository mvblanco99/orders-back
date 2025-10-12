import { hash as hashSync, verify as compareSync } from 'argon2';

const encryptData = async (data: string): Promise<string> => {
  return await hashSync(data);
};

const compareData = async (data: string, hash: string): Promise<boolean> => {
  return await compareSync(hash, data);
};

export { encryptData, compareData };
