import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Movement } from '../interface/movement';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) {}

  getStatistics(startDate: Date, endDate: Date) {
    const url = `${this.apiUrl}/movement/statistics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    return this.http.get<{ totalIncome: number, totalExpense: number, balance: number}>(url);
  }

  getMovements(startDate: Date, endDate: Date) {
    const url = `${this.apiUrl}/movement?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    return this.http.get<Movement[]>(url);
  }
  createMovement(movement: Movement) {
    const url = `${this.apiUrl}/movement`;
    return this.http.post<Movement>(url, movement);
  }
  updateMovement(id: string, movement: Movement) {
    const url = `${this.apiUrl}/movement/${id}`;
    return this.http.put<Movement>(url, movement);
  }
  deleteMovement(id: string) {
    const url = `${this.apiUrl}/movement/${id}`;
    return this.http.delete(url);
  }

}
