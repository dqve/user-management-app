// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environment/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.API_URL}/users`;

  constructor(
    private http: HttpClient,
    private toastrs: ToastrService,
    private authService: AuthenticationService
  ) { }

  // Method to create a new user
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData).pipe(
      tap({
        // react to the result or error
        next: (data) => this.handleSuccess('User creation successful.', data),
        // Handle any errors during user creation
        error: (error) => catchError(this.handleError)
      })
    );
  }

  // Method to approve a user
  approveUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user?.id || '0'}`, {
      ...user,
      status: 'success',
      admin: true,
      approved: true
    }).pipe(
      tap({
        // react to the result or error
        next: (data) => this.handleSuccess('User approved successful.', data),
        // Handle any errors during user approval
        error: (error) => catchError(this.handleError)
      })
    );
  }

  // Method to delete a user
  deleteUser(user: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${user?.id || '0'}`).pipe(
      tap({
        // react to the result or error
        next: (data) => this.handleSuccess('User deleted successful.', data),
        // Handle any errors during user deletion
        error: (error) => catchError(this.handleError)
      })
    );
  }

  // Method to get a list of users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap({
        // react to the result or error
        next: (data) => null, // Optionally react to the user data (currently set to null)
        // Handle any errors during fetching user data
        error: (error) => catchError(this.handleError)
      })
    );
  }

  // Public method to handle errors during API requests
  public handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    // Check if the error is an instance of ErrorEvent
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred:, ${error.error.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      console.error(errorMessage);
    }

    // Display the error message using ToastrService
    this.toastrs.error(errorMessage);

    // Throw an observable error for the calling component
    return throwError('Something went wrong; please try again later.');
  }

  // Public method to handle success scenarios during API requests
  public handleSuccess(message: string, data: any) {
    // Display success message using ToastrService
    this.toastrs.success(message);
  }
}
