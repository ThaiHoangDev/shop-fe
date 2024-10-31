export type Taxons = {
  id: string;
  name: string;
  permalink?: string;
  parent_id: string;
  taxonomy_id: string;
  icon_url_128x128: string;
  taxons: Taxons[];
  title?: string;
  child?: { title?: string; href?: string }[];
};

export type CategoryItem = {
  id?: string;
  icon?: string;
  name?: string;
  href?: string;
  title?: string;
  permalink?: string;
  taxonomy_id?: string | number;
  child?: { title?: string; href?: string }[];
  icon_url_128x128?: string;
  taxons?: Taxons[];
};

interface CategoryNavList {
  root?: any;
  category: any;
  categoryItem: CategoryItem[];
}

export default CategoryNavList;
