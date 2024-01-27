
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


import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertComponent } from '../../shared/alert.component';


type Framework = { label: string; value: string };

@Component({
  selector: 'user-management-signup',
  standalone: true,
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

  providers: [provideIcons({ radixCheck, radixChevronDown }), withErrorComponent(InputErrorComponent)],
  templateUrl: `./signup.component.html`

})

export class SignUpComponent {

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private clipboard: Clipboard
  ) { }

  private _sfb = inject(SignalFormBuilder);

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

  public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');

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

  public onActionClick = () => {
    this.clipboard.copy(this.state().response?.id || "");
    this.state.set({ ...this.state(), actionText: "Copied!" });
    setTimeout(() => {
      this.state.set({ ...this.state(), actionText: "Copy ID" });
    }, 1000);
  };

  public currentFramework = signal<Framework | undefined>(undefined);


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
