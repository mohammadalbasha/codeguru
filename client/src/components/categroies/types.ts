export interface Category {
  name: string;
  id: string;
  description: string;
}

export interface AddCategoryInput {
  name: string;
  description: string;
}

export interface DeleteCategoryInput {
  id: string;
}
