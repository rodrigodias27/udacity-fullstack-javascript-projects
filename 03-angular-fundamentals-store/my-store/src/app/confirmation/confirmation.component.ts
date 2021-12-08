import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  buyerFullName: string = '';
  totalValue: number = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.buyerFullName = this.orderService.getFullName()
    this.totalValue = this.orderService.getTotalValue()
  }

  ngOnDestroy(): void {
    this.buyerFullName = '';
    this.totalValue= 0;
  }

}
