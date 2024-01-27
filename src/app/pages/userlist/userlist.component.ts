import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { radixCaretSort, radixChevronDown, radixDotsHorizontal } from '@ng-icons/radix-icons';
import { HlmButtonDirective, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxCheckIconComponent, HlmCheckboxDirective } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';
import { UserService } from '../../services/user.service';
import { TableSkeletonComponent } from '../../shared/table-skeleton.component';
import { TableEmptyComponent } from '../../shared/table-empty.component';
import { AlertDialogComponent } from '../../shared/alert-dialog.component';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpEventType, HttpHeaders } from '@angular/common/http';

export type Userlist = {
  id: string;
  amount?: number;
  status: 'pending' | 'success' | 'failed';
  email: string;
  name: string;
  admin: boolean;
};

const USER_DATA: Userlist[] = [];

@Component({
  selector: 'user-management-user-list',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,
    HlmButtonDirective,

    HlmCheckboxCheckIconComponent,
    HlmCheckboxDirective,
    HlmSpinnerComponent,

    TableSkeletonComponent,
    TableEmptyComponent,
    AlertDialogComponent
  ],
  providers: [provideIcons({ radixChevronDown, radixDotsHorizontal, radixCaretSort })],
  host: {
    class: 'w-full sm:m-20 m-5',
  },
  templateUrl: './userlist.component.html',

})


export class UserlistComponent {


  constructor(private userService: UserService, private authService: AuthenticationService) {

    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });

  }

  public state = signal<{
    status: 'idle' | 'loading' | 'success' | 'error';
    error: unknown | null;
  }>({
    status: 'idle',
    error: null,
  });

  public initialLoad = computed(() => this.state().status === 'idle' || this.state().status === 'loading');

  public noUsers = computed(() => (this._users().length === 0 ? this.state().status !== 'success' ? true : true : false));

  ngOnInit() {
    this.fetchUser()
  }



  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Userlist>(true);
  protected readonly _isUserlistSelected = (user: Userlist) => this._selectionModel.isSelected(user);
  protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
    initialValue: [],
  });

  protected readonly _brnColumnManager = useBrnColumnManager({
    name: true,
    admin: true,
    email: true,
    status: true,
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _users = signal(USER_DATA);


  private readonly _filteredUserlists = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._users().filter((u) => u.email.toLowerCase().includes(emailFilter));
    }
    return this._users();
  });
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedUserlists = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const users = this._filteredUserlists();
    if (!sort) {
      return users.slice(start, end);
    }
    return [...users]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedUserlistsSelected = computed(() =>
    this._filteredSortedPaginatedUserlists().every((user) => this._selected().includes(user)),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedUserlistsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Userlist> = (_: number, p: Userlist) => p.id;
  protected readonly _totalElements = computed(() => this._filteredUserlists().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected toggleUserlist(user: Userlist) {
    this._selectionModel.toggle(user);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedUserlists());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedUserlists());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }


  public approveUser(element: any) {
    this.state.set({ ...this.state(), status: "loading", error: null });


    const currentUser = this.authService.getCurrentUser();

    if (currentUser && (element?.id || 0) - currentUser?.id < 2 && (element?.id || 0) !== currentUser?.id) {

      if (!element?.approved) {
        this.userService.approveUser(element).subscribe(
          (response) => {
            // Handle success
            this.state.set({ ...this.state(), status: "success", error: null });
            this.fetchUser();
          },
          (error) => {
            // Handle error
            this.state.set({ ...this.state(), status: "error", error: "An error occurred while performing action." });
            console.error('Error approving users:', error);
          }
        );
      } else {
        this.userService.handleSuccess("User alrready approved.", element)
      }
    } else {
      this.userService.handleError({
        error: "You don't have the access to approve this user.",
        name: 'HttpErrorResponse',
        message: 'Action not permitted',
        ok: false,
        headers: new HttpHeaders,
        status: 500,
        statusText: '',
        url: null,
        type: HttpEventType.ResponseHeader
      })
    }
  }

  public deleteUser(element: any) {
    this.state.set({ ...this.state(), status: "loading", error: null });

    const currentUser = this.authService.getCurrentUser();

    if (currentUser && (element?.id || 0) - currentUser?.id < 2 && (element?.id || 0) !== currentUser?.id) {

      if (element) {
        this.userService.deleteUser(element).subscribe(
          (response) => {
            // Handle success
            this.state.set({ ...this.state(), status: "success", error: null });
            this.fetchUser();
          },
          (error) => {
            // Handle error
            this.state.set({ ...this.state(), status: "error", error: "An error occurred while performing action." });
            console.error('Error deleting users:', error);
          }
        );
      } else {
        this.userService.handleSuccess("User already deleted.", element)
      }
    } else {
      this.userService.handleError({
        error: "You don't have the access to deleting this user.",
        name: 'HttpErrorResponse',
        message: 'Action not permitted',
        ok: false,
        headers: new HttpHeaders,
        status: 500,
        statusText: '',
        url: null,
        type: HttpEventType.ResponseHeader
      })
    }
  }

  public fetchUser() {
    this.state.set({ ...this.state(), status: "loading", error: null });
    this.userService.getUsers().subscribe(
      (users) => {
        // Handle success
        this._users.set(users);
        this.state.set({ ...this.state(), status: "success", error: null });
      },
      (error) => {
        // Handle error
        this.state.set({ ...this.state(), status: "error", error: "An error occurred while fetching data." });
        console.error('Error fetching users:', error);
      }
    )
  }

}
