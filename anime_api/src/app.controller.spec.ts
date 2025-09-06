import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import latestAnimeAdded from 'jkanime-library';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getLatestAnime', () => {
    it('should return a list of animes', async () => {
      // Simula el resultado de la función
      (latestAnimeAdded.latestAnimeAdded as jest.Mock).mockResolvedValue([
        { title: 'Anime 1' },
        { title: 'Anime 2' },
      ]);
      const result = await appController.getLatestAnime();
      expect(result).toEqual([{ title: 'Anime 1' }, { title: 'Anime 2' }]);
    });

    it('should return null if no animes found', async () => {
      (latestAnimeAdded.latestAnimeAdded as jest.Mock).mockResolvedValue(null);
      const result = await appController.getLatestAnime();
      expect(result).toBeNull();
    });
  });
});
