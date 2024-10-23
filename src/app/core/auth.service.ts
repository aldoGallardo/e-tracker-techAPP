// src/app/core/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  async login(email: string, password: string): Promise<string> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    localStorage.setItem('uid', uid); // Guarda el UID en localStorage
    return uid;
  }

  logout() {
    localStorage.removeItem('uid'); // Elimina el UID de localStorage
  }

  getUID(): string | null {
    return localStorage.getItem('uid');
  }
}
