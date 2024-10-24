// src/app/core/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000'; // URL base de tu API

  // Obtener los datos del usuario por UID
  getUserData(uid: string): Observable<any> {
    const url = `${this.baseUrl}/users/${uid}`; // Endpoint completo
    return this.http.get<any>(url);
  }

  getAssignments(userId: string): Observable<any> {
    const params = new HttpParams().set('filter', `userId=${userId}`);
    return this.http.get<any>(`${this.baseUrl}/assignments`, { params });
  }

  getActivityType(activityTypeId: string): Observable<any> {
    const url = `${this.baseUrl}/activity-types/${activityTypeId}`;
    return this.http.get<any>(url);
  }

  // Marcar asistencia del usuario
  markAttendance(
    userId: string,
    data: {
      currentTime: number;
      currentLocation: { latitude: number; longitude: number };
    }
  ): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/assistance`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<any>(url, data, { headers });
  }

  // Obtener la ubicación actual del usuario
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });
  }
}
