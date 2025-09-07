export interface OtherEpisode {
    previous?: string;
    next?: string;
}

export interface AnimeInfo {
    title: string;
    image: string;
    link: string;
    description: string;
    totalEpisodes: number;
}

export interface SimilarAnime {
    title: string;
    image: string;
    url: string;
    status: string;
    category: string;
    releaseDate: string;
}

export interface AnimePage {
    title: string,
    otherEpisode?: OtherEpisode | null;
    animeInfo: AnimeInfo;
    similarAnimes?: SimilarAnime[];
}


import * as cheerio from "cheerio";

export default function getEpisodeDetails(html: string): AnimePage {
    const $ = cheerio.load(html);

    const title = $(".mb-2 h1.mb-2").text().trim();
    // 1. Episodios
    let otherEpisode: OtherEpisode | null = null;
    const episodeContent = $(".ep_bar .anime_slug div.d-flex");

    episodeContent.find("a").each((_, el) => {
        const link = $(el);
        const text = link.text().trim().toLowerCase();
        if (text.includes("anterior") || text.includes("siguiente")) {
            otherEpisode = {}
            if (text.includes("anterior")) {
                otherEpisode.previous = link.attr("href") || undefined;
            } else if (text.includes("siguiente")) {
                otherEpisode.next = link.attr("href") || undefined;
            }
        }

    });

    // 2. Información del anime
    const videoInfo = $(".video-info")
    const animeInfo: AnimeInfo = {
        title: videoInfo.find(".video_i a").first().text().trim(),
        image: videoInfo.find(".video_t img").first().attr("src") || "",
        link: videoInfo.find(".video_t a").first().attr('href') || "",
        description: videoInfo.find(".video_i p").first().text().trim(),
        totalEpisodes: parseInt(videoInfo.find(".video_i span").first().text().trim(), 10) || 0,
    };

    // 3. Animes similares
    const similarAnimes: SimilarAnime[] = [];
    $(".rec_bar .row .d-flex").each((_, el) => {
        const title = $(el).find(".card-title a").text().trim();
        const image = $(el).find("img").attr("src") || "";
        const url = $(el).find(".card-title a").attr("href") || "";
        const status = $(el).find(".card-info .badge").first().text().trim();
        const category = $(el).find(".card-info .badge").last().text().trim();
        const releaseDate = $(el).find(".card-text.ep").text().trim();
        if (title) similarAnimes.push({ title, image, url, status, category, releaseDate });
    });

    return {
        title,
        otherEpisode,
        animeInfo,
        similarAnimes,
    };
}
