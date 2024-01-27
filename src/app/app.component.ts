import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
// import { Authpage } from './components/layouts/authoff.component';
import { RouterOutlet } from '@angular/router';///authpage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet],
  host: {
    class: 'block h-full bg-slate-50 text-slate-900 dark:text-slate-50 dark:bg-slate-900',
  },
  template: `
  <router-outlet></router-outlet>
  `
})

export class AppComponent {
  title = 'user-management';
}
