# PROJECT

Build a modern web application called **Bakkah Display**.

Tech Stack:

- HTML5
- Tailwind CSS v4
- Alpine.js
- Hono (Cloudflare Worker API)
- Drizzle ORM
- Cloudflare D1
- Cloudflare Pages
- Vanilla ES Modules (no Vue, React, Angular)
- Lucide Icons

The application must be optimized for Cloudflare Pages + Cloudflare Workers.

Use clean architecture, modular JavaScript, and reusable components.

Avoid jQuery.

Everything must be responsive.

Use dark mode by default.

Use modern glassmorphism with subtle shadows and rounded corners.

Use Inter font.

Use smooth transitions.

----------------------------------------------------
PROJECT STRUCTURE
----------------------------------------------------

Create two applications inside one project.

Dashboard
Display Player

Routes:

/

Dashboard

/display/:slug

Fullscreen Display

----------------------------------------------------
DASHBOARD FEATURES
----------------------------------------------------

# 1 Display Management

Create CRUD Display.

Fields:

- Name
- Slug
- Description

Example

Name

Lobby

Slug

lobby

Description

Main Lobby TV

Each display automatically generates a URL

/display/lobby

----------------------------------------------------

# 2 Slide Management

Manage slides for every display.

User first selects a Display.

Then manages its slides.

Each slide contains:

Title

Type

Duration (seconds)

Sort Order

Enabled

----------------------------------------------------

Supported Slide Types

1.

HTML Embed

Store raw HTML.

Will be rendered inside the display.

2.

Iframe Embed

Store iframe URL.

Render inside iframe fullscreen.

3.

Image

Upload or external URL.

Display fullscreen.

4.

Youtube Playlist

User inputs multiple YouTube URLs.

Example

https://youtu.be/xxxx

https://youtu.be/yyyy

https://youtu.be/zzzz

During playback:

Randomly choose one video.

Never always start with the same one.

When next time this slide appears,

pick another random video.

----------------------------------------------------

Slide Settings

Duration

(seconds)

Transition

Fade

(optional)

Enable

True / False

----------------------------------------------------

Dashboard UI

Left Sidebar

Dashboard

Displays

Slides

Settings

Top Navbar

Project Name

Bakkah Display

Display selector

User Menu

Main Content

Modern data tables

Search

Pagination

Dialogs

Drawers

Cards

Statistics

----------------------------------------------------

Display List

Modern table

Columns

Name

Slug

Description

Slides Count

Actions

----------------------------------------------------

Slide List

Modern table

Columns

Order

Title

Type

Duration

Enabled

Actions

Support

Drag and Drop Sorting

----------------------------------------------------

DISPLAY PLAYER

Route

/display/:slug

This page is fullscreen.

No scrolling.

No browser UI.

Designed for Smart TV.

----------------------------------------------------

LAYOUT

Vertical Layout

Header

5%

Content

90%

Footer

5%

----------------------------------------------------

HEADER

Glass effect

Left

Company Logo

Right

Live Clock

HH:mm:ss

Date

Friday

17 July 2026

Clock updates every second.

----------------------------------------------------

CONTENT

Render current slide.

Supported renderers:

HTML

Iframe

Image

Youtube

Everything centered.

Fade transition between slides.

----------------------------------------------------

FOOTER

Glass effect

Left

Prayer Times

Subuh

Dzuhur

Ashar

Maghrib

Isya

Display horizontally.

Data initially can be mocked.

Later easily replaceable by API.

Right

Countdown

Next slide in

18

17

16

...

Automatically updates every second.

----------------------------------------------------

SLIDE ENGINE

When display starts

Load all enabled slides

Sort by order

Loop forever

For each slide

Render

Start countdown

When duration reaches zero

Move to next slide

Loop forever

----------------------------------------------------

YOUTUBE ENGINE

Store multiple YouTube URLs.

Example

[
url1,
url2,
url3
]

Every time this slide appears

Randomly choose one URL.

Embed it.

If video finishes before duration,

keep showing until duration ends.

If duration finishes first,

move immediately to next slide.

----------------------------------------------------

HTML SLIDE

Render stored HTML safely.

Use dedicated container.

Support custom CSS inside HTML.

----------------------------------------------------

IFRAME SLIDE

Render iframe fullscreen.

----------------------------------------------------

IMAGE SLIDE

Contain image.

Maintain aspect ratio.

Center image.

----------------------------------------------------

BACKEND

Use Hono.

REST API.

Examples

GET /api/displays

POST /api/displays

PUT /api/displays/:id

DELETE /api/displays/:id

GET /api/slides

POST /api/slides

PUT /api/slides/:id

DELETE /api/slides/:id

----------------------------------------------------

DATABASE

Use Drizzle ORM.

Cloudflare D1.

Create migrations.

Tables

Displays

Slides

YoutubeVideos

Fields should be normalized.

----------------------------------------------------

UI STYLE

Modern SaaS Dashboard.

Rounded XL cards.

Subtle borders.

Dark theme.

Blue primary color.

Minimal.

Clean spacing.

Glass panels.

Soft hover effects.

Large typography.

Use Lucide icons.

----------------------------------------------------

CODE STYLE

Use modular architecture.

Separate files.

Avoid giant files.

Organize into:

components

pages

modules

services

api

utils

store

player

Use reusable functions.

No duplicated code.

----------------------------------------------------

FINAL GOAL

Generate a production-ready Cloudflare Pages project named **Bakkah Display** with:

- Dashboard
- Display Player
- CRUD Displays
- CRUD Slides
- Drag-and-drop slide ordering
- Multiple slide types (HTML, iframe, image, YouTube random playlist)
- Fullscreen TV display
- Modern Tailwind UI
- Alpine.js frontend
- Hono API
- Drizzle ORM
- Cloudflare D1
- Clean architecture
- Well-documented code
- Ready for future expansion (additional widget/slide types)
