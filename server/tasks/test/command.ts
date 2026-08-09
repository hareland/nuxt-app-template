import { createLogger } from '#shared/utils'

export default defineTask({
  meta: {
    name: 'test:command',
  },
  run({ name }) {
    const logger = createLogger(name!)

    logger.info('Hello from the test command')

    return { result: 'success' }
  },
})
