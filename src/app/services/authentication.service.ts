// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})


export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private apiUrl = `${environment.API_URL}`;

  constructor(private router: Router, private http: HttpClient, private toastrs: ToastrService) {

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || "{}"));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  login(user: any) {
    return this.http.get(`${this.apiUrl}/users/${user?.password || "0"}`, user).pipe(
      tap( // react to the result or error
        {
          next: (data: any) => {
            
            if (data && data?.approved) {

              const expirationTime = new Date();

              expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Set expiration time to 30 minutes

              localStorage.setItem('currentUser', JSON.stringify({ ...data, expiresAt: expirationTime.toISOString() }));
              
              this.handleSuccess("Login successful.", data);
              localStorage.setItem('currentUser', JSON.stringify(data));
              this.currentUserSubject.next(data);
              this.router.navigate(['/user-list']);
            } else {
              this.handleError({
                error: "You need to be approved to login.",
                name: 'HttpErrorResponse',
                message: 'User not approved',
                ok: false,
                headers: new HttpHeaders,
                status: 500,
                statusText: '',
                url: null,
                type: HttpEventType.ResponseHeader
              })
            }
          },
          error: (error) => this.handleError(error.error)
        }
      )
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.admin;
  }


  private handleError(error: HttpErrorResponse) {

    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Backend returned an error: ${error.error}`;
      console.error(errorMessage);
    }

    this.toastrs.error(errorMessage || error.error);

    return throwError('Something went wrong; please try again later.');
  }

  private handleSuccess(message: string, data: any) {
    this.toastrs.success(message);
  }
}
