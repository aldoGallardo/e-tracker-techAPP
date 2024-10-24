import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { MenuComponent } from './menu/menu.component';
import { NotificationComponent } from './notification/notification.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MenuComponent,
    NotificationComponent,
  ],
})
export class HomeComponent implements OnInit {
  userName: string | null = null;
  assignments: any[] = [];
  activityTypes: { [key: string]: string } = {}; // Definimos activityTypes
  isMenuOpen = false;
  hasCheckedIn = false;
  notificationMessage: string | null = null; // Para el componente de notificación
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadUserData();
    this.loadActivityTypes(); // Cargar nombres de tipos de actividad
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  private loadUserData(): void {
    const uid = this.authService.getUID();
    if (!uid) return;
    this.apiService.getUserData(uid).subscribe({
      next: (data) => (this.userName = data.name || 'Usuario'),
      error: (error) =>
        console.error('Error obteniendo los datos del usuario:', error),
    });
  }

  private showToast(message: string): void {
    this.notificationMessage = message;
    // Aquí puedes agregar lógica para mostrar la notificación
  }

  async markAttendance(): Promise<void> {
    const uid = this.authService.getUID();
    if (!uid) {
      this.showToast('Usuario no autenticado.');
      return;
    }

    try {
      const currentTime = Date.now();
      const currentLocation = await this.apiService.getCurrentLocation();
      await this.apiService
        .markAttendance(uid, { currentTime, currentLocation })
        .toPromise();
      this.showToast('Asistencia marcada exitosamente');
      this.hasCheckedIn = true; // Asegúrate de que se muestra la tabla
      this.loadAssignments(uid, true, false, false, false); // Cargar asignaciones
    } catch (error: any) {
      console.error('Error al marcar asistencia:', error);
      this.showToast(
        error.error?.message || 'Ubicación no válida para marcar asistencia'
      );
    }
  }

  private loadAssignments(
    identifier: string,
    isGlobal: boolean,
    isBranch: boolean,
    isUser: boolean,
    isAssignment: boolean
  ): void {
    console.log(`Solicitando asignaciones con identifier: ${identifier}`);
    this.apiService
      .getAssignments(identifier, isGlobal, isBranch, isUser, isAssignment)
      .subscribe({
        next: (data) => {
          this.assignments = data;
          this.loadActivityTypes();
        },
        error: (error) =>
          console.error('Error al cargar las asignaciones:', error),
      });
  }

  private loadActivityTypes(): void {
    this.assignments.forEach((assignment) => {
      const id = assignment.activityType;
      if (!this.activityTypes[id]) {
        this.apiService.getActivityType(id).subscribe({
          next: (data) => {
            this.activityTypes[id] = data.name;
          },
          error: (error) =>
            console.error(
              `Error al cargar el nombre del tipo de actividad: ${error}`
            ),
        });
      }
    });
  }

  get pendingAssignments() {
    return this.assignments.filter((a) => a.status === 'pending');
  }

  get completedAssignments() {
    return this.assignments.filter((a) => a.status === 'completed');
  }

  startAssignment(assignment: any): void {
    const timestamp = new Date().toISOString();
    console.log(`Iniciando asignación: ${assignment.name} a las ${timestamp}`);
    this.showToast(`Asignación "${assignment.name}" iniciada.`);
  }

  viewAssignment(assignment: any): void {
    const dialogRef = this.dialog.open(AssignmentDetailComponent, {
      data: assignment,
    });
    console.log(`Viendo detalles de la asignación: ${assignment.name}`);
    // Aquí puedes agregar la lógica para ver detalles de la asignación.
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.showToast('Sesión cerrada correctamente.');
      location.href = '/';
    });
  }

  getActivityTypeName(id: string): string {
    return this.activityTypes[id] || id;
  }
}
