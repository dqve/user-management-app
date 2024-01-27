// authentication.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
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

  // API base URL from environment
  private apiUrl = `${environment.API_URL}`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastrs: ToastrService
  ) {
    // Initialize the current user subject with data from localStorage
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Method for user login
  login(user: any) {
    return this.http
      .get(`${this.apiUrl}/users/${user?.password || '0'}`, user)
      .pipe(
        tap({
          // react to the result or error
          next: (data: any) => {
            if (data && data?.approved) {
              // Set expiration time for the user's session
              const expirationTime = new Date();
              expirationTime.setMinutes(
                expirationTime.getMinutes() + 30
              ); // Set expiration time to 30 minutes

              // Update the user data in localStorage with expiration time
              localStorage.setItem(
                'currentUser',
                JSON.stringify({ ...data, expiresAt: expirationTime.toISOString() })
              );

              // Handle successful login
              this.handleSuccess('Login successful.', data);

              // Update currentUserSubject and navigate to user-list page
              localStorage.setItem('currentUser', JSON.stringify(data));
              this.currentUserSubject.next(data);
              this.router.navigate(['/user-list']);
            } else {
              // Handle error when user is not approved
              this.handleError({
                error: 'You need to be approved to login.',
                name: 'HttpErrorResponse',
                message: 'User not approved',
                ok: false,
                headers: new HttpHeaders(),
                status: 500,
                statusText: '',
                url: null,
                type: HttpEventType.ResponseHeader,
              });
            }
          },
          // Handle any errors during login
          error: (error) => this.handleError(error.error),
        })
      );
  }

  // Method for user logout
  logout() {
    // Remove current user data from localStorage and update currentUserSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // Navigate to the login page
    this.router.navigate(['/auth/login']);
  }

  // Method to get the current user from currentUserSubject
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Method to check if the current user is an admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.admin;
  }

  // Private method to handle errors during API requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    // Check if the error is an instance of ErrorEvent
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Backend returned an error: ${error.error}`;
      console.error(errorMessage);
    }

    // Display the error message using ToastrService
    this.toastrs.error(errorMessage || error.error);

    // Throw an observable error for the calling component
    return throwError('Something went wrong; please try again later.');
  }

  // Private method to handle success scenarios during API requests
  private handleSuccess(message: string, data: any) {
    // Display success message using ToastrService
    this.toastrs.success(message);
  }
}
