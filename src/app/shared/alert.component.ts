
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    HlmAlertDescriptionDirective,
    HlmAlertDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixCube, radixCross1 } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { NgIf } from '@angular/common';

@Component({
    selector: 'user-management-alert',
    standalone: true,
    imports: [
        NgIf,
        HlmAlertDirective,
        HlmAlertDescriptionDirective,
        HlmAlertIconDirective,
        HlmAlertTitleDirective,
        HlmIconComponent,
        HlmButtonDirective,
    ],
    providers: [provideIcons({ radixCube }), provideIcons({ radixCross1 })],
    template: `
    <div hlmAlert class="absolute top-1 left-0 right-0 align-center mt-10 mx-8 xl:mx-auto w-fit h-fit" >

    <hlm-icon hlmAlertIcon name="radixCube" />

<span hlmAlertTitle class="flex flex-row gap-5 h-full items-start justify-between"> 
<h4 >{{ title }}</h4>
<button  hlmAlertIcon class="pl-2 pb-2 cursor-pointer m-0" variant="ghost" size="icon" (click)="closeClick()">
<hlm-icon hlmAlertIcon name="radixCross1" />
</button>
</span>
<div hlmAlertDesc>
      <p >
      {{ description }}
      </p>
      <button *ngIf="actionText" hlmBtn variant="outline" size="sm" class="my-2" (click)="actionClick()">
  <span>{{ actionText }}</span>
</button>
      </div>
    </div>
  `,
})

export class AlertComponent {
    @Input() title?: string = "";
    @Input() description?: string = "";
    @Input() actionText?: string = "";

    @Output() onCloseClick = new EventEmitter<string>();

    @Output() onActionClick = new EventEmitter<string>();

    public closeClick(value?: string) {
        this.onCloseClick.emit(value || "");
    }

    public actionClick(value?: string) {
        this.onActionClick.emit(value || "");
    }
}
