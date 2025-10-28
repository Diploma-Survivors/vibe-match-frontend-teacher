export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}
export interface Tag {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
