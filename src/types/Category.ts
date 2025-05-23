/**
 * Interface pour une catégorie
 */
export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  level: number;
  alias: string;
  haveParent: boolean;
  haveChildren: boolean;
  description?: string;
  parentCategoryId?: number;
  agenceId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour une catégorie avec ses enfants
 */
export interface CategoryWithChildren extends Category {
  children?: Category[];
}

/**
 * Interface pour une catégorie avec son parent
 */
export interface CategoryWithParent extends Category {
  parentCategory?: Category;
}

/**
 * Interface pour l'arbre des catégories
 */
export interface CategoryTree extends Category {
  children?: CategoryTree[];
} 