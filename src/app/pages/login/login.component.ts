import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email = '';
  password = '';
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  authError = signal<string | null>(null);
  private authService = inject(AuthService);
  private router = inject(Router);

  async login() {
    this.emailError.set(null);
    this.passwordError.set(null);
    this.authError.set(null);

    if (!this.email.trim()) {
      this.emailError.set('El correo electrónico es obligatorio.');
    }
    if (!this.password) {
      this.passwordError.set('La contraseña es obligatoria.');
    }
    if (this.emailError() || this.passwordError()) {
      return;
    }

    try {
      const uid = await this.authService.login(this.email, this.password);
      console.log('Login exitoso, UID:', uid);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.authError.set(error);
    }
  }
}
