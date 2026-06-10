export default defineEventHandler(async (event) => {
  try {
    const data = await $fetch('http://localhost:27799/api/status')
    return data
  } catch (err) {
    return {
      success: false,
      height: 997, // Fallback block height
      connections: 0
    }
  }
})
