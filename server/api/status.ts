export default defineEventHandler(async (event) => {
  try {
    const data = await $fetch('http://127.0.0.1:27799/api/status')
    return data
  } catch (err) {
    return {
      success: false,
      height: 997, // Fallback block height
      connections: 0
    }
  }
})
