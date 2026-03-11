import { promises as fs } from "fs";
import path from "path";

export type StoredUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type AuthEvent = StoredUser & {
  at: string;
};

type DataFile = {
  users: StoredUser[];
  signups: AuthEvent[];
  logins: AuthEvent[];
};

const dataPath = path.join(process.cwd(), "data.json");

const emptyData: DataFile = { users: [], signups: [], logins: [] };

const readData = async (): Promise<DataFile> => {
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(raw) as DataFile;
  } catch {
    await fs.writeFile(dataPath, JSON.stringify(emptyData, null, 2));
    return { ...emptyData };
  }
};

const writeData = async (data: DataFile) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

export const recordAuthEvent = async (user: StoredUser) => {
  const data = await readData();
  const existing = data.users.find((item) => item.sub === user.sub);
  const event: AuthEvent = { ...user, at: new Date().toISOString() };

  if (existing) {
    data.logins.push(event);
  } else {
    data.users.push(user);
    data.signups.push(event);
  }

  await writeData(data);
};
