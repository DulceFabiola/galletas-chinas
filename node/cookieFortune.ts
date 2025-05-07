import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

const BASE   = '/api/dataentities/CF'
const FIELDS = '_fields=CookieFortune&_schema=fortune'

export default class CookieFortuneClient extends ExternalClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(`https://${ctx.account}.myvtex.com`, ctx, opts)
  }

  public listFortunes() {
    return this.http.get(`${BASE}/search?${FIELDS}`, this.commonHeaders)
  }

  public createFortune(body: { CookieFortune: string }) {
    return this.http.put(`${BASE}/documents`, body, this.commonHeaders)
  }

  public deleteFortune(documentId: string) {
    return this.http.delete(`${BASE}/documents/${documentId}`, this.commonHeaders)
  }

  private get commonHeaders() {
    return {
      headers: {
        'x-vtex-api-appKey':   process.env.REACT_APP_VTEX_APP_KEY!,
        'x-vtex-api-appToken': process.env.REACT_APP_VTEX_APP_TOKEN!,
        'Content-Type': 'application/json',
      },
    }
  }
}
