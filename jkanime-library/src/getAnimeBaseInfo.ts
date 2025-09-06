import cheerio from 'cheerio'
import { makeRequest } from './MakeRequest'
import { config } from './config'

export interface AnimeBaseInfo {
  id: string
  title: string
  image: string
  description: string
  likes: number
  status: string
  stats: {
    watching: number
    watched: number
    toWatch: number
  }
}

async function getBaseAnimeInfo(animeSlug: string): Promise<AnimeBaseInfo | null> {
  const requestOpts = {
    path: `${config.baseURL}${animeSlug}`,
    responseType: 'text',
  }
  const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
  if (!response)
    return null

  const $ = cheerio.load(response)
  const block = $('.anime_info')

  const id = block.find('.guardar_anime').attr('data-anime') ?? ''
  const title = block.find('h3').text().trim()
  const image = block.find('.movpic img').attr('src') ?? ''
  const description = block.find('.scroll').text().trim()
  const likes = Number.parseInt(block.find('.votar .vot').text().trim(), 10) || 0
  const status = block.find('.guardar_anime .dropmenu').attr('data-status') ?? ''

  const watching = Number.parseInt(block.find('.stats [data-stat="tag1"] b').text(), 10) || 0
  const watched = Number.parseInt(block.find('.stats [data-stat="tag2"] b').text(), 10) || 0
  const toWatch = Number.parseInt(block.find('.stats [data-stat="tag3"] b').text(), 10) || 0

  return {
    id,
    title,
    image,
    description,
    likes,
    status,
    stats: {
      watching,
      watched,
      toWatch,
    },
  }
}

export default getBaseAnimeInfo
