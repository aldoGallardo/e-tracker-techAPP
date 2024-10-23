// src/app/core/api.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  async listAssignments(uid: string | null): Promise<any[]> {
    // Simulación de llamada a API
    return [
      { name: 'Tarea 1', status: 'Pendiente' },
      { name: 'Tarea 2', status: 'En progreso' },
    ];
  }

  async markAttendance(
    uid: string | null,
    timestamp: string,
    location: string
  ) {
    console.log(
      `Asistencia marcada: UID=${uid}, Hora=${timestamp}, Ubicación=${location}`
    );
    // Simula una llamada a tu API.
  }

  async getCurrentLocation(): Promise<string> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(`${position.coords.latitude}, ${position.coords.longitude}`);
      });
    });
  }
}
