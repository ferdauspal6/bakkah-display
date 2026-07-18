export async function onRequest(context) {
  const { request, params } = context
  const slug = params.slug
  if (!slug) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/player' },
    })
  }

  const url = new URL(request.url)
  const assetUrl = new URL('/player', url.origin)
  const assetReq = new Request(assetUrl, request)
  const response = await fetch(assetReq)
  return response
}
