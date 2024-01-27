import { Component } from '@angular/core';
import {
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
} from '@spartan-ng/ui-card-helm';
import {
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

@Component({
    selector: 'user-management-table-skeleton',
    standalone: true,
    host: {
        class: 'block',
    },
    hostDirectives: [HlmCardDirective],
    imports: [
        HlmCardContentDirective,
        HlmCardDescriptionDirective,
        HlmCardFooterDirective,
        HlmCardHeaderDirective,
        HlmSkeletonComponent,
        HlmTableComponent,
        HlmTrowComponent,
        HlmThComponent,
        HlmTdComponent,
        HlmCaptionComponent
    ],
    template: `
		<!-- <div hlmCardHeader class="bg-none flex">
			<hlm-skeleton class="h-[40px] w-[110px]" />
			<hlm-skeleton hlmCardDescription class="h-[40px] w-[110px]" />
		</div>
		<div hlmCardContent class="flex flex-col space-y-2">
			<hlm-skeleton class="h-[25px] w-full" />
			<hlm-skeleton class="h-[25px] w-full" />
		</div>
		<div hlmCardFooter class="justify-end">
			<hlm-skeleton class="h-[40px] w-[110px]" />
		</div> -->
        <hlm-table class="w-full min-w-[400px] h-[335px] bg-slate-50 text-slate-900 dark:text-slate-50 dark:bg-slate-900">
      <hlm-caption><hlm-skeleton/></hlm-caption>
      <hlm-trow>
        <hlm-th class="w-52"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-60"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="flex-1"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-end"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-center"><hlm-skeleton class="h-[40px] w-[40px]" /></hlm-th>
      </hlm-trow>
      <hlm-trow>
        <hlm-th class="w-52"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-60"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="flex-1"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-end"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-center"><hlm-skeleton class="h-[40px] w-[40px]" /></hlm-th>
      </hlm-trow>
      <hlm-trow>
        <hlm-th class="w-52"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-60"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="flex-1"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-end"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-th>
        <hlm-th class="w-40 justify-center"><hlm-skeleton class="h-[40px] w-[40px]" /></hlm-th>
      </hlm-trow>
        <hlm-trow>
          <hlm-td truncate class="w-52 font-medium"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-td>
          <hlm-td class="w-60"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-td>
          <hlm-td class="flex-1"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-td>
          <hlm-td class="w-40 justify-end"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-td>
        <hlm-td class="w-40 justify-center"><hlm-skeleton class="h-[40px] w-[40px]" /></hlm-td>
        </hlm-trow>
      <hlm-trow class="bg-muted/50 hover:bg-muted">
        <hlm-td truncate class="w-[100px] font-semibold"><hlm-skeleton class="h-[40px] w-[110px]" /></hlm-td>
        <hlm-td class="w-40"></hlm-td>
        <hlm-td class="flex-1"></hlm-td>
        <hlm-td class="w-40"></hlm-td>
        <hlm-td class="w-40 justify-end"><hlm-skeleton/></hlm-td>
      </hlm-trow>
    </hlm-table>
	`,
})
export class TableSkeletonComponent { }