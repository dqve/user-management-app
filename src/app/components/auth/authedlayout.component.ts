import { Component } from '@angular/core';
import { AuthedPage } from '../layouts/authon.component';
import { RouterOutlet } from '@angular/router';///authpage.component';

@Component({
  selector: 'authed-root',
  standalone: true,
  imports: [AuthedPage],
  host: {
    class: ''
  },
  template: `
  <user-management-authed/>
  `
})

export class AuthedComponent {
  title = 'user-management';
}
