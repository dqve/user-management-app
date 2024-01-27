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

  constructor(private http: HttpClient, private toastrs: ToastrService, private authService: AuthenticationService) { }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData).pipe(
      tap( // react to the result or error
        {
          next: (data) => this.handleSuccess("User creation successful.", data),
          error: (error) => catchError(this.handleError)
        }
      )
    );
  }

  approveUser(user: any): Observable<any> {

    return this.http.put(`${this.apiUrl}/${user?.id || "0"}`,
      {
        ...user,
        status: "success",
        admin: true,
        approved: true
      }).pipe(
        tap( // react to the result or error
          {
            next: (data) => this.handleSuccess("User approved successful.", data),
            error: (error) => catchError(this.handleError)
          }
        )
      )
  }

  deleteUser(user: any): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${user?.id || "0"}`).pipe(
      tap( // react to the result or error
        {
          next: (data) => this.handleSuccess("User deleted successful.", data),
          error: (error) => catchError(this.handleError)
        }
      )
    )
  }



  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap( // react to the result or error
        {
          next: (data) => null,
          error: (error) => catchError(this.handleError)
        }
      )
    );
  }

  public handleError(error: HttpErrorResponse) {

    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred:, ${error.error.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      console.error(errorMessage);
    }

    this.toastrs.error(errorMessage);

    return throwError('Something went wrong; please try again later.');
  }

  public handleSuccess(message: string, data: any) {
    this.toastrs.success(message);
  }
}

