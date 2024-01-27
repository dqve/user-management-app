import { Component, inject, signal } from '@angular/core';
import { LoginComponent } from '../../pages/login/login.component';
import { SignUpComponent } from '../../pages/signup/signup.component';
import { RouterOutlet } from '@angular/router';
import { MobileAuthPage } from './mobileauthonlayout.component';
import { radixExit, radixSun, radixMoon } from '@ng-icons/radix-icons';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { hlmH2, hlmH4 } from '@spartan-ng/ui-typography-helm';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserlistComponent } from '../../pages/userlist/userlist.component';
import { ThemeService } from '../../../libs/theme/theme.service';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'user-management-authed',
  standalone: true,
  providers: [provideIcons({ radixExit }), provideIcons({ radixSun }), provideIcons({ radixMoon })],
  imports: [MobileAuthPage, LoginComponent, SignUpComponent, RouterOutlet, HlmIconComponent, NgIf, AsyncPipe, UserlistComponent],
  host: {
    class: ''
  },
  template: `
    <div class="h-[100vh]">
      <div
          class=" top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
          <nav class="h-14 flex items-center justify-between px-4">
              <div class=" block flex sm:gap-5 lg:gap-5">
                  <a href="/user-list" target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-2 h-6 w-6">
                          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                      </svg>
                  </a>
      <p class="${hlmH4} ml-3 lg:ml-5">User List</p>
              </div>
              <div class="hidden">
                  <user-management-mobileauthed />
              </div>

              <div class="flex items-start gap-10 justify-center">
                  <!-- <UserNav />
                <ThemeToggle /> -->
                  <button class="flex transition-transform hover:scale-125 align-middle" (click)="toggleTheme()">

                      <div *ngIf="darkMode(); else elseBlock"><hlm-icon name="radixMoon" size="sm"
                              class="cursor-pointer" /></div>
                      <ng-template #elseBlock><hlm-icon name="radixSun" size="sm" class="cursor-pointer" /></ng-template>

                  </button>
                  <button class="flex transition-transform hover:scale-125 align-middle" (click)="logoutUser()">
                      <hlm-icon name="radixExit" size="sm" class="cursor-pointer" />
                  </button>
              </div>
          </nav>
      </div>
                  <h1 class="${hlmH2} mx-5 sm:mx-20 my-10 ">Hi, {{getDetails().name}} 😀</h1>
      <user-management-user-list> </user-management-user-list>
      <!-- <router-outlet></router-outlet> -->
  </div>
    `
})

export class AuthedPage {
  constructor(
    private authService: AuthenticationService
  ) { }

  public getDetails(): any {
    let value = this.authService.getCurrentUser();
    return(value||"there")
  }

  darkMode = signal<boolean>(false);
  private _themeService = inject(ThemeService);

  public toggleTheme(): void {
    this._themeService.toggleDarkMode();
    this.darkMode.set(!this.darkMode())
  }

  public logoutUser(): void {
    this.authService.logout();
  }

}
