import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/category';
import { Goal } from '../interfaces/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) {}
  getGoals() {
    return this.http.get<Category[]>(`${this.apiUrl}/goalCategory`);
  }

  reorderGoals(goals: { id: string, order: number }[]) {    
    return this.http.post(`${this.apiUrl}/goalCategory/reorder`, goals);
  }

  createGoalCategory(name: string) {
    return this.http.post<Category>(`${this.apiUrl}/goalCategory`, { name });
  }
  createGoal(goal: Goal) {
    return this.http.post<Goal>(`${this.apiUrl}/goal`, goal);
  }
}
