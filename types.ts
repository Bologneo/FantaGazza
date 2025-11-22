export interface Player {
  id: string;
  name: string;
  role: 'P' | 'D' | 'C' | 'A'; // Portiere, Difensore, Centrocampista, Attaccante
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GradeResponse {
  text: string;
  sources: GroundingChunk[];
}

export interface AnalysisResponse {
  text: string;
}

export enum AppStatus {
  IDLE,
  LOADING_GRADES,
  LOADING_ANALYSIS,
  SUCCESS,
  ERROR
}
