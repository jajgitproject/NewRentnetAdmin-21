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
  private legacyModalBackdrop: HTMLElement | null = null;
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
        setTimeout(() => this.syncLegacyModals(), 0);

      }
      window.scrollTo(0, 0);
    });

    this.bindLegacyModalBridge();
  }

  private bindLegacyModalBridge() {
    document.addEventListener('click', (evt: Event) => {
      const target = evt.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const openTrigger = target.closest('[data-toggle="modal"]') as HTMLElement | null;
      if (openTrigger) {
        const selector = openTrigger.getAttribute('data-target');
        if (selector && selector.startsWith('#')) {
          const modal = document.querySelector(selector) as HTMLElement | null;
          if (modal) {
            evt.preventDefault();
            this.openLegacyModal(modal);
            return;
          }
        }
      }

      const closeTrigger = target.closest('[data-dismiss="modal"]') as HTMLElement | null;
      if (closeTrigger) {
        const modal = closeTrigger.closest('.modal') as HTMLElement | null;
        if (modal) {
          evt.preventDefault();
          this.closeLegacyModal(modal);
          return;
        }
      }

      const backdropModal = target.closest('.modal.show') as HTMLElement | null;
      if (backdropModal && target === backdropModal) {
        const backdropMode = backdropModal.getAttribute('data-backdrop');
        if (backdropMode !== 'static') {
          this.closeLegacyModal(backdropModal);
        }
      }
    });

    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key !== 'Escape') {
        return;
      }
      const active = document.querySelector('.modal.show') as HTMLElement | null;
      if (active) {
        this.closeLegacyModal(active);
      }
    });
  }

  private openLegacyModal(modal: HTMLElement) {
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    this.ensureLegacyBackdrop();
  }

  private closeLegacyModal(modal: HTMLElement) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
    modal.setAttribute('aria-hidden', 'true');
    this.syncLegacyModals();
  }

  private ensureLegacyBackdrop() {
    if (this.legacyModalBackdrop && document.body.contains(this.legacyModalBackdrop)) {
      return;
    }
    const el = document.createElement('div');
    el.className = 'modal-backdrop fade show';
    document.body.appendChild(el);
    this.legacyModalBackdrop = el;
  }

  private syncLegacyModals() {
    const activeCount = document.querySelectorAll('.modal.show').length;
    if (activeCount === 0) {
      document.body.classList.remove('modal-open');
      if (this.legacyModalBackdrop && document.body.contains(this.legacyModalBackdrop)) {
        document.body.removeChild(this.legacyModalBackdrop);
      }
      this.legacyModalBackdrop = null;
    }

    document.querySelectorAll('.modal').forEach((el: HTMLElement) => {
      if (!el.classList.contains('show')) {
        el.style.display = 'none';
      }
    });
  }
}


