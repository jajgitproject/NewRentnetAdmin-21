// @ts-nocheck
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { RolePageMappingService } from 'src/app/rolePageMapping/rolePageMapping.service';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from 'src/app/core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  applyMenuAccessRecursive,
  buildAccessPagesArrayFromApi,
  denyAllMenuAccess,
} from 'src/app/core/guard/role-page-access.util';
import { RouteInfo } from './sidebar.metadata';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: any[];
  level1Menu = '';
  level2Menu = '';
  level3Menu = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;
  routerObj = null;
  searchText: string;
  /** True when search box has non-whitespace (submenus stay expanded in template + body class). */
  searchingOpen = false;
  firstName: string;
  lastName: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private roleMapService: RolePageMappingService,
    private cdr: ChangeDetectorRef
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currenturl = event.url.split('?')[0];
        this.level1Menu = currenturl.split('/')[1];
        this.level2Menu = currenturl.split('/')[2];

        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callLevel1Toggle(event: any, element: any) {
    if (element === 'Masters') {
      return;
    }
    if (element === this.level1Menu) {
      this.level1Menu = '0';
    } else {
      this.level1Menu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
    }
  }
  callLevel2Toggle(event: any, element: any) {
    if (element === this.level2Menu) {
      this.level2Menu = '0';
    } else {
      this.level2Menu = element;
    }
  }
  callLevel3Toggle(event: any, element: any) {
    if (element === this.level3Menu) {
      this.level3Menu = '0';
    } else {
      this.level3Menu = element;
    }
  }
  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
      denyAllMenuAccess(this.sidebarItems);
      this.getPagesAccessRoleWise(this.authService.currentUserValue.employee.RoleID);
    }
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
    this.firstName = this.authService.currentUserValue.employee.FirstName;
    this.lastName = this.authService.currentUserValue.employee.LastName;
  }

  getPagesAccessRoleWise(roleID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roleMapService.getTableData(null, roleID, true, 0).subscribe(
        (data) => {
          const accessPagesArray = buildAccessPagesArrayFromApi(data || []);
          localStorage.setItem('accessPages', JSON.stringify(accessPagesArray));
          applyMenuAccessRecursive(this.sidebarItems, accessPagesArray);
          this.cdr.markForCheck();
          resolve();
        },
        (error) => {
          console.error('Error fetching role-wise access pages:', error);
          localStorage.setItem('accessPages', JSON.stringify([]));
          denyAllMenuAccess(this.sidebarItems);
          this.cdr.markForCheck();
          reject(error);
        }
      );
    });
  }

  /** Level-2 rows: any accessible leaf under the node, then search. */
  visibleLevel2(sidebarItem: RouteInfo): RouteInfo[] {
    const raw = sidebarItem?.submenu || [];
    const acc = raw.filter((sub) => this.subtreeHasAccessibleLeaf(sub));
    const q = (this.searchText || '').trim();
    if (!q) {
      return acc;
    }
    const low = q.toLowerCase();
    return acc.filter((sub) => this.itemMatchesSearch(sub, low));
  }

  visibleLevel3(sidebarSubItem: RouteInfo): RouteInfo[] {
    const acc = (sidebarSubItem?.submenu || []).filter((i) => i.isAccess === true);
    const q = (this.searchText || '').trim();
    if (!q) {
      return acc;
    }
    const low = q.toLowerCase();
    return acc.filter((i) => this.itemMatchesSearch(i, low));
  }

  private subtreeHasAccessibleLeaf(item: RouteInfo): boolean {
    if (item.groupTitle) {
      return false;
    }
    if (!item.submenu?.length) {
      return item.isAccess === true;
    }
    return item.submenu.some((c) => this.subtreeHasAccessibleLeaf(c));
  }

  private itemMatchesSearch(item: RouteInfo, low: string): boolean {
    if (
      Object.keys(item).some((k) => {
        if (k === 'submenu') {
          return false;
        }
        return String(item[k] ?? '')
          .toLowerCase()
          .includes(low);
      })
    ) {
      return true;
    }
    return (item.submenu || []).some((s) => this.itemMatchesSearch(s, low));
  }

  ngOnDestroy() {
    this.clearSearchOpenBodyClass();
    this.routerObj.unsubscribe();
  }

  onSearchTextChange(value: string): void {
    this.searchingOpen = !!(value && String(value).trim().length);
    if (this.searchingOpen) {
      this.renderer.addClass(this.document.body, 'sidebar-search-open');
    } else {
      this.clearSearchOpenBodyClass();
    }
  }

  private clearSearchOpenBodyClass(): void {
    this.renderer.removeClass(this.document.body, 'sidebar-search-open');
  }
  initLeftSidebar() {
    const _this = this;
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '100%';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
}
