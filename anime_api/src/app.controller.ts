import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import library from 'jkanime-library';

@Controller('anime')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return await library.getAnimeServers('city-the-animation', 9);
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

  @Get('anime-info')
  async animeInfo(): Promise<any> {
    const base = await library.getAnimeBaseInfo('naruto-shippuden');
    const extra = await library.getExtraInfo('naruto-shippuden');
    return { base, extra };
  }
}
