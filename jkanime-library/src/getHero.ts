import cheerio from 'cheerio'
import _ from 'lodash'
import { makeRequest } from './MakeRequest'
import { config } from './config'

export interface HeroAnime {
  title: string
  description: string
  image: string
  category: string
  status: string
  detailsUrl: string
  watchUrl: string
}
async function homeCarousel(): Promise<HeroAnime[] | null> {
  const requestOpts: Record<string, any> = {
    path: config.baseURL,
    responseType: 'text',
  }
  const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
  if (!response)
    return null

  const $ = cheerio.load(response)
  const animes: HeroAnime[] = []
  $('section.hero .hero__slider .hero__items').each((_, element) => {
    const el = $(element)

    const title = el.find('h2').text().trim()
    const description = el.find('p').text().trim()

    const category = el.find('.ainfo span').eq(0).text().trim()
    const status = el.find('.ainfo span').eq(1).text().trim()

    // Imagen viene en data-setbg
    const image = el.attr('data-setbg') ?? ''

    // Botones de acción
    const detailsUrl = el.find('.slider-btns a').eq(0).attr('href') ?? ''
    const watchUrl = el.find('.slider-btns a').eq(1).attr('href') ?? ''

    animes.push({
      title,
      description,
      image,
      category,
      status,
      detailsUrl,
      watchUrl,
    })
  })

  return animes
}

export default homeCarousel
