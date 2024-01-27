// Import necessary modules for testing
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SignUpComponent } from './signup.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { provideIcons } from '@spartan-ng/ui-icon-helm';
import { InputErrorComponent } from '../../shared/input-error.component';
import { AlertComponent } from '../../shared/alert.component';
import { SignalFormBuilder } from 'ng-signal-forms';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// Mock data for testing
const mockUser = {
  id: 'mockUserId',
  name: 'Mock User',
  email: 'mock@example.com',
  password: 'mockPassword',
};

// Mock services for testing
class MockUserService {
  createUser() {
    // Return a mock observable representing a successful user creation
    return of(mockUser);
  }
}

class MockAuthService {
  login() {
    // Return a mock observable representing a successful login
    return of();
  }
}

describe('SignUpComponent', () => {
  let fixture: ComponentFixture<SignUpComponent>;
  let component: SignUpComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent, InputErrorComponent, AlertComponent],
      providers: [
        SignalFormBuilder,
        NgIf,
        Clipboard,
        provideIcons({}),
        { provide: UserService, useClass: MockUserService },
        { provide: AuthenticationService, useClass: MockAuthService },
      ],
      imports: [FormsModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule],
    });

    // Create component and fixture
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
  });

  it('should create the SignUpComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    // Trigger change detection
    fixture.detectChanges();

    expect(component.form.value().email).toEqual('');
    expect(component.form.value().name).toEqual('');
    expect(component.form.value().password).toEqual('');
  });

  it('should set loading state on createUser method', () => {
    spyOn(component.userService, 'createUser').and.returnValue(of(mockUser));

    component.createUser();

    expect(component.state().status).toEqual('loading');
    expect(component.state().updatedFrom).toEqual('create');
  });

  it('should handle successful user creation', () => {
    spyOn(component.userService, 'createUser').and.returnValue(of(mockUser));
    spyOn(component.authService, 'login').and.returnValue(of());

    component.createUser();

    expect(component.state().status).toEqual('success');
    expect(component.state().updatedFrom).toEqual('initial');
    expect(component.authService.login).toHaveBeenCalledWith(mockUser);
    expect(component.state().alert).toBeTruthy();
  });

  it('should handle error during user creation', () => {
    spyOn(component.userService, 'createUser').and.throwError('Mock error');

    component.createUser();

    expect(component.state().status).toEqual('error');
    expect(component.state().updatedFrom).toEqual('initial');
    expect(component.state().alert).toBeFalsy();
  });

  it('should close alert on onCloseClick', () => {
    component.onCloseClick();

    expect(component.state().alert).toBeFalsy();
  });

  it('should copy ID to clipboard on onActionClick', () => {
    spyOn((component as any).clipboard, 'copy');

    component.state.set({ ...component.state(), response: { id: 'testId' } });
    component.onActionClick();

    expect((component as any).clipboard.copy).toHaveBeenCalledWith('testId');
    expect(component.state().actionText).toEqual('Copied!');
  });

  it('should reset form on successful user creation', () => {
    spyOn(component.userService, 'createUser').and.returnValue(of(mockUser));
    spyOn(component.authService, 'login').and.returnValue(of());

    (component as any).form.setValue({ email: 'test@example.com', name: 'Test User', password: 'testPassword' });
    component.createUser();

    // Check if form is reset
    expect(component.form.value().email).toEqual('');
    expect(component.form.value().name).toEqual('');
    expect(component.form.value().password).toEqual('');
  });

  it('should mark form as touched if invalid on createUser', () => {
    spyOn(component.userService, 'createUser').and.returnValue(of());

    component.createUser();

    // Check if form is marked as touched
    expect(component.form.touched).toBeTruthy();
  });

  it('should display error message if form is invalid', () => {
    // Trigger change detection
    fixture.detectChanges();

    const createUserButton = fixture.debugElement.query(By.css('.create-user-button')).nativeElement;
    createUserButton.click();

    // Check if error message is displayed
    const errorMessage = fixture.debugElement.query(By.css('.error-message')).nativeElement;
    expect(errorMessage.textContent).toContain('Your email is necessary to sign up.');
  });
});
