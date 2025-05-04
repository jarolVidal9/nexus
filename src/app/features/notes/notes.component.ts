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
  allNotes = signal<Note[]>([]);
  showArchivedNotes = signal(false);
  deleteNoteId = signal('');
  archivedNoteId = signal('');
  pinnedNoteId = signal('');

  constructor(
    private notesService: NoteService,
    private dialog: MatDialog,
  ){}

  ngOnInit(){
    this.loading.set(true);
    this.getNotes();
  }
  getNotes(){
    this.notesService.getNotes().subscribe({
      next: (notes : Note[]) => {
        this.notes.set(notes);
        this.allNotes.set(notes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  togglePin(note: Note, event: Event) {
    event.stopPropagation();
    this.pinnedNoteId.set(note.id);
    const updatedNote = { ...note, pinned: !note.pinned };
    this.notesService.updateNote(updatedNote.id, updatedNote).subscribe({
      next: () => {
        this.pinnedNoteId.set('');
        this.notes.update(notes => {
            const updatedNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
            // Reorder notes: pinned notes first, then by createdAt for unpinned notes
            return updatedNotes.sort((a, b) => {
            if (a.pinned === b.pinned) {
              return a.pinned ? 0 : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return Number(b.pinned) - Number(a.pinned);
            });
        });
      },
      error: (error) => {
        this.pinnedNoteId.set('');
        console.error(error);
      }
    });
  }

  toggleArchive(note: Note, event: Event){
    this.archivedNoteId.set(note.id);
    event.stopPropagation();
    const updatedNote = { ...note, archived: !note.archived };
    this.notesService.updateNote(updatedNote.id,updatedNote).subscribe({
      next: () => {
        this.archivedNoteId.set('');
        // Remove the note from the list if archived, otherwise update it
        this.notes.update(notes =>
          updatedNote.archived
            ? notes.filter(n => n.id !== updatedNote.id)
            : notes.map(n => n.id === updatedNote.id ? updatedNote : n)
        );
      },
      error: (error) => {
        console.error(error);
        this.archivedNoteId.set('');
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
      this.notes.update((notes) => [result, ...notes]);
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

  showArchivateNotes(){
    this.notesService.getArchivedNotes().subscribe({
      next: (notes : Note[]) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  toggleArchivedNotes(){
    this.loading.set(true);
    this.notesService.getNotes().subscribe({
      next: (notes : Note[]) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    console.log('searchTerm', searchTerm);
    
    if (!searchTerm) {
      this.notes.set(this.allNotes());
    } else {
      this.notes.update((notes) => 
        notes.filter(note => 
          note.title.toLowerCase().includes(searchTerm) || 
          (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
      );
    }
  }
  deleteNote(note: Note, event: Event){
    this.deleteNoteId.set(note.id);
    event.stopPropagation();
    this.notesService.deleteNote(note.id).subscribe({
      next: () => {
        this.deleteNoteId.set('');
        this.notes.update((notes) => notes.filter(n => n.id !== note.id));
      },
      error: (error) => {
        console.error(error);
        this.deleteNoteId.set('');
      }
    });
  }
}
