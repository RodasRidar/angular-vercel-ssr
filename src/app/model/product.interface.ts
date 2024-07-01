export interface Product {
  id: string;
  section_id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  is_popular: boolean;
  is_on_sale?: boolean;
  discountPercentage?: number;
  is_active?: boolean;
  imageAlt?: string;
}
