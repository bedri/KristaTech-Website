import { SECURITY_HEADERS, isAllowedFetchSite } from '../utils/statusSecurity'

export default defineEventHandler((event) => {
  for (const [headerName, headerValue] of Object.entries(SECURITY_HEADERS)) {
    setResponseHeader(event, headerName, headerValue)
  }

  const path = event.path || ''
  if (path.startsWith('/api/')) {
    setResponseHeader(event, 'Vary', 'Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site')

    const secFetchSite = getRequestHeader(event, 'sec-fetch-site')
    const secFetchMode = getRequestHeader(event, 'sec-fetch-mode')
    const secFetchDest = getRequestHeader(event, 'sec-fetch-dest')
    const method = event.method || 'GET'

    if (!isAllowedFetchSite(secFetchSite, method, secFetchMode, secFetchDest)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Cross-site request blocked by Fetch Metadata policy'
      })
    }
  }
})
