import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpirationDateService {
  private expirationDate = '';

  setExpirationDate(date: string): void {
    this.expirationDate = date;
  }

  getExpirationDate(): string {
    return this.expirationDate;
  }
}

