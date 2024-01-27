// Import necessary testing modules and components
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { SignalFormBuilder } from 'ng-signal-forms';
import { of } from 'rxjs';

// Describe a test suite for the LoginComponent
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthenticationService;
  let userService: UserService;

  // Before each test, configure the testing module
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, HttpClientModule],
      providers: [AuthenticationService, UserService, SignalFormBuilder],
    }).compileComponents();
  });

  // Before each test, create an instance of the LoginComponent
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  // Test: Ensure that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test: Ensure that the form initializes with default values
  it('should initialize form with default values', () => {
    const form = component.form.value();
    expect(form.email).toBe('');
    expect(form.password).toBe('');
  });

  // Test: Ensure that the form is marked as touched on invalid submission
  it('should mark form as touched on invalid submission', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.loginUser();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  // Test: Ensure that loading status is set and login service is called on valid submission
  it('should set loading status and call login service on valid submission', () => {
    const loginSpy = spyOn(authService, 'login').and.returnValue(of({}));
    (component as any).form.patchValue({
      email: 'test@example.com',
      password: 'securePassword',
    });
    component.loginUser();
    expect(component.state().status).toBe('loading');
    expect(component.state().updatedFrom).toBe('create');
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'securePassword',
    });
  });

  // Test: Ensure that login success is handled appropriately
  it('should handle login success', () => {
    spyOn(authService, 'login').and.returnValue(of({}));
    spyOn(component.state, 'set');
    (component as any).form.patchValue({
      email: 'test@example.com',
      password: 'securePassword',
    });
    component.loginUser();
    expect(component.state.set).toHaveBeenCalledWith({
      status: 'success',
      error: null,
      updatedFrom: 'initial',
    });
    expect(component.form.reset).toHaveBeenCalled();
  });

  // Test: Ensure that login error is handled appropriately
  it('should handle login error', () => {
    const errorResponse = { message: 'Login failed' };
    spyOn(authService, 'login').and.returnValue(of(errorResponse));
    spyOn(console, 'error');
    spyOn(component.state, 'set');
    (component as any).form.patchValue({
      email: 'test@example.com',
      password: 'securePassword',
    });
    component.loginUser();
    expect(component.state.set).toHaveBeenCalledWith({
      status: 'error',
      error: errorResponse,
      updatedFrom: 'initial',
    });
    expect(console.error).toHaveBeenCalledWith('Error logging in user:', errorResponse);
  });
});
