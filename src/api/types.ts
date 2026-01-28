export type ServerIntendedError = {
  status: string;
  code: number;
  message: string | null;
};

export type ServerResponse<T> = {
  code: number;
  status: string;
  data: T;
  message?: string | null;
};

export type ImageCategory = 'ARTICLE' | 'PROFILE' | 'TEAM' | 'TEAM_RECRUIT';
