import { sanitizeUpstreamStatus, FALLBACK_BLOCKCHAIN_STATUS } from '../utils/statusSecurity'

const UPSTREAM_STATUS_URL = 'http://127.0.0.1:27799/api/status'
const UPSTREAM_TIMEOUT_MS = 2500

export default defineEventHandler(async (event) => {
  if (event.method && event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  setResponseHeader(event, 'Cache-Control', 'public, max-age=3, s-maxage=3')

  try {
    const data = await $fetch(UPSTREAM_STATUS_URL, {
      timeout: UPSTREAM_TIMEOUT_MS,
      retry: 0
    })
    return sanitizeUpstreamStatus(data)
  } catch {
    return sanitizeUpstreamStatus(FALLBACK_BLOCKCHAIN_STATUS)
  }
})
