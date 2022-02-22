import { UserClient } from "./model";
interface State {
  clients: UserClient[];
}
export const state: State = {
  clients: [],
};

export const addUser = (user: UserClient) => state.clients.push(user);
export const removeUser = (userId: string) => {
  state.clients = state.clients.filter((client) => client.id !== userId);
};
export const fetchAllUserIds = () => state.clients.map((client) => client.id);
