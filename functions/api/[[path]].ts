import { handle } from 'hono/cloudflare-pages'
import app from '../../src/api/index'

export const onRequest = handle(app)
