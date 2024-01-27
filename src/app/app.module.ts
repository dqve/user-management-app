import { BrowserModule } from '@angular/platform-browser';  
import { NgModule, importProvidersFrom } from '@angular/core';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { ToastrModule } from 'ngx-toastr';  
import { AppComponent } from './app.component';  

@NgModule({  
  imports: [  
    BrowserModule,  
    BrowserAnimationsModule,  
    ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: "toast-top-center",
      }),  
  ],  
  providers: [importProvidersFrom(ToastrModule),],   
})  
export class AppModule { }  