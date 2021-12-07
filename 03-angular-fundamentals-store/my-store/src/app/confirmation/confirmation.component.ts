import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  totalPrice: number;
  buyerName: string;

  constructor() {
    this.totalPrice = 999.99
    this.buyerName = "Jake Peralta"
  }

  ngOnInit(): void {
  }

}
