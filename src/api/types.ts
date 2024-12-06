export type ServerIntendedError = {
  status: string;
  code: number;
  message: string | null;
};

export type ServerResponse<T> = {
  code: number;
  status: string;
  data: T;
};
