export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}
export interface Tag {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
}
