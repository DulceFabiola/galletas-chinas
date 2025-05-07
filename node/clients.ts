import { IOClients } from '@vtex/api'
import CookieFortuneClient from './cookieFortune'

export class Clients extends IOClients {

  public get cookieFortune() {
    return this.getOrSet('cookieFortune', CookieFortuneClient)
  }
}
