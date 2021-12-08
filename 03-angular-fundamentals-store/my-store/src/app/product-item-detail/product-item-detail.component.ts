import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent implements OnInit {
  product: Product;
  productId: number;
  qty: number;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) {
    this.product = {
      id: 0,
      name: '',
      price : 0,
      url: '',
      description: ''
    };
    this.productId = 0;
    this.qty = 0;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') as unknown as number;
    })
    this.productsService.getProducts().subscribe(res => {
      this.product = res.filter(p => p.id == this.productId)[0];
    })
  }

  addProduct(): void {
    if (this.qty > 0) {
      this.cartService.addProduct(this.product.id, this.qty);
      alert('Added to cart!');
    }
  }
}
