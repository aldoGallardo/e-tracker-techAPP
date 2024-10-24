import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

declare function showNotification(message: string): void;

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  userName: string | null = null;
  assignments: any[] = [];
  activityTypes: { [key: string]: string } = {}; // Definimos activityTypes
  isMenuOpen = false;
  hasCheckedIn = false;
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

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
    showNotification(message);
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
      this.loadAssignments(); // Cargar asignaciones
    } catch (error: any) {
      console.error('Error al marcar asistencia:', error);
      this.showToast(
        error.error?.message || 'Ubicación no válida para marcar asistencia'
      );
    }
  }

  private loadAssignments(): void {
    const uid = this.authService.getUID();
    if (!uid) return;
    console.log(`Solicitando asignaciones con UID: ${uid}`);
    this.apiService.getAssignments(uid).subscribe({
      next: (data) => {
        this.assignments = data;
        this.loadActivityTypes(); // Cargar tipos de actividad después de cargar asignaciones
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
