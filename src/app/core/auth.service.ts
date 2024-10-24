import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  async login(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      sessionStorage.setItem('uid', uid);
      console.log('UID guardado en sessionStorage:', uid);
      return uid;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw this.getErrorMessage(error);
      }
      throw 'Ocurrió un error inesperado.';
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      sessionStorage.removeItem('uid');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getUID(): string | null {
    return sessionStorage.getItem('uid');
  }

  private getErrorMessage(error: FirebaseError): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/user-not-found':
        return 'No existe un usuario con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      default:
        return 'Ocurrió un error en la autenticación.';
    }
  }
}
