import { Request } from "express"
import 'express-session';
import { IUser } from "../types";

declare module 'express-session' {
  interface Session {
    uid?: string | null; // or whatever type you want, e.g. number if it's an ID
    isAdmin?: boolean;
  }
}

function createUserSession(req: Request, user: IUser, action?: () => void): void {
  req.session.uid = user.id
  req.session.isAdmin = user.isAdmin
  req.session.save(action)
}

function destroyUserAuthSession(req: Request): void {
  req.session.uid = null
}

export default {
  createUserSession,
  destroyUserAuthSession
}
