// src/app/pages/home/home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule], // Asegúrate de importar CommonModule aquí
})
export class HomeComponent implements OnInit {
  assignments: any[] = [];
  isMenuOpen = false;
  hasCheckedIn = false;

  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit() {
    this.loadAssignments();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  async markAttendance() {
    const uid = this.authService.getUID();
    const timestamp = new Date().toISOString();
    const location = await this.apiService.getCurrentLocation();

    try {
      await this.apiService.markAttendance(uid, timestamp, location);
      alert('Asistencia marcada exitosamente');
      this.hasCheckedIn = true;
    } catch (error) {
      console.error('Error al marcar asistencia:', error);
    }
  }

  async loadAssignments() {
    try {
      this.assignments = await this.apiService.listAssignments(
        this.authService.getUID()
      );
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    }
  }

  startAssignment(assignment: any) {
    const timestamp = new Date().toISOString();
    console.log(`Iniciando asignación: ${assignment.name} a las ${timestamp}`);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
