import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

const PATH = '/api/dataentities/CF/search?_fields=CookieFortune&_size=50'

export default class CookieFortuneClient extends ExternalClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(`https://${ctx.account}.myvtex.com`, ctx, { ...opts, timeout: 800 })
  }

  public async listFortunes() {
    return this.http.get(PATH, {
      headers: {
        'x-vtex-api-appKey':   process.env.REACT_APP_VTEX_APP_KEY!,
        'x-vtex-api-appToken': process.env.REACT_APP_VTEX_APP_TOKEN!,
      },
    })
  }
}
