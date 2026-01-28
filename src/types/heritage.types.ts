import { BaseEntity } from './index';

export interface HeritageSite extends BaseEntity {
  name: string;
  type: string;
  description: string;
  location: string;
  address?: string;
  category: string;
  image: string;
  gallery: string[];
  historicalEra?: string;
  significance?: string;
  latitude?: number;
  longitude?: number;
  viewCount?: number;
  isFavorite?: boolean;
  // New fields for polish
  visit_hours?: string;
  entrance_fee?: number;
  year_established?: string;
  cultural_period?: string;
  rating?: number;
  total_reviews?: number;
  unesco_listed?: boolean;
  related_history_ids?: number[];
  related_heritage_ids?: number[];
  related_artifact_ids?: number[];
}

export interface Artifact extends BaseEntity {
  name: string;
  description: string;
  image: string;
  gallery: string[];
  heritageId: number | string;
  category: string;
  dating?: string;
  material?: string;
  dimensions?: string;
  is3D?: boolean;
  modelUrl?: string; // URL for 3D model
  // New fields for polish
  year_created?: string;
  creator?: string;
  condition?: string;
  artifact_type?: string;
  historical_context?: string;
  cultural_significance?: string;
  rating?: number;
  total_reviews?: number;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}
