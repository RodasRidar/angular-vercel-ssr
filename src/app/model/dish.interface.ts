export interface Dish {
  id?: number;
  order?: number;
  isPopular: boolean;
  isDiscount: boolean;
  name: string;
  price: number;
  description: string;
  discount: number;
  urlPhoto: string;
}

export interface Menu {
  id: number;
  category: Category[];
}

export interface Category {
  id: number;
  order: number;
  name: string;
  lstDishes: Dish[];
}
