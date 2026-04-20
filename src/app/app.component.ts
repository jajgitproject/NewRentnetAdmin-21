// @ts-nocheck
import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlatformLocation } from '@angular/common';
import { GeneralService } from './general/general.service';
import { PageAuditDropDown } from './auditTrail/pageAuditDropDown.model';
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  constructor(
    public _router: Router,
    location: PlatformLocation,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService
  ) {
    // Cache route->form mapping for audit header usage.
    this.generalService.GetPagesForAudit().subscribe(
      (pages: PageAuditDropDown[]) => {
        try {
          sessionStorage.setItem('audit_pages', JSON.stringify(pages || []));
        } catch {}
      },
      () => {}
    );

    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show();
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.spinner.hide();

        // Hide Bootstrap modals that render visible without Bootstrap JS
        setTimeout(() => {
          document.querySelectorAll('.modal').forEach((el: HTMLElement) => {
            if (!el.classList.contains('show')) {
              el.style.display = 'none';
            }
          });
        }, 0);

      }
      window.scrollTo(0, 0);
    });
  }
}


