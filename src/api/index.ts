import { Hono } from 'hono'
import { cors } from 'hono/cors'
import displays from './displays'
import slides from './slides'

const app = new Hono<{ Bindings: { D1_BACKEND: D1Database } }>()

app.use('*', cors())

app.route('/api/displays', displays)
app.route('/api/slides', slides)

app.get('/api/display/:slug', async (c) => {
  const db = (await import('../db/client')).createDb(c.env.D1_BACKEND)
  const { eq, and } = await import('drizzle-orm')
  const { displays: displaysTbl, slides: slidesTbl, youtubeVideos } = await import('../db/schema')
  const slug = c.req.param('slug')
  const display = await db
    .select()
    .from(displaysTbl)
    .where(eq(displaysTbl.slug, slug))
    .get()
  if (!display) return c.json({ error: 'Display not found' }, 404)
  const slideList = await db
    .select()
    .from(slidesTbl)
    .where(and(eq(slidesTbl.displayId, display.id), eq(slidesTbl.enabled, true)))
    .orderBy(slidesTbl.sortOrder)
    .all()
  const result = await Promise.all(
    slideList.map(async (s) => {
      if (s.type === 'youtube') {
        const videos = await db
          .select()
          .from(youtubeVideos)
          .where(eq(youtubeVideos.slideId, s.id))
          .orderBy(youtubeVideos.sortOrder)
          .all()
        return { ...s, youtubeVideos: videos }
      }
      return s
    })
  )
  return c.json({ display, slides: result })
})

export default app
