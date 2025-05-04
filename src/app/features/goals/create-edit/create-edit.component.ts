import { CommonModule } from '@angular/common';
import { Component, Inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../services/goal.service';
import { FilesService } from '../../../core/services/files.service';
import { Goal } from '../interfaces/goal';

@Component({
  selector: 'app-create-edit',
  imports: [CommonModule, MatDialogModule,MatButtonModule, ReactiveFormsModule],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})
export class CreateEditComponent implements OnInit {
  createGoalForm : FormGroup;
  loading = signal(false);
  previewImg = signal<string | ArrayBuffer | null>(null);
  selectedFile: File | null = null;
  imgPath = signal<string | null>(null);
  errorMessages= signal<{ msg: string; path: string }[]>([]);

  constructor(
    private dialog: MatDialogRef<CreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goal: Goal, categoryId: string },
    private fb: FormBuilder,
    private goalService: GoalService,
    private fileService: FilesService
  ) { 
    this.createGoalForm = this.fb.group(
      {
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      img: [''],
      priority: ['', [Validators.required]],
      progress: [null],
      objective: [null],
      description: ['', [Validators.maxLength(250)]],
      unit: ['', [Validators.minLength(1), Validators.maxLength(10)]],
      dueDate: ['', [Validators.required, this.futureDateValidator()]],
      state: [''],
      },
      { validators: this.progressLessThanObjectiveValidator() }
    );
  }
  progressLessThanObjectiveValidator() {
    return (group: import('@angular/forms').AbstractControl) => {
      const progress = group.get('progress')?.value;
      const objective = group.get('objective')?.value;
      if (
        progress !== null &&
        progress !== undefined &&
        objective !== null &&
        objective !== undefined &&
        progress !== 0 &&
        objective !== 0 &&
        progress > objective
      ) {
        return { progress: 'El progreso no puede ser mayor al objetivo' };
      }
      return null;
    };
  }

  futureDateValidator() {
    return (control: import('@angular/forms').AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate <= today) {
        return { date: 'La fecha debe ser mayor a la actual' };
      }
      return null;
    };
  }
  ngOnInit(){
    console.log(this.data.goal);
    if(this.data.goal && this.data.goal.img) {
      this.imgPath.set(this.fileService.getRouteImage(this.data.goal.img)); 
    }
    if (this.data.goal) {
      this.createGoalForm.patchValue({
        title: this.data.goal.title,
        img: this.data.goal.img,
        priority: this.data.goal.priority,
        progress: this.data.goal.progress,
        objective: this.data.goal.objective,
        description: this.data.goal.description,
        unit: this.data.goal.unit,
        dueDate: this.data.goal.dueDate,
        state: this.data.goal.state,
      });
    }
  }

  onSubmit(){
    this.loading.set(true);
    if(this.data.goal) {
      this.editGoal();
    }
    else {
      this.createGoal();
    }
  }
  createGoal(){
    const goalData = this.createGoalForm.value;
    const filename = this.saveFile()
    if (filename) {
      goalData.img = filename; // Asigna el nombre del archivo guardado al campo img
    } else {
      goalData.img = null;
    }
    const goal = {
      ...goalData,
      goalCategoryId: this.data.categoryId,
      state: 'proceso', // Cambia esto por el estado que desees
    }
    if (this.data.categoryId) {
      this.goalService.createGoal(goal).subscribe({
        next: (goalResponse: Goal) => {
          this.loading.set(false);
          this.createGoalForm.reset();
          this.dialog.close(goalResponse);
          this.errorMessages.set([]); // Limpiar los mensajes de error
        },
        error: (error) => {
          console.error(error);
          const errors = error?.error?.errors || [];
          this.errorMessages.set(errors);
          this.loading.set(false);
        }
      });
    }
  }
  editGoal() {
    const goalData = this.createGoalForm.value;
    // Validar si progress es igual a objective o menor
    if (
      goalData.progress !== null &&
      goalData.progress !== undefined &&
      goalData.objective !== null &&
      goalData.objective !== undefined
    ) {
      if (goalData.progress === goalData.objective) {
        goalData.state = 'completada';
      } else if (goalData.progress < goalData.objective) {
        goalData.state = 'proceso';
      }
    }

    // Si la imagen fue eliminada (img vacío y no hay archivo seleccionado)
    if (!goalData.img && !this.selectedFile) {
      goalData.img = null;
      this.updateGoal(goalData);
      return;
    }

    if (this.selectedFile) {
      this.loading.set(true);
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (data: { message: string, filename: string, path: string }) => {
          goalData.img = data.filename;
          this.updateGoal(goalData);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        }
      });
    } else {
      goalData.img = this.data.goal.img;
      this.updateGoal(goalData);
    }
  }

  updateGoal(goalData: Goal) {
    this.goalService.editGoal(this.data.goal.id, goalData).subscribe({
      next: (goal: Goal) => {        
      this.loading.set(false);
      this.createGoalForm.reset();
      this.dialog.close(goal); // Emitir el goal como un objeto
      this.errorMessages.set([]); // Limpiar los mensajes de error
      },
      error: (error) => {
      console.error(error);
      const errors = error?.error?.errors || [];
      this.errorMessages.set(errors);
      this.loading.set(false);
      }
    });
  }

  saveFile() {
    if (this.selectedFile) {
      this.loading.set(true);
      // Now returns an observable for consistency, but not used in editGoal anymore
      return this.fileService.uploadFile(this.selectedFile);
    }
    return null; // Si no hay archivo seleccionado, retorna null
  }
  onFileSelected(event: Event): void {
    console.log('File selected:', event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imgPath.set(null);
      const file = input.files[0];
      this.selectedFile = file;
      
      this.createGoalForm.get('img')?.setValue(file.name); // solo para marcarlo como cambiado
      this.createGoalForm.get('img')?.markAsDirty();
      
      const reader = new FileReader();
      reader.onload = () => this.previewImg.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }
  removeImage(){
    this.createGoalForm.get('img')?.markAsDirty();
    this.imgPath.set(null);
    this.previewImg.set(null);
    this.selectedFile = null;
    this.createGoalForm.get('img')?.setValue(''); // Limpiar el valor del campo img en el formulario
  }
}
