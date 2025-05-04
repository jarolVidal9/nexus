import { Component, Inject, signal, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoteService } from '../services/note.service';
import { Note } from '../interfaces/note';

@Component({
  selector: 'app-create-edit-note',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit-note.component.html',
  styleUrl: './create-edit-note.component.css'
})
export class CreateEditNoteComponent implements OnInit {
  noteForm : FormGroup;
  loading = signal(false);
  constructorTags = ['hola','mundo','test'];
  editingTitle = signal(false);
  editingContent = signal(false);
  newTag = signal('');

  constructor(
    private dialog: MatDialogRef<CreateEditNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note | null,
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ){
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      pinned: [false],
      archived: [false],
      img: [null],
      tags: this.formBuilder.array([]),
    });
  }
  ngOnInit(){
    if(this.data){
      this.noteForm.patchValue({
        ...this.data,
      });
      if (this.data.tags) {
        const tagArray = this.noteForm.get('tags') as FormArray;
        this.data.tags.forEach((tag: string) => {
          tagArray.push(new FormControl(tag));
        });
      }
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
  get tags(): FormArray {
    return this.noteForm.get('tags') as FormArray;
  }

  addTag() {
    this.noteForm.markAsDirty();
    const tag = this.newTag().trim();
    if (tag && !this.tags.value.includes(tag)) {
      this.tags.push(new FormControl(tag));
      this.newTag.set('');
    }
  }
  onTagInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.newTag.set(input.value);
    }
  }
  

  removeTag(index: number) {
    this.noteForm.markAsDirty();
    this.tags.removeAt(index);
  }

  cancel(){
    this.dialog.close();
    this.noteForm.reset();
  }

}
