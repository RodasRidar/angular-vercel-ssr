import { Catalog } from './catalog.interface';
import { Product } from './product.interface';

export interface Section {
  id: string;
  catalog_id: string;
  name: string;
  order: number;
  products: Product[];
  Catalog: Catalog;
  isActive?: boolean | null;
}
