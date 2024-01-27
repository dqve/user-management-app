import { Component } from '@angular/core';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
	selector: 'user-management-table-empty',
	standalone: true,
	host: {
		class: 'block h-[100%]',
	},
	hostDirectives: [
		{
			directive: HlmCardDirective,
			inputs: ['class'],
		},
	],
	imports: [HlmCardContentDirective, HlmCardDescriptionDirective, HlmCardHeaderDirective, HlmCardTitleDirective],
	template: `
		<div hlmCardContent class="flex h-[335px] m-auto flex-col items-center justify-center bg-slate-50 text-slate-900 dark:text-slate-50 dark:bg-slate-900">
			<h3 hlmCardTitle>No data yet!</h3>
			<p hlmCardDescription>Add a new one and see them appear here...</p>
		</div>
	`,
})
export class TableEmptyComponent {}