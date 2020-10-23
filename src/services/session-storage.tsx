import { ISession } from './interfaces';

export class SessionStorage implements ISession {
  set = async (key: string, value: string): Promise<void> => {
    return await localStorage.setItem(key, value);
  };
  get = async (key: string): Promise<string> => {
    const value = await localStorage.getItem(key);
    return value || '';
  };
  remove = async (key: string): Promise<any> => {
    await localStorage.removeItem(key);
  };
}
