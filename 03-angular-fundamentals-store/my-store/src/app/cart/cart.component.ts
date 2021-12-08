import { Component, OnInit } from '@angular/core';
import { ProductQty } from '../models/product';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productsQties: ProductQty[] = [];
  totalPrice: number = 0;
  fullName: string = '';
  address: string = '';
  creditCardNumber: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

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

  submitForm(): void {
    if (this.productsQties.length == 0) {
      alert('Cart is Empty')
    }
    else {
      this.orderService.setOrder(
        this.fullName,
        this.totalPrice
      )
      this.cartService.clean()
      this.router.navigate(['/confirmation'])
    }
  }
}
