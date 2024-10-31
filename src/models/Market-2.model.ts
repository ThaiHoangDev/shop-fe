import Product from './Product.model';

export interface MainCarouselItem {
  title?: string;
  normal_size_url?: string;
  category?: string;
  discount?: number;
  buttonLink?: string;
  buttonText?: string;
  description?: string;
}

export interface CategoryBasedProducts {
  products: Product[];
  category: { title: string; children: string[] };
}
