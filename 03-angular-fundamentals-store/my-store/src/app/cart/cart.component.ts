import { Component, OnInit } from '@angular/core';
import { ProductQty } from '../models/product';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productsQties: ProductQty[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.productsQties = this.cartService.getProductQuantities()
    this.calcTotalPrice()
  }

  calcTotalPrice(): void {
    let total = 0
    for (let productQty of this.productsQties) {
      total += productQty.product.price * productQty.quantity
    }
    this.totalPrice = total.toFixed(2) as unknown as number
  }

}
