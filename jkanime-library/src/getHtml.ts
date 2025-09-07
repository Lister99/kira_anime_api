import cheerio from 'cheerio'
import _ from 'lodash'

import { makeRequest } from './MakeRequest'
import { config } from './config'

async function getHtmlContent(path: String | null): Promise<string | null> {
    const requestOpts: Record<string, any> = {
        path: path == null ? config.baseURL : `${config.baseURL}${path}`,
        responseType: 'text',
    }
    const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
    if (!response)
        return null
    return response
}

export default getHtmlContent