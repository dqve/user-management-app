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
import { Clipboard } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { Observable, Subject, catchError, of, switchMap, take, tap } from 'rxjs';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { NgIf } from '@angular/common';
import { InputErrorComponent } from '../../shared/input-error.component';

// Additional imports for services and components
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertComponent } from '../../shared/alert.component';

// Type definition for the Framework object
type Framework = { label: string; value: string };

// Angular Component decorator
@Component({
  selector: 'user-management-signup',
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
    HttpClientModule,
    AlertComponent
  ],
  // Providing icons and error component for the component
  providers: [provideIcons({ radixCheck, radixChevronDown }), withErrorComponent(InputErrorComponent)],
  // Template URL for the HTML associated with this component
  templateUrl: `./signup.component.html`
})

// Angular Component class for the signup component
export class SignUpComponent {

  // Constructor injecting necessary services
  constructor(
    public userService: UserService,
    public authService: AuthenticationService,
    private clipboard: Clipboard
  ) { }

  // Injecting SignalFormBuilder to create reactive forms
  private _sfb = inject(SignalFormBuilder);

  // Signal for managing the state of the signup component
  public state = signal<{
    alert: boolean;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: unknown | null;
    updatedFrom: 'initial' | 'create' | 'delete';
    response?: any;
    title?: string;
    description?: string;
    actionText?: string;
  }>({
    alert: false,
    status: 'idle',
    error: null,
    updatedFrom: 'initial',
    response: {},
    title: '',
    description: '',
    actionText: '',
  });

  // Computed property to determine if the form is in a loading state during user creation
  public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');

  // Callback for closing the alert
  public onCloseClick = () => {
    this.state.set({
      ...this.state(),
      alert: false,
      updatedFrom: "create",
      actionText: "",
      title: '',
      description: ''
    });
  };

  // Callback for copying the ID to clipboard
  public onActionClick = () => {
    this.clipboard.copy(this.state().response?.id || "");
    this.state.set({ ...this.state(), actionText: "Copied!" });
    setTimeout(() => {
      this.state.set({ ...this.state(), actionText: "Copy ID" });
    }, 1000);
  };

  // Signal for tracking the currently selected framework
  public currentFramework = signal<Framework | undefined>(undefined);

  // Reactive form definition using SignalFormBuilder
  public form = this._sfb.createFormGroup(() => ({
    email: this._sfb.createFormField<string>('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Your email is necessary to sign up.',
        },
      ],
    }),
    name: this._sfb.createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Make sure to provide enter your name.',
        },
      ],
    }),
    password: this._sfb.createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Kindly add a secure password',
        },
      ],
    }),
  }));

  // Method to handle user creation (signup)
  public createUser() {
    if (this.form.state() !== 'VALID') {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.value();

    this.state.set({ ...this.state(), status: "loading", updatedFrom: "create" });

    this.userService.createUser({ name, email, password, admin: false, approved: false, status: "pending" }).subscribe(
      (response) => {
        // Handle success

        // Automatically log in the user upon successful signup
        this.authService.login(response);

        this.state.set({
          ...this.state(),
          response: response,
          alert: true,
          status: "success",
          updatedFrom: "initial",
          title: "Welcome onboard",
          description: `Here is your Secure User ID: ${response?.id} ensure to store it securely, \n you will need this to login afterwards.`,
          actionText: "Copy ID"
        });

        this.form.reset();
      },
      (error) => {
        // Handle error
        console.error('Error creating user:', error);

        this.state.set({ ...this.state(), status: "error", updatedFrom: "initial" });
      }
    );
  }
}
