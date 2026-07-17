import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { createDb } from '../db/client'
import { displays, slides } from '../db/schema'

const app = new Hono<{ Bindings: { D1_BACKEND: D1Database } }>()

app.get('/', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const all = await db.select().from(displays).all()
  const result = await Promise.all(
    all.map(async (d) => {
      const count = await db
        .select({ count: slides.id })
        .from(slides)
        .where(eq(slides.displayId, d.id))
        .all()
      return { ...d, slidesCount: count.length }
    })
  )
  return c.json(result)
})

app.get('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  const result = await db.select().from(displays).where(eq(displays.id, id)).get()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

app.post('/', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const body = await c.req.json()
  const result = await db.insert(displays).values({
    name: body.name,
    slug: body.slug,
    description: body.description || '',
  }).returning().get()
  return c.json(result, 201)
})

app.put('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const result = await db.update(displays)
    .set({
      name: body.name,
      slug: body.slug,
      description: body.description,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(displays.id, id))
    .returning().get()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

app.delete('/:id', async (c) => {
  const db = createDb(c.env.D1_BACKEND)
  const id = Number(c.req.param('id'))
  await db.delete(displays).where(eq(displays.id, id)).run()
  return c.json({ success: true })
})

export default app
