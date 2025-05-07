import {
  Service,
  ServiceContext,
  ClientsConfig,
  LRUCache,
  method,
  RecorderState,
  ParamsContext,
} from '@vtex/api'
import { Clients } from './clients'

type State = RecorderState           

/* ---------- Clients ---------- */
const memoryCache = new LRUCache<string, any>({ max: 5_000 })
const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: { retries: 2, timeout: TIMEOUT_MS, memoryCache },
  },
}

/* ---------- Service ---------- */
export default new Service<Clients, State, ParamsContext>({
  clients,

  routes: {
    fortune: method({
      GET: async (ctx: ServiceContext<Clients, State, ParamsContext>) => {
        const data = await ctx.clients.cookieFortune.listFortunes()
        ctx.status = 200
        ctx.body   = data
      },
    }),
  },
})
