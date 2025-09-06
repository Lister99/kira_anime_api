import cheerio from 'cheerio'
import _ from 'lodash'

import { makeRequest } from './MakeRequest'
import { config } from './config'

// interface Anime {
//   slug: StringOrNull
//   title: StringOrNull
//   synopsis: StringOrNull
//   episodes: NumberOrNull
//   image: StringOrNull
//   type: StringOrNull
//   status: StringOrNull
// }

export interface Anime {
  title: string
  link: string
  image: string
  episode?: string
  date?: string
  type?: string
}

export interface AnimeGroup {
  category: string // Ej: "Animes", "Donghuas", "Ovas & Especiales"
  items: Anime[]
}

// type ReturnType = Promise<Anime[] | null>

// async function parseAnimeElement(element: cheerio.Element): Promise<Anime> {
//   const $ = cheerio.load(element)

//   const title = $('.anime__item .anime__item__text h5 a').text().trim() ?? null
//   const slug = _.split($('.anime__item a:nth(0)').attr('href'), '/').filter(Boolean).pop() ?? null
//   const image = $('.anime__item .anime__item__pic').attr('data-setbg') ?? null
//   const synopsis = null
//   const episodes = null
//   const type = $('.anime__item__text ul li.anime').text().trim() ?? null
//   const status = $('.anime__item__text ul li').first().text().trim() ?? null

//   return {
//     slug,
//     title,
//     synopsis,
//     episodes,
//     image,
//     type,
//     status,
//   }
// }

// async function latestAnimeAdded(): ReturnType {
//   const requestOpts: Record<string, any> = {
//     path: config.baseURL,
//     responseType: 'text',
//   }
//   const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
//   if (!response)
//     return null

//   const $ = cheerio.load(response)

//   const animeElements = $('div.trending__anime div:nth-child(1)').toArray()

//   const animeData = _.chain(animeElements)
//     .filter((_, index) => index % 2 !== 0)
//     .map(parseAnimeElement)
//     .thru(promises => Promise.all(promises))
//     .value()
//     .then(response => _.filter(response, (anime: Anime) => anime.slug !== null))

//   return animeData
// }

async function latestAnimeAdded(): Promise<AnimeGroup[] | null> {
  const requestOpts: Record<string, any> = {
    path: config.baseURL,
    responseType: 'text',
  }
  const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
  if (!response)
    return null

  const $ = cheerio.load(response)
  const groups: AnimeGroup[] = []

  $('.tab-pane').each((_, tab) => {
    const tabPane = $(tab)

    const id = tabPane.attr('id') ?? ''

    const tabTitle = $(`a[href="#${id}"]`).text().trim() || id

    const items: Anime[] = []

    tabPane.find('.dir1 .card').each((_, element) => {
      const card = $(element)

      const link = card.find('a').attr('href') ?? ''
      const image = card.find('img.card-img-top').attr('src') ?? ''
      const title = card.find('h5.card-title').text().trim()

      const episode
        = card.find('.badge.badge-primary').first().text().trim() || undefined

      const date
        = card.find('.badge.badge-secondary').first().text().trim() || undefined

      const type
        = card
          .find('.badges .badge')
          .not('.badge-secondary')
          .not('.badge-primary')
          .first()
          .text()
          .trim() || undefined

      items.push({ title, link, image, episode, date, type })
    })

    groups.push({
      category: tabTitle,
      items,
    })
  })

  return groups
}

export default latestAnimeAdded
