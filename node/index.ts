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

//Clients 
const TIMEOUT_MS = 800
const memoryCache = new LRUCache<string, any>({ max: 5_000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: { retries: 2, timeout: TIMEOUT_MS, memoryCache },
  },
}

//Service
export default new Service<Clients, RecorderState, ParamsContext>({
  clients,

  routes: {
    fortune: method({
      GET: async (
        ctx: ServiceContext<Clients, RecorderState, ParamsContext>
      ) => {
        ctx.body = await ctx.clients.cookieFortune.listFortunes()
        ctx.status = 200
      },

      POST: async (
        ctx: ServiceContext<Clients, RecorderState, ParamsContext>
      ) => {
        const { CookieFortune } = (ctx.request as any).body as {
          CookieFortune: string
        }

        const id = await ctx.clients.cookieFortune.createFortune({
          CookieFortune,
        })

        ctx.status = 201
        ctx.body = { id }
      },
    }),

    deleteFortune: method({
      DELETE: async (
        ctx: ServiceContext<Clients, RecorderState, ParamsContext>
      ) => {
        let { id } = ctx.vtex.route.params as { id: string | string[] }
        if (Array.isArray(id)) id = id[0]

        await ctx.clients.cookieFortune.deleteFortune(id)
        ctx.status = 204
      },
    }),
  },
})
