import { Component, OnInit } from '@angular/core';
import { Product, ProductQty } from '../models/product'
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {
    this.products = [];
  }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(res => {
      this.products = res;
    })
  }

  addProductToCart(productQty: ProductQty): void {
    if (productQty.quantity > 0) {
      this.cartService.addProduct(productQty.product.id, productQty.quantity);
      alert('Added to cart!');
    }
  }
}
