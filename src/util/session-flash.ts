import { Request } from "express"

import 'express-session';

declare module 'express-session' {
  interface Session {
    flashedData: any
  }
}

function getSessionData(req: Request): any {
  const sessionData = req.session.flashedData

  req.session.flashedData = null

  return sessionData
}

function flashDataToSession(req: Request, data: any, action?: () => void): void {
  req.session.flashedData = data
  req.session.save(action)
}

export default {
  getSessionData,
  flashDataToSession
}
