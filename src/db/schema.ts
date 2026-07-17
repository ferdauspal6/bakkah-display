import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const displays = sqliteTable('displays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const slides = sqliteTable('slides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  displayId: integer('display_id').notNull().references(() => displays.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type', { enum: ['html', 'iframe', 'image', 'youtube'] }).notNull(),
  content: text('content'),
  duration: integer('duration').notNull().default(10),
  sortOrder: integer('sort_order').notNull().default(0),
  transition: text('transition').notNull().default('fade'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const youtubeVideos = sqliteTable('youtube_videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slideId: integer('slide_id').notNull().references(() => slides.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})
