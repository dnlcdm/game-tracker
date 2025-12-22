export interface IGames {
  id: number;
  name: string;
  coverUrl: string;
  first_release_date: string;
  rating: number;
  platforms: {
    id: number;
    name: string;
  }[];
}

export interface IRequirements {
  minimum?: string;
  recommended?: string;
}
