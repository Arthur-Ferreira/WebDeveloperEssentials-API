import { Request } from "express"
import 'express-session';
import { ObjectId } from "mongodb";
import User from "../models/user.model";

declare module 'express-session' {
  interface Session {
    uid?: ObjectId | { $oid: string } | null // or whatever type you want, e.g. number if it's an ID
    isAdmin?: boolean;
  }
}

function createUserSession(req: Request, user: User, action?: () => void): void {
  req.session.uid = user._id
  req.session.isAdmin = user.isAdmin
  req.session.save(action)
}

function destroyUserAuthSession(req: Request): void {
  req.session.uid = null
  req.session.cookie = { originalMaxAge: req.session.cookie.originalMaxAge }
}

export default {
  createUserSession,
  destroyUserAuthSession
}
