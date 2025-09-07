import _ from 'lodash'
import cheerio from 'cheerio'
import { makeRequest } from './MakeRequest'
import { config } from './config'

export interface AnimeSearchItem {
  id: string;
  title: string;
  url: string;
  image: string;
  estado: string;
  tipo: string;
}

type SearchReturnType = Promise<AnimeSearchItem [] | null>

// export async function search(q: string): SearchReturnType {
//   const requestOpts: Record<string, any> = {
//     path: `${config.baseURL}ajax/ajax_search/?${ToolKit.buildQuery({ q })}`,
//     responseType: 'json',
//   }

//   const response: SearchReturnType = await makeRequest(requestOpts.path, requestOpts.responseType, { method: 'get' })

//   // skip rest of the steps
//   if (!response)
//     return null

//   return response
// }

async function searchAnimesByName(query: string):  SearchReturnType {
  const requestOpts = {
    path: `${config.baseURL}buscar/${query}`,
    responseType: 'text',
  }
  const response = await makeRequest(requestOpts.path, requestOpts.responseType as never, { method: 'get' })
  if (!response)
    return null
  const $ = cheerio.load(response)
  const results: AnimeSearchItem[] = []

  $("div.col-lg-2.col-md-6.col-sm-6").each((_, el) => {
    const container = $(el);

    const id = container.attr("data-g") ?? "";
    const img = container.find(".anime__item__pic").attr("data-setbg") ?? "";
    const titleTag = container.find("h5 a");
    const title = titleTag.text().trim();
    const url = titleTag.attr("href") ?? "";
    const estado = container.find(".anime__item__text ul li").first().text().trim();
    const tipo = container.find(".anime__item__text ul li.anime").text().trim();

    results.push({
      id,
      title,
      url,
      image: img,
      estado,
      tipo
    });
  });

  return results;
}

export default searchAnimesByName