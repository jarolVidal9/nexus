import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-edit-note',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit-note.component.html',
  styleUrl: './create-edit-note.component.css'
})
export class CreateEditNoteComponent {
  colors = ["#FFF9C4","#FFE0B2","#FFDAB9","#F8BBD0","#E1BEE7","#BBDEFB","#B2EBF2","#C8E6C9","#D1F2EB","#F5F5F5"];
  selectedColor = signal("#FFF9C4");
  noteForm : FormGroup;
  constructor(
    private dialog: MatDialogRef<CreateEditNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ){
    this.noteForm = this.formBuilder.group({
      title: [''],
      content: [''],
      color: [this.selectedColor()],
      id: [null]
    });
  }
  ngOnInit(){
    console.log('noteForm', this.data);
    
    if(this.data){
      this.noteForm.patchValue({
        ...this.data,
        color: this.selectedColor()
      });
    }

  }
  onSubmit(){
    if(this.noteForm.valid){
      this.dialog.close({
        ...this.noteForm.value,
        color: this.selectedColor()
      });
    }
  }
  setColor(color: string){
    this.selectedColor.set(color);
  }

}
