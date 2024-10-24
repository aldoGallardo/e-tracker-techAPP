import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  imports: [CommonModule],
})
export class NotificationComponent {
  @Input() message: string | null = null;

  closeNotification(): void {
    this.message = null;
  }
}
