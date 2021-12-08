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
  qty: number;

  constructor(private cartService: CartService) {
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
    if (this.qty > 0) {
      this.cartService.addProduct(this.product.id, this.qty);
      alert('Added to cart!');
    }
  }

}
