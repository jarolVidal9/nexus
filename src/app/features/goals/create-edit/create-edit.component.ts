import { CommonModule } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../services/goal.service';
import { FilesService } from '../../../core/services/files.service';
import { Goal } from '../interfaces/goal';

@Component({
  selector: 'app-create-edit',
  imports: [CommonModule, MatDialogModule,MatButtonModule, ReactiveFormsModule],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})
export class CreateEditComponent {
  createGoalForm : FormGroup;
  loading = signal(false);
  previewImg = signal<string | ArrayBuffer | null>(null);
  selectedFile: File | null = null;
  imgPath = signal<string | null>(null);

  constructor(
    private dialog: MatDialogRef<CreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private goalService: GoalService,
    private fileService: FilesService
  ) { 
    this.createGoalForm = this.fb.group(
      {
        title: [''],
        img:[''],
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
      state: 'nueva', // Cambia esto por el estado que desees
    }
    if (this.data.categoryId) {
      this.goalService.createGoal(goal).subscribe({
        next: (goalResponse: Goal) => {
          this.loading.set(false);
          this.createGoalForm.reset();
          this.dialog.close(goalResponse);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
  editGoal() {
    const goalData = this.createGoalForm.value;
    if (this.selectedFile) {
      this.loading.set(true);
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (data: { message: string, filename: string, path: string }) => {
          goalData.img = data.filename; // Asigna el nombre del archivo guardado al campo img
          this.updateGoal(goalData);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        }
      });
    } else {
      goalData.img = this.data.goal.img; // Mantiene el valor original si no se seleccionó un nuevo archivo
      this.updateGoal(goalData);
    }
  }

  updateGoal(goalData: any) {
    this.goalService.editGoal(this.data.goal.id, goalData).subscribe({
      next: (goal: Goal) => {        
      this.loading.set(false);
      this.createGoalForm.reset();
      this.dialog.close(goal); // Emitir el goal como un objeto
      },
      error: (error) => {
      console.error(error);
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
  
}
