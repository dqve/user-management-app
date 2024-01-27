// Import statements for Angular and third-party libraries
import { Component, computed, inject, signal } from '@angular/core';
import { radixCheck, radixChevronDown } from '@ng-icons/radix-icons';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NgIf } from '@angular/common';
import { InputErrorComponent } from '../../shared/input-error.component';

// Type definition for the Framework object
type Framework = { label: string; value: string };

// Angular Component decorator
@Component({
  selector: 'user-management-login',
  standalone: true,
  // Importing necessary Angular directives and components
  imports: [
    NgIf,
    HlmIconComponent,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    HlmPopoverContentDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCardFooterDirective,
    HlmSpinnerComponent,
    HlmButtonDirective,
    FormsModule,
    RouterLink,
    SignalInputDirective,
    HttpClientModule
  ],
  // Providing icons and error component for the component
  providers: [provideIcons({ radixCheck, radixChevronDown }), withErrorComponent(InputErrorComponent)],
  // Template URL for the HTML associated with this component
  templateUrl: './login.component.html',
})

// Angular Component class for the login component
export class LoginComponent {
 
  // Constructor injecting necessary services
  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  // Injecting SignalFormBuilder to create reactive forms
  private _sfb = inject(SignalFormBuilder);

  // Signal for managing the state of the login component
  public state = signal<{
    status: 'idle' | 'loading' | 'success' | 'error';
    error: unknown | null;
    updatedFrom: 'initial' | 'create' | 'delete';
    idBeingDeleted?: number;
  }>({
    status: 'idle',
    error: null,
    updatedFrom: 'initial',
  });

  // Computed property to determine if the form is in a loading state during user creation
  public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');

  // Signal for tracking the currently selected framework
  public currentFramework = signal<Framework | undefined>(undefined);

  // Reactive form definition using SignalFormBuilder
  public form = this._sfb.createFormGroup(() => ({
    email: this._sfb.createFormField<string>('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Kindly provide your registered email address.',
        },
      ],
    }),
    password: this._sfb.createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Kindly provide your registered password',
        },
      ],
    }),
  }));

  // Method to handle user login
  public loginUser() {
    // Check if the form is valid
    if (this.form.state() !== 'VALID') {
      this.form.markAllAsTouched();
      return;
    }

    // Extract email and password from the form
    const { email, password } = this.form.value();

    // Set the state to loading
    this.state.set({ ...this.state(), status: "loading" });
    this.state.set({ ...this.state(), updatedFrom: "create" });

    // Call the login service to authenticate the user
    this.authService.login({ email, password}).subscribe(
      (response) => {
        // Handle success
        this.state.set({ ...this.state(), status: "success", updatedFrom: "initial" });

        // Reset the form after successful login
        this.form.reset();
      },
      (error) => {
        // Handle error
        console.error('Error logging in user:', error);

        // Set the state to error
        this.state.set({ ...this.state(), status: "error", updatedFrom: "initial" });
      }
    );
  }
}
