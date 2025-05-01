import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  apiUrl = environment.apiUrl;
  constructor(
    private http : HttpClient
  ) { 
  }

  getNotes() {
    return this.http.get<Note[]>(`${this.apiUrl}/note`);
  }
  getNote(id: string) {
    return this.http.get(`${this.apiUrl}/note/${id}`);
  }
  createNote(note: Note) {
    return this.http.post(`${this.apiUrl}/note`, note);
  }
  updateNote(note: Note) {
    return this.http.put(`${this.apiUrl}/note/${note.id}`, note);
  }
  deleteNote(id: string) {
    return this.http.delete(`${this.apiUrl}/note/${id}`);
  }
  getArchivedNotes() {
    return this.http.get(`${this.apiUrl}/note/archived`);
  }
  
}
