import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  fullName: string = '';
  totalValue: number = 0;

  constructor() {}

  setOrder(fullName: string, totalValue: number): void {
    this.fullName = fullName
    this.totalValue = totalValue
  }

  getFullName(): string {
    return this.fullName
  }

  getTotalValue(): number {
    return this.totalValue
  }

  clean(): void {
    this.fullName = ''
    this.totalValue = 0
  }
}
