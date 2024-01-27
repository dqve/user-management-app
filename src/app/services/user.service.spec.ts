// user.service.spec.ts
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { environment } from '../../environment/environment';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ToastrService, useValue: { success: () => {}, error: () => {} } },
        AuthenticationService,
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    it('should create a user and show success toastr on success', fakeAsync(() => {
      const toastrService = TestBed.inject(ToastrService);
      const successSpy = spyOn(toastrService, 'success');

      const mockUserData = { /* user data */ };

      service.createUser(mockUserData).subscribe(() => {
        // Expectations on successful user creation
        expect(successSpy).toHaveBeenCalledWith('User creation successful.');
      });

      const req = httpTestingController.expectOne(`${environment.API_URL}/users`);
      expect(req.request.method).toBe('POST');
      req.flush({ /* response data */ });

      // Advance the fakeAsync timer
      tick();
    }));

    it('should handle error and show error toastr on failure', fakeAsync(() => {
      const toastrService = TestBed.inject(ToastrService);
      const errorSpy = spyOn(toastrService, 'error');

      const mockUserData = { /* user data */ };

      service.createUser(mockUserData).subscribe(
        () => fail('Should not reach here'),
        () => {
          // Expectations on error handling
          expect(errorSpy).toHaveBeenCalledWith('Something went wrong; please try again later.');
        }
      );

      const req = httpTestingController.expectOne(`${environment.API_URL}/users`);
      expect(req.request.method).toBe('POST');
      req.error(new ErrorEvent('Error'));

      // Advance the fakeAsync timer
      tick();
    }));
  });

  // Similar test cases for approveUser, deleteUser, getUsers, handleError, handleSuccess, etc.
  // ...

  describe('deleteUser', () => {
    it('should delete a user and show success toastr on success', fakeAsync(() => {
      const toastrService = TestBed.inject(ToastrService);
      const successSpy = spyOn(toastrService, 'success');

      const mockUser = { /* user data */ };

      service.deleteUser(mockUser).subscribe(() => {
        // Expectations on successful user deletion
        expect(successSpy).toHaveBeenCalledWith('User deleted successful.');
      });

      const req = httpTestingController.expectOne(`${environment.API_URL}/users/0`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ /* response data */ });

      // Advance the fakeAsync timer
      tick();
    }));

    it('should handle error and show error toastr on failure', fakeAsync(() => {
      const toastrService = TestBed.inject(ToastrService);
      const errorSpy = spyOn(toastrService, 'error');

      const mockUser = { /* user data */ };

      service.deleteUser(mockUser).subscribe(
        () => fail('Should not reach here'),
        () => {
          // Expectations on error handling
          expect(errorSpy).toHaveBeenCalledWith('Something went wrong; please try again later.');
        }
      );

      const req = httpTestingController.expectOne(`${environment.API_URL}/users/0`);
      expect(req.request.method).toBe('DELETE');
      req.error(new ErrorEvent('Error'));

      // Advance the fakeAsync timer
      tick();
    }));
  });
});
