import { Dialog } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-detail.component.html',
})
export class AssignmentDetailComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AssignmentDetailComponent>);
  private data = inject(MAT_DIALOG_DATA);
  assignment: any = null;
  ngOnInit(): void {
    this.assignment = this.data;
    console.log('Data:', this.data);
    // Implementación
  }
}
