import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import library from 'jkanime-library';

@Controller('anime')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('latestAnimeAdded')
  async latestAnimeAdded(): Promise<any[] | null> {
    return await library.latestAnimeAdded();
  }

  @Get('getAnimeServers')
  async getAnimeServers(): Promise<any[] | null> {
    return await library.getAnimeServers('naruto-shippuden', 7);
  }
  @Get('hero')
  async hero(): Promise<any[] | null> {
    return await library.homeCarousel();
  }

  @Get('home')
  async home(): Promise<any> {
    const carousel = await library.homeCarousel();
    const latestAnime = await library.latestAnimeAdded();
    return { carousel, latestAnime };
  }

  @Get('search')
  async search(): Promise<any> {
    const carousel = await library.searchAnimesByName('nar');
    return carousel;
  }

  @Get('getAnimeDetails')
  async getAnimeDetails(@Query('name') slug: string): Promise<any> {
    const html = await library.getHtmlContent(slug);
    if (html != null) {
      const base = await library.getAnimeBaseInfo(html);
      const extra = await library.getExtraInfo(slug, html);
      return { base, extra };
    }
    return null;
  }

  @Get('searchAnime')
  async searchAnime(@Query('name') slug: string): Promise<any> {
    const base = await library.searchAnimesByName(slug);
    return base;
  }

  @Get('getEpisode')
  async getEpisode(@Query('name') slug: string, @Query('episode') ep: number): Promise<any> {
    const html = await library.getHtmlContent(`${slug}/${ep}`);
    if (html != null) {
      const servers = await library.getAnimeServersByHtml(html!);
      const episodeDetail = await library.getEpisodeDetail(html!);
      return { episodeDetail, servers };
    }
    return null;
  }
}
