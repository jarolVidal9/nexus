import { Component, Inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-edit-note',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-edit-note.component.html',
  styleUrl: './create-edit-note.component.css'
})
export class CreateEditNoteComponent {
  noteForm : FormGroup;
  loading = signal(false);
  constructorTags = ['hola','mundo','test'];


  constructor(
    private dialog: MatDialogRef<CreateEditNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ){
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      pinned: [false],
      archived: [false],
      img: [null]
    });
  }
  ngOnInit(){
    if(this.data){
      this.noteForm.patchValue({
        ...this.data,
      });
    }

  }
  onSubmit(){
    this.loading.set(true);
    if(this.noteForm.valid){
      if(this.data){
        this.noteService.updateNote(this.data.id, this.noteForm.value).subscribe({
          next: (note) => {
            this.dialog.close(note);
            this.loading.set(false);
          }
        });
      }else{
        this.noteService.createNote(this.noteForm.value).subscribe({
          next: (note) => {
            this.dialog.close(note);
            this.loading.set(false);
          }
        });
      }
    }
  }


  cancel(){
    this.dialog.close();
    this.noteForm.reset();
  }

}
