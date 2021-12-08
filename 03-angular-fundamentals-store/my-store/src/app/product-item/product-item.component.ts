import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, ProductQty } from '../models/product'

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Output() addProductToCart: EventEmitter<ProductQty> = new EventEmitter
  qty: number;

  constructor() {
    this.product = {
      id: 0,
      name: '',
      price : 0,
      url: '',
      description: ''
    };
    this.qty = 0;
  }

  ngOnInit(): void {
  }

  addProduct(): void {
    let productQty = {
      'product': this.product,
      'quantity': this.qty
    };
    this.addProductToCart.emit(productQty);
  }

}
