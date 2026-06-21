/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import logger from '../lib/logger'
import * as utils from '../lib/utils'

// Fetches a remote resource (e.g. an Open Graph preview / favicon) for a URL the
// user pastes when sharing a product link. The fetched content is returned to the
// caller so the frontend can render a link preview.
export function fetchUrlMetadata () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const target = req.query.url as string
    if (!target) {
      res.status(400).json({ error: 'Missing url parameter' })
      return
    }
    try {
      const response = await fetch(target)
      const contentType = response.headers.get('content-type') ?? 'text/plain'
      const body = await response.text()
      res.status(response.status).json({
        url: target,
        status: response.status,
        contentType,
        body
      })
    } catch (error) {
      logger.warn(`Could not fetch URL metadata for ${target}: ${utils.getErrorMessage(error)}`)
      next(error)
    }
  }
}
