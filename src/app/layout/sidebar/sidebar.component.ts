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
  OnDestroy
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from 'src/app/core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
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
  firstName: string;
  lastName: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private roleMapService: RolePageMappingService
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // logic for select active menu in dropdown
        const currenturl = event.url.split('?')[0];
        this.level1Menu = currenturl.split('/')[1];
        this.level2Menu = currenturl.split('/')[2];

        // close sidebar on mobile screen after menu select
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
      this.getPagesAccessRoleWise(this.authService.currentUserValue.employee.RoleID);
    }
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
    this.firstName=this.authService.currentUserValue.employee.FirstName;
    this.lastName=this.authService.currentUserValue.employee.LastName;
  }

  getPagesAccessRoleWise(roleID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roleMapService.getTableData(null, roleID, true, 0).subscribe(
        (data) => {
          let accessPagesArray = [];
          data?.forEach(element => {
            if (element.activationStatus) {
              accessPagesArray.push({
                pageID: element.pageID,
                page: element.page.toLowerCase().replace(/\s+/g, '')
              });
            }
          });
  
          // Saving to local storage
          localStorage.setItem('accessPages', JSON.stringify(accessPagesArray));
  
          // Update sidebar items
          this.sidebarItems?.forEach(menuItem => {
            menuItem?.submenu?.forEach(subItem => {
              const subItemTitle = subItem.title.toLowerCase().replace(/\s+/g, '');
              subItem.isAccess = accessPagesArray.some(page => page.page === subItemTitle);
            });
          });
  
          resolve();
        },
        (error) => {
          console.error('Error fetching role-wise access pages:', error);
          reject(error);
        }
      );
    });
  }

  
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    // Sidebar is 260px wide; the previous value (500px) made the inner <ul>
    // wider than its parent, which showed a horizontal scrollbar under the
    // "Menu" label. '100%' keeps the list within the sidebar and avoids the
    // ugly overlapping scrollbar.
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


