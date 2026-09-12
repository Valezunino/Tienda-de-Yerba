export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  weight: string;
  price: number;
  stock: number;
  active: boolean;
  image_url: string | null;
  accent: string;
};
