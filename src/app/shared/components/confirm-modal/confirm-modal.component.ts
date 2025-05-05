import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  constructor(
    private dialog: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, confirmButtonText: string, cancelButtonText: string }
  ) {

  }
  onConfirm() {
    // Lógica para confirmar la acción
    this.dialog.close(true); // Cierra el modal y devuelve true
  }

  onCancel() {
    // Lógica para cancelar la acción
    this.dialog.close(false); // Cierra el modal y devuelve false
  }

}
