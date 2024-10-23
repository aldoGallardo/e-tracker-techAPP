// src/app/pages/login/login.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
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
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  authError = signal<string | null>(null);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    console.log('LoginComponent loaded');
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.authError.set(error.message || 'Ocurrió un error inesperado');
    }
  }
}
