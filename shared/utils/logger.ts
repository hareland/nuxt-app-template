import { consola } from 'consola'
import { name } from '../../package.json' with { type: 'json' }

export const logger = consola.withTag(name)

export const createLogger = (scope: string) => logger.withTag(scope)
