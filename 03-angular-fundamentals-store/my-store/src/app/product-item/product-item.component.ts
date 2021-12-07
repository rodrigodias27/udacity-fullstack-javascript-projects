import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../models/product'
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  qty: number = 0;

  constructor(private cartService: CartService) {
    this.product = {
      id: 0,
      name: "",
      price : 0,
      url: "",
      description: ""
    };
  }

  ngOnInit(): void {
  }

  addProduct(): void {
    this.cartService.addProduct(this.product.id, this.qty);
    alert("Added to cart!");
  }

}
