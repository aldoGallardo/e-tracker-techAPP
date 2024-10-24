import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-detail.component.html',
})
export class AssignmentDetailComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AssignmentDetailComponent>);
  private data = inject(MAT_DIALOG_DATA);
  assignment: any = null;

  ngOnInit(): void {
    this.assignment = this.data;
    // Convirtiendo las marcas de tiempo a objetos Date
    if (this.assignment.startedAt) {
      this.assignment.startedAt = new Date(
        this.assignment.startedAt._seconds * 1000
      );
    }
    if (this.assignment.completedAt) {
      this.assignment.completedAt = new Date(
        this.assignment.completedAt._seconds * 1000
      );
    }
    if (this.assignment.assignmentDate) {
      this.assignment.assignmentDate = new Date(
        this.assignment.assignmentDate._seconds * 1000
      );
    }
  }

  save(): void {
    console.log('Guardando asignación:', this.assignment);
    this.dialogRef.close(this.assignment);
  }

  close(): void {
    this.dialogRef.close();
  }

  getActivityTypeName(id: string): string {
    // Aquí implementas la lógica para obtener el nombre del tipo de actividad
    return 'Nombre del tipo de actividad';
  }
}
