// authentication.service.spec.ts
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { environment } from '../../environment/environment';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Router, useValue: {} },
        { provide: ToastrService, useValue: { success: () => {} } },
        UserService,
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should log in the user and navigate to /user-list on success', fakeAsync(() => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');
      const toastrService = TestBed.inject(ToastrService);
      const successSpy = spyOn(toastrService, 'success');

      const mockUser = { email: 'test@example.com', password: 'password' };

      // Mock successful response
      service.login(mockUser).subscribe(() => {
        // Expectations on successful login
        expect(successSpy).toHaveBeenCalledWith('Login successful.');
        expect(navigateSpy).toHaveBeenCalledWith(['/user-list']);
      });

      const req = httpTestingController.expectOne(`${environment.API_URL}/users/0`);
      expect(req.request.method).toBe('GET');
      req.flush({ approved: true, /* other user data */ });

      // Advance the fakeAsync timer
      tick();

      // Clear the localStorage
      localStorage.clear();
    }));

    it('should handle error when user is not approved', fakeAsync(() => {
      const toastrService = TestBed.inject(ToastrService);
      const errorSpy = spyOn(toastrService, 'error');

      const mockUser = { email: 'test@example.com', password: 'password' };

      // Mock response with unapproved user
      service.login(mockUser).subscribe(
        () => fail('Should not reach here'),
        (error) => {
          // Expectations on error handling
          expect(errorSpy).toHaveBeenCalledWith('You need to be approved to login.');
        }
      );

      const req = httpTestingController.expectOne(`${environment.API_URL}/users/0`);
      expect(req.request.method).toBe('GET');
      req.flush({ approved: false, /* other user data */ });

      // Advance the fakeAsync timer
      tick();

      // Clear the localStorage
      localStorage.clear();
    }));
  });

  // Add more test cases for logout, getCurrentUser, isAdmin, handleError, handleSuccess, etc.
  // ...

  describe('logout', () => {
    it('should log out the user and navigate to /auth/login', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');

      // Log in a user to be logged out
      service['currentUserSubject'].next({ /* user data */ });

      // Log out
      service.logout();

      // Expectations on logout
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
      expect(service['currentUserSubject'].value).toBeNull();
    });
  });
});
