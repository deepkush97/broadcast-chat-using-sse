import { Response } from "express";
export interface Message {
  id: string;
  clientId: string;
  message: string;
}

export interface UserClient {
  id: string;
  response: Response<any, Record<string, any>>;
}
