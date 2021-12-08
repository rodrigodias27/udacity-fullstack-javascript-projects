/**
* @description Represents a product
* @constructor
* @param {number} id - The id of the product
* @param {string} name - The name of the product
* @param {number} price - The price of the product
* @param {string} url - The url image of the product
* @param {string} description - The description of the product
*/
export type Product = {
  id: number;
  name: string;
  price: number;
  url: string;
  description: string;
}

/**
* @description Represents a quantity of the product
* @constructor
* @param {Product} product - The product object
* @param {number} quantity - The quantity of the project
*/
export type ProductQty = {
  product: Product;
  quantity: number;
}
