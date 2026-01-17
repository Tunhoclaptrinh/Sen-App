import { apiClient } from '../config/api.client';
import { ENDPOINTS } from '../config/api.config';
import { GameProgress, Chapter, Level } from '../types/game.types';
import { BaseApiResponse } from '../types/api.types';

export const GameService = {
  getProgress: async () => {
    return apiClient.get<BaseApiResponse<GameProgress>>(ENDPOINTS.GAME.PROGRESS);
  },

  getChapters: async () => {
    // Assuming endpoint exists or mocking it for now as it wasn't explicit in api.config.ts
    // If not in api.config, I might need to add it or use a default path
    return apiClient.get<BaseApiResponse<Chapter[]>>("/game/chapters"); 
  },

  submitAnswer: async (levelId: number | string, answer: any) => {
    return apiClient.post<BaseApiResponse<{correct: boolean, pointsEarned: number}>>(`/game/levels/${levelId}/submit`, { answer });
  }
};
