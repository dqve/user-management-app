
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

type Framework = { label: string; value: string };

@Component({
  selector: 'user-management-login',
  // standalone: true,
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
  providers: [provideIcons({ radixCheck, radixChevronDown }), withErrorComponent(InputErrorComponent)],
  templateUrl: './login.component.html',
})
export class LoginComponent {
 
  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  private _sfb = inject(SignalFormBuilder);

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

  public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');

  public currentFramework = signal<Framework | undefined>(undefined);


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


  public loginUser() {
    if (this.form.state() !== 'VALID') {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value();

    this.state.set({ ...this.state(), status: "loading" });
    this.state.set({ ...this.state(), updatedFrom: "create" });

    this.authService.login({ email, password}).subscribe(
      (response) => {
        // Handle success
        this.state.set({ ...this.state(), status: "success", updatedFrom: "initial" });

        this.form.reset();
      },
      (error) => {
        // Handle error
        console.error('Error logging in user:', error);

        this.state.set({ ...this.state(), status: "error", updatedFrom: "initial" });
      }
    );

  }

}
