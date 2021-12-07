import { Component, OnInit } from '@angular/core';
import { ProductQty } from '../models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productsQties: ProductQty[];
  totalPrice: number = 0;

  constructor() {
    this.productsQties = [
      {
        "product": {
          "id": 2,
          "name": "Headphones",
          "price": 249.99,
          "url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "description": "Listen to stuff!"
        },
        "quantity": 3
      },
      {
        "product": {
          "id": 4,
          "name": "Glasses",
          "price": 129.99,
          "url": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "description": "Now you can see!"
        },
        "quantity": 3
      }
    ]
    this.calcTotalPrice()
  }

  ngOnInit(): void {
  }

  calcTotalPrice(): void {
    let total = 0
    for (let productQty of this.productsQties) {
      total += productQty.product.price * productQty.quantity
    }
    this.totalPrice = total
  }

}
