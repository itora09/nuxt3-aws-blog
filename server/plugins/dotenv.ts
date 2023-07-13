import dotenv from 'dotenv'

export default defineNitroPlugin(() => {
  dotenv.config()
})
