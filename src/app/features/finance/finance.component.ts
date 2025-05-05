import { Component, OnInit, signal } from '@angular/core';
import { MovementService } from './services/movement.service';
import { Movement } from './interface/movement';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditMovementComponent } from './create-edit-movement/create-edit-movement.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-finance',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent implements OnInit{
  filterForm: FormGroup;
  startDate: Date | null = null;
  endDate: Date | null = null;
  movements = signal<Movement[]>([]);
  loadingStatistics = signal(true);
  loadingMovements = signal(true);
  totalIncome = signal(0);
  totalExpense = signal(0);
  balance = signal(0);

  constructor(
    private movementService: MovementService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    // Inicializa startDate al primer día del mes actual
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    // Inicializa endDate al último día del mes actual
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.filterForm = this.formBuilder.group({
      startDate: [this.formatDate(this.startDate)],
      endDate: [this.formatDate(this.endDate)]
    });
  }

  ngOnInit() {
    this.getMovements();
    this.getStatistics();
  }

  getStatistics() {
    this.loadingStatistics.set(true);
    if (this.startDate && this.endDate) {
      this.movementService.getStatistics(this.startDate, this.endDate).subscribe({
        next: (statistics: { totalIncome: number, totalExpense: number, balance: number}) => {
          this.totalIncome.set(statistics.totalIncome);
          this.totalExpense.set(statistics.totalExpense);
          this.balance.set(statistics.balance);
          this.loadingStatistics.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loadingStatistics.set(false);
        }
      });
    }
  }

  getMovements() {
    this.loadingMovements.set(true);
    if (this.startDate && this.endDate) {
      this.movementService.getMovements(this.startDate, this.endDate).subscribe({
        next: (movements: Movement[]) => {          
          this.movements.set(movements);
          this.loadingMovements.set(false);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
  onFilter() {
    this.startDate = new Date(this.filterForm.value.startDate);
    this.endDate = new Date(this.filterForm.value.endDate);
    this.getMovements();
    this.getStatistics();
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  openAddMovementModal(){
    const dialogRef = this.dialog.open(CreateEditMovementComponent, {
      width: '400px',
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movements.update(movements => [...movements, result]);
        this.getStatistics();
      }
    });
  }

  openEditMovementModal(movement: Movement) {
    const dialogRef = this.dialog.open(CreateEditMovementComponent, {
      width: '400px',
      data: { movement }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movements.update(movements => movements.map(m => m.id === result.id ? result : m));
        this.getStatistics();
      }
    });
  }

  deleteMovement(movementId: string) {
    const dialogRef = this.dialog.open(ConfirmModalComponent,
      {
        width: '400px',
        panelClass: 'custom-dialog-container',
        data: {
          title: 'Eliminar movimiento',
          message: '¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movementService.deleteMovement(movementId).subscribe({
          next: () => {
            this.movements.update(movements => movements.filter(m => m.id !== movementId));
            this.getStatistics();
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
    
  }
}
