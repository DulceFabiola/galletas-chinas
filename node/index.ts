import {
  Service,
  ServiceContext,
  ClientsConfig,
  LRUCache,
  method,
  RecorderState,  
} from '@vtex/api'

import { Clients } from './clients'

type RouteParams = { id?: string }

const TIMEOUT_MS = 800
const memoryCache = new LRUCache<string, any>({ max: 5_000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: { default: { retries: 2, timeout: TIMEOUT_MS, memoryCache } },
}

//Service 
export default new Service<Clients, RecorderState, RouteParams>({
  clients,

  routes: {
    fortune: method({
      GET: async (ctx: ServiceContext<Clients, RecorderState, RouteParams>) => {
        ctx.body   = await ctx.clients.cookieFortune.listFortunes()
        ctx.status = 200
      },

      POST: async (ctx) => {
        const { CookieFortune } = ctx.request.body as { CookieFortune: string }
        const id = await ctx.clients.cookieFortune.createFortune({ CookieFortune })
        ctx.status = 201
        ctx.body   = { id }
      },
    }),

    deleteFortune: method({
      DELETE: async (ctx) => {
        const { id } = ctx.vtex.route.params
        if (!id) {
          ctx.status = 400
          ctx.body   = 'Missing id'
          return
        }
        await ctx.clients.cookieFortune.deleteFortune(id)
        ctx.status = 204
      },
    }),
  },
})
