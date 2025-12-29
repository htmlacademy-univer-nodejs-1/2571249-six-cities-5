export interface BaseService<T> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
}

