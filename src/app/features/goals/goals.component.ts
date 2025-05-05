import { Component, signal, ViewChild, ElementRef, HostListener, OnInit} from '@angular/core';
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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditComponent } from './create-edit/create-edit.component';
import { Goal } from './interfaces/goal';
import { FilesService } from '../../core/services/files.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-goals',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent implements OnInit {
  categorysWithGoals = signal<Category[]>([]);
  addGoalInput = signal(false);
  createGoalForm : FormGroup;
  loading = signal(true);
  loadingCreateCategory = signal(false);
  loadingDeleteCategory = signal(false);

  constructor(
    private goalService: GoalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private fileService: FilesService
  ){
    this.createGoalForm = this.fb.group(
      {
        title: ['', [Validators.required]],
        priority: ['',[Validators.required]],
        progress: ['',],
        objective: [''],
        description: [''],
        unit: [''],
        dueDate: [''],
        tags: [''],
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
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
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

  saveCategory(event: Event){
    this.loadingCreateCategory.set(true);
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.goalService.createGoalCategory(value).subscribe({
        next: (category: Category) => {
          this.categorysWithGoals.update((prev) => [...prev, category]);
          this.addGoalInput.set(false);
          input.value = ''; 
          this.loadingCreateCategory.set(false);
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
      this.addGoalInput.set(false);
      this.newGoalInput.nativeElement.value = ''; // Limpiar el input
    }
  }
  saveGoal(categoryId: string){
    const dialogRef = this.dialog.open(CreateEditComponent,{
      data: {
        categoryId: categoryId,
      }
    });
    dialogRef.afterClosed().subscribe((goal: Goal) => {
      if (goal) {
        this.categorysWithGoals.update((prev) => {
          const category = prev.find(cat => cat.id === categoryId);
          if (category) {
            category.Goals.push(goal);
          }
          return [...prev];
        });
      }
    });
  }
  
  deleteGoal(goalId: string, Event: MouseEvent){
    Event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmModalComponent,
      {
        data: {
          title: 'Eliminar meta',
          message: '¿Estás seguro de que deseas eliminar esta meta?',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmDelete(goalId);
      }
    });
  }
  confirmDelete(goalId: string) {
    this.goalService.deleteGoal(goalId).subscribe({
      next: () => {
        this.categorysWithGoals.update((prev) => {
          const category = prev.find(cat => cat.Goals.some(goal => goal.id === goalId));
          if (category) {
            category.Goals = category.Goals.filter(goal => goal.id !== goalId);
          }
          return [...prev];
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editGoal(goal: Goal, categoryId: string) {
    const dialogRef = this.dialog.open(CreateEditComponent, {
      data: {
        goal: goal,
        categoryId: categoryId
      }
    });
    dialogRef.afterClosed().subscribe((updatedGoal: Goal) => {
      if (updatedGoal) {
        this.categorysWithGoals.update((prev) => {
          const category = prev.find(cat => cat.id === categoryId);
          if (category) {
           const goal = category.Goals.findIndex(g => g.id === updatedGoal.id);
          if (goal !== -1) category.Goals[goal] = updatedGoal;
          }
          return [...prev];
        });
      }
    });
  }
  getImageUrl(img: string): string {
    return this.fileService.getRouteImage(img);
  }

  deleteCategory(categoryId: string) {
    this.loadingDeleteCategory.set(true);
    this.goalService.deleteGoalCategory(categoryId).subscribe({
      next: () => {
        this.categorysWithGoals.update((prev) => {
          return prev.filter(cat => cat.id !== categoryId);
        });
        this.loadingDeleteCategory.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
