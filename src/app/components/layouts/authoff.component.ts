import { Component, inject, signal } from '@angular/core';
import { LoginComponent } from '../../pages/login/login.component';
import { SignUpComponent } from '../../pages/signup/signup.component';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../../libs/theme/theme.service';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { NgIf } from '@angular/common';
import { radixMoon, radixSun } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'user-management-auth',
  standalone: true,
  providers: [provideIcons({ radixSun }), provideIcons({ radixMoon })],
  imports: [LoginComponent, SignUpComponent, HlmIconComponent, RouterOutlet, NgIf, HlmButtonDirective,],
  host: {
    class: ''
  },
  template: `
    <div class="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div class="absolute inset-0 bg-slate-900"></div>
        <div class="relative z-20 flex items-center text-lg font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-2 h-6 w-6">
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            User Management App
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &ldquo;This application is my sumbission for a task assignment, but if you're not here to
                    <i>"evaluate"</i>,
                    be my guest and play around a bit! &rdquo;
                </p>
                <footer class="text-sm">David Ayoola</footer>
            </blockquote>
        </div>
    </div>

    <div class="p-4 lg:p-8 h-full flex items-center relative align-center">

        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <button variant="secondary" hlmBtn
                class="absolute transition-transform hover:scale-125 text-center top-10 right-10 border border-border text-foreground"
                (click)="toggleTheme()">

                <div *ngIf="darkMode(); else elseBlock"><hlm-icon name="radixMoon" size="sm" class="cursor-pointer" />
                </div>
                <ng-template #elseBlock><hlm-icon name="radixSun" size="sm" class="cursor-pointer" /></ng-template>

            </button>
            <!-- <user-management-login/>
            <user-management-signup/> -->
            <router-outlet></router-outlet>
            <p class="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our&nbsp;
                <a href="/terms" class="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </a> &nbsp;
                and &nbsp;
                <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    </div>
    </div>
  `
})

export class AuthPage {

  darkMode = signal<boolean>(false);
  private _themeService = inject(ThemeService);

  public toggleTheme(): void {
    this._themeService.toggleDarkMode();
    this.darkMode.set(!this.darkMode())
  }
}
