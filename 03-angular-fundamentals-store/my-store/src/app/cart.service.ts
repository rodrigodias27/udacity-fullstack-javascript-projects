import { Injectable } from '@angular/core';
import { ProductQty } from './models/product';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  productQuantities: ProductQty[];

  constructor(private productService: ProductsService) {
    this.productQuantities = []
    this.setupProductQuantities()
  }

  setupProductQuantities(): void {
    this.productService.getProducts().subscribe(res => {
      // Get product
      for (let product of res) {
      // Add new ProductQty
        this.productQuantities.push(
          {
            "product": product,
            "quantity": 0
          }
        )
      }
    })
  }

  addProduct(id: number, quantity: number): void {
    this.productQuantities[id-1].quantity += quantity
  }

  getProductQuantities(): ProductQty[] {
    return this.productQuantities.filter(p => p.quantity > 0)
  }

  clean(): void {
    this.productQuantities = []
    this.setupProductQuantities()
  }
}
