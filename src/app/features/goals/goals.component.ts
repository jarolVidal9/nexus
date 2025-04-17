import { Component, signal, ViewChild, ElementRef, HostListener} from '@angular/core';
import { GoalService } from './services/goal.service';
import { Category } from './interfaces/category';
import { CommonModule } from '@angular/common';
import {
  CdkDragHandle,
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-goals',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent {
  categorysWithGoals = signal<Category[]>([]);
  addGoalInput = signal(false);
  createGoalForm : FormGroup;
  goalCategoryId: string | null = null;

  constructor(
    private goalService: GoalService,
    private fb: FormBuilder
  ){
    this.createGoalForm = this.fb.group(
      {
        title: [''],
        priority: [''],
        progress: [''],
        objective: [''],
        description: [''],
        unit: [''],
        dueDate: [''],
      }
    )
  }

  ngOnInit(){
    this.getGoals();
  }

  getGoals(){
    this.goalService.getGoals().subscribe({
      next: (categorys: Category[]) => {
        this.categorysWithGoals.set(categorys);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categorysWithGoals(), event.previousIndex, event.currentIndex);

    // Obtener el nuevo orden de los IDs de las categorías
    const newOrder = this.categorysWithGoals().map((cat, index) => ({
      id: cat.id,
      order: index
    }));    
    // Enviar el nuevo orden al servidor
    this.goalService.reorderGoals(newOrder).subscribe();
  }

  addGoal(){
    this.addGoalInput.set(!this.addGoalInput());
  }

  saveGoal(event: Event){
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.goalService.createGoalCategory(value).subscribe({
        next: (category: Category) => {
          this.categorysWithGoals.update((prev) => [...prev, category]);
          this.addGoalInput.set(false);
          input.value = ''; 
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
  @ViewChild('newGoalInput') newGoalInput!: ElementRef;
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickeado = event.target as HTMLElement;

    if (this.newGoalInput && !this.newGoalInput.nativeElement.contains(clickeado)) {
      console.log('Click fuera del input');
      this.addGoalInput.set(false);
      this.newGoalInput.nativeElement.value = ''; // Limpiar el input
    }
  }
  defineCategory(categoryId: string){
    this.goalCategoryId = categoryId;
  }
  onSubmit(){
    const goalData = this.createGoalForm.value;
    const goal = {
      ...goalData,
      goalCategoryId: this.goalCategoryId,
      state: 'nueva', // Cambia esto por el estado que desees
    }
    if (this.goalCategoryId) {
      this.goalService.createGoal(goal).subscribe({
        next: (goal: any) => {
          this.categorysWithGoals.update((prev) => {
            const category = prev.find(cat => cat.id === this.goalCategoryId);
            if (category) {
              category.Goals.push(goal);
            }
            return [...prev];
          });
          this.createGoalForm.reset();
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
