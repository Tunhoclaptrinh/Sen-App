import { BaseEntity } from './index';

export interface HeritageSite extends BaseEntity {
  name: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  gallery: string[];
  historicalEra?: string;
  significance?: string;
  latitude?: number;
  longitude?: number;
  viewCount?: number;
  isFavorite?: boolean;
}

export interface Artifact extends BaseEntity {
  name: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  heritageId: number | string;
  category: string;
  dating?: string;
  material?: string;
  dimensions?: string;
  is3D?: boolean;
  modelUrl?: string; // URL for 3D model
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}
