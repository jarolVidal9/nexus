import { Component, signal } from '@angular/core';
import { NoteService } from './services/note.service';
import { Note } from './interfaces/note';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditNoteComponent } from './create-edit-note/create-edit-note.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  notes = signal<Note[]>([]);
  loading = signal(true);

  constructor(
    private notesServce: NoteService,
    private dialog: MatDialog,
  ){}

  ngOnInit(){
    this.loading.set(true);
    this.getNotes();
  }
  getNotes(){
    this.notesServce.getNotes().subscribe({
      next: (notes : Note[]) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  togglePin(note: Note, event: Event) {
    event.stopPropagation();
    const updatedNote = { ...note, pinned: !note.pinned };
    this.notesServce.updateNote(updatedNote.id, updatedNote).subscribe({
      next: () => {
        this.notes.update(notes => {
          const updatedNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
          // Reorder notes: pinned notes first
          return updatedNotes.sort((a, b) => Number(b.pinned) - Number(a.pinned));
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleArchive(note: Note, event: Event){
    event.stopPropagation();
    const updatedNote = { ...note, archived: !note.archived };
    this.notesServce.updateNote(updatedNote.id,updatedNote).subscribe({
      next: () => {
        // Remove the note from the list if archived, otherwise update it
        this.notes.update(notes =>
          updatedNote.archived
            ? notes.filter(n => n.id !== updatedNote.id)
            : notes.map(n => n.id === updatedNote.id ? updatedNote : n)
        );
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  

  addNote(){
    const dialogRef = this.dialog.open(CreateEditNoteComponent,{
      data: null,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.notes.update((notes) => [...notes, result]);
      }
    });
  }
  editNote(note: Note){    
    // Open the dialog with the note data
    const dialogRef = this.dialog.open(CreateEditNoteComponent,{
      data: note,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.notes.update((notes) => notes.map(n => n.id === result.id ? result : n));
      }
    });
  }
}
