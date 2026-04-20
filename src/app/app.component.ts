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
  private legacyModalBridgeInitialized = false;
  constructor(
    public _router: Router,
    location: PlatformLocation,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService
  ) {
    this.initLegacyModalBridge();

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
          this.cleanupAllLegacyBackdrops();
        }, 0);

      }
      window.scrollTo(0, 0);
    });
  }

  private initLegacyModalBridge(): void {
    if (this.legacyModalBridgeInitialized) return;
    this.legacyModalBridgeInitialized = true;

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest('[data-toggle="modal"], [data-target^="#"]') as HTMLElement | null;
      if (trigger) {
        const selector = trigger.getAttribute('data-target');
        if (selector && selector.startsWith('#')) {
          const modal = document.querySelector(selector) as HTMLElement | null;
          if (modal) {
            event.preventDefault();
            this.openLegacyModal(modal, trigger);
            return;
          }
        }
      }

      const dismiss = target.closest('[data-dismiss="modal"]') as HTMLElement | null;
      if (dismiss) {
        const modal = dismiss.closest('.modal') as HTMLElement | null;
        if (modal) {
          event.preventDefault();
          this.closeLegacyModal(modal);
          return;
        }
      }

      const closeButton = target.closest('.modal .close, .modal [aria-label="Close"]') as HTMLElement | null;
      if (closeButton) {
        const modal = closeButton.closest('.modal') as HTMLElement | null;
        if (modal) {
          event.preventDefault();
          this.closeLegacyModal(modal);
          return;
        }
      }

      // Click on modal backdrop area closes modal (Bootstrap default behavior).
      const modalSurface = target.closest('.modal') as HTMLElement | null;
      if (modalSurface && target === modalSurface) {
        this.closeLegacyModal(modalSurface);
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const openModals = Array.from(document.querySelectorAll('.modal.show')) as HTMLElement[];
      if (!openModals.length) return;
      const topModal = openModals[openModals.length - 1];
      // Respect static backdrop behavior for Esc as well.
      if (topModal.getAttribute('data-backdrop') === 'static') return;
      this.closeLegacyModal(topModal);
    });
  }

  private openLegacyModal(modal: HTMLElement, trigger: HTMLElement): void {
    const noBackdrop =
      trigger.getAttribute('data-backdrop') === 'false' ||
      trigger.getAttribute('data-backDrop') === 'false';
    const staticBackdrop =
      trigger.getAttribute('data-backdrop') === 'static' ||
      trigger.getAttribute('data-backDrop') === 'static';

    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', modal.getAttribute('role') || 'dialog');
    if (staticBackdrop) modal.setAttribute('data-backdrop', 'static');
    modal.classList.add('show');
    if (modal.getAttribute('tabindex') === '-1') modal.focus();

    if (!noBackdrop) this.ensureLegacyBackdrop(staticBackdrop);
    document.body.classList.add('modal-open');
  }

  private closeLegacyModal(modal: HTMLElement): void {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    this.cleanupAllLegacyBackdrops();

    if (!document.querySelector('.modal.show')) {
      document.body.classList.remove('modal-open');
    }
  }

  private ensureLegacyBackdrop(isStatic: boolean): void {
    const existing = document.querySelector('.legacy-modal-backdrop');
    if (existing) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show legacy-modal-backdrop';
    if (isStatic) backdrop.setAttribute('data-static-backdrop', 'true');
    backdrop.addEventListener('click', () => {
      if (isStatic) return;
      const topModal = document.querySelector('.modal.show') as HTMLElement | null;
      if (topModal) this.closeLegacyModal(topModal);
    });
    document.body.appendChild(backdrop);
  }

  private cleanupAllLegacyBackdrops(): void {
    document
      .querySelectorAll('.legacy-modal-backdrop')
      .forEach((el) => el.parentElement?.removeChild(el));
  }
}


