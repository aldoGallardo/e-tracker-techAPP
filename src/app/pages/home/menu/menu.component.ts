import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class MenuComponent {
  @Input() isMenuOpen: boolean = false; // Recibe el estado del menú
  @Output() close = new EventEmitter<void>(); // Emite evento de cierre

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout().then(() => {
      console.log('Sesión cerrada correctamente.');
      location.href = '/';
    });
  }

  closeMenu(): void {
    this.close.emit(); // Emitir evento al cerrar el menú
  }
}
