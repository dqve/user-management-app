import { Component } from '@angular/core';
import { AuthPage } from '../layouts/authoff.component';
import { RouterOutlet } from '@angular/router';///authpage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthPage],
  host: {
    class: ''
  },
  template: `
  <user-management-auth/>
  `
})

export class AuthComponent {
  title = 'user-management';
}
