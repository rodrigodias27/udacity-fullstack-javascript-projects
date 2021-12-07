export type Product = {
  id: number;
  name: string;
  price: number;
  url: string;
  description: string;
};

export type ProductQty = {
  product: Product;
  quantity: number;
}
