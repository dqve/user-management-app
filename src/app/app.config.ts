import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { ToastrModule, provideToastr } from "ngx-toastr";
import { ClipboardModule } from '@angular/cdk/clipboard';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    ClipboardModule,
    importProvidersFrom(ToastrModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideToastr(),
    provideAnimations(),
  ]
};
