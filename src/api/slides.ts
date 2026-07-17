import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { createDb } from '../db/client'
import { slides, youtubeVideos } from '../db/schema'

const app = new Hono<{ Bindings: { D1_BACKEND: D1Database } }>()

app.get('/', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const displayId = c.req.query('displayId')
  const query = db.select().from(slides).orderBy(slides.sortOrder)
  const all = displayId
    ? await query.where(eq(slides.displayId, Number(displayId))).all()
    : await query.all()
  const result = await Promise.all(
    all.map(async (s) => {
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
  return c.json(result)
})

app.get('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  const result = await db.select().from(slides).where(eq(slides.id, id)).get()
  if (!result) return c.json({ error: 'Not found' }, 404)
  if (result.type === 'youtube') {
    const videos = await db
      .select()
      .from(youtubeVideos)
      .where(eq(youtubeVideos.slideId, result.id))
      .orderBy(youtubeVideos.sortOrder)
      .all()
    return c.json({ ...result, youtubeVideos: videos })
  }
  return c.json(result)
})

app.post('/', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const body = await c.req.json()
  const { youtubeVideos: videos, ...slideData } = body
  const result = await db.insert(slides).values({
    displayId: slideData.displayId,
    title: slideData.title,
    type: slideData.type,
    content: slideData.content || '',
    duration: slideData.duration ?? 10,
    sortOrder: slideData.sortOrder ?? 0,
    transition: slideData.transition ?? 'fade',
    enabled: slideData.enabled ?? true,
  }).returning().get()
  if (result.type === 'youtube' && videos?.length) {
    await db.insert(youtubeVideos).values(
      videos.map((v: { url: string }, i: number) => ({
        slideId: result.id,
        url: v.url,
        sortOrder: i,
      }))
    ).run()
  }
  return c.json(result, 201)
})

app.put('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const { youtubeVideos: videos, ...slideData } = body
  const result = await db.update(slides)
    .set({
      displayId: slideData.displayId,
      title: slideData.title,
      type: slideData.type,
      content: slideData.content,
      duration: slideData.duration,
      sortOrder: slideData.sortOrder,
      transition: slideData.transition,
      enabled: slideData.enabled,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(slides.id, id))
    .returning().get()
  if (!result) return c.json({ error: 'Not found' }, 404)
  if (result.type === 'youtube') {
    await db.delete(youtubeVideos).where(eq(youtubeVideos.slideId, id)).run()
    if (videos?.length) {
      await db.insert(youtubeVideos).values(
        videos.map((v: { url: string }, i: number) => ({
          slideId: id,
          url: v.url,
          sortOrder: i,
        }))
      ).run()
    }
  }
  return c.json(result)
})

app.put('/:id/order', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  await db.update(slides)
    .set({ sortOrder: body.sortOrder, updatedAt: new Date().toISOString() })
    .where(eq(slides.id, id))
    .run()
  return c.json({ success: true })
})

app.delete('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  await db.delete(youtubeVideos).where(eq(youtubeVideos.slideId, id)).run()
  await db.delete(slides).where(eq(slides.id, id)).run()
  return c.json({ success: true })
})

export default app
