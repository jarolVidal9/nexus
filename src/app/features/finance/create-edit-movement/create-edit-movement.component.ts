import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovementService } from '../services/movement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Movement } from '../interface/movement';

@Component({
  selector: 'app-create-edit-movement',
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit-movement.component.html',
  styleUrl: './create-edit-movement.component.css'
})
export class CreateEditMovementComponent implements OnInit {
  movementForm : FormGroup;
  loading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private movementService: MovementService,
    private dialog: MatDialogRef<CreateEditMovementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movement: Movement }
  ) {
    this.movementForm = this.formBuilder.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      type: ['', Validators.required]
    });
  }
  ngOnInit() {
    if (this.data) {
      this.movementForm.patchValue({
        title: this.data.movement.title,
        amount: this.data.movement.amount,
        date: new Date(this.data.movement.date).toISOString().substring(0, 10),
        type: this.data.movement.type
      });
    }
  }

  onSubmit() {
    this.loading.set(true);
    if (this.movementForm.valid) {
      const movementData = this.movementForm.value;
      if (this.data) {
        this.movementService.updateMovement(this.data.movement.id, movementData).subscribe({
          next: (movementData: Movement) => {
            this.dialog.close(movementData); 
            this.movementForm.reset();
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error updating movement', error);
          }
        });
      }else{
        console.log('movementData', movementData);
        
        this.movementService.createMovement(movementData).subscribe({
          next: (movementData: Movement) => {
            this.dialog.close(movementData); 
            this.movementForm.reset();
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error creating movement', error);
          }
        });
      }
    } 
  }
  

}
