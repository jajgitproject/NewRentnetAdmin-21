// @ts-nocheck
import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlatformLocation } from '@angular/common';
import { GeneralService } from './general/general.service';
import { PageAuditDropDown } from './auditTrail/pageAuditDropDown.model';
import Swal from 'sweetalert2';
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  private legacyModalBridgeInitialized = false;
  private static swalForegroundInstalled = false;
  constructor(
    public _router: Router,
    location: PlatformLocation,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService
  ) {
    this.initLegacyModalBridge();
    AppComponent.installSwalForegroundGuard();

    // Register the popstate -> reload handler exactly once. Doing this inside
    // the router event subscription below used to re-register on every
    // NavigationStart, leaving one listener per navigation.
    location.onPopState(() => {
      window.location.reload();
    });

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
      // Do not let legacy Bootstrap modal bridge hijack Owl date/time picker interactions.
      if (
        target.closest('owl-date-time, .owl-dt-container, .owl-dt-overlay, .owl-dt-popup')
      ) {
        return;
      }

      const trigger = target.closest('[data-toggle="modal"]') as HTMLElement | null;
      if (trigger) {
        const selector = trigger.getAttribute('data-target');
        if (selector && selector.startsWith('#')) {
          const modal = document.querySelector(selector) as HTMLElement | null;
          if (modal && modal.classList.contains('modal')) {
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

  /**
   * Guarantee every SweetAlert2 popup paints above every MatDialog / CDK overlay.
   *
   * Strategy: monkey-patch `Swal.fire` once at app boot so every call — no
   * matter where in the codebase — receives a synchronous `didRender` hook
   * that (1) re-parents the `.swal2-container` to be the last child of
   * `<body>` and (2) pins `z-index: 2147483647` inline.
   *
   * Why didRender and not CSS alone:
   *   - Swal2 v11 uses `div:where(.swal2-container)` (zero specificity) for
   *     its default z-index of 1060. Our `.swal2-container { z-index:
   *     INT32_MAX !important }` in styles.scss wins easily on specificity.
   *   - However we have seen the Closing warning still render behind the
   *     Reservation Details MatDialog even with the CSS in place — most
   *     likely because the Swal container is injected inside the CDK
   *     overlay container in some path (historic target:overlayHost hack),
   *     which traps Swal in the dialog's stacking context. The DOM reparent
   *     in `didRender` breaks that trap unconditionally.
   *   - `didRender` runs synchronously inside Swal2 before the browser
   *     paints, so the user never sees a behind-the-dialog frame.
   *
   * Call sites keep using plain `Swal.fire({ ... })` — no target / backdrop /
   * heightAuto / didRender overrides required. If a call site provides its
   * own `didRender`, we chain it after our foreground guard.
   */
  private static installSwalForegroundGuard(): void {
    if (AppComponent.swalForegroundInstalled) return;
    AppComponent.swalForegroundInstalled = true;

    const promote = () => {
      const container = Swal.getContainer();
      if (!container) return;
      // Re-parent to end of <body> (breaks CDK-overlay stacking-context trap).
      if (container.parentElement !== document.body) {
        document.body.appendChild(container);
      } else if (document.body.lastElementChild !== container) {
        document.body.appendChild(container);
      }
      // Use setProperty with priority 'important' so the inline style beats
      // any stylesheet rule, including `!important` ones and Swal2's own
      // runtime-injected <style>.
      container.style.setProperty('z-index', '2147483647', 'important');
      container.style.setProperty('position', 'fixed', 'important');
    };

    // Also monkey-patch Swal.fire so every call app-wide is foregrounded
    // synchronously via didRender AND asynchronously via rAF fallback.
    const originalFire = Swal.fire.bind(Swal);
    Swal.fire = function patchedFire(...args: any[]) {
      const first = args[0];
      if (first && typeof first === 'object' && !Array.isArray(first)) {
        const userDidRender = first.didRender;
        first.didRender = function wrappedDidRender(...inner: any[]) {
          promote();
          if (typeof userDidRender === 'function') {
            return userDidRender.apply(this, inner);
          }
          return undefined;
        };
      }
      const result = originalFire(...args);
      // Multi-tick safety: promote immediately (microtask), next paint (rAF),
      // and after Swal2's own post-open hooks (setTimeout 0). Idempotent.
      queueMicrotask(promote);
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          promote();
          requestAnimationFrame(promote);
        });
      }
      setTimeout(promote, 0);
      return result;
    } as typeof Swal.fire;

    // Belt-and-suspenders: a MutationObserver on body ALSO promotes any
    // .swal2-container that gets inserted, in case a future code path bypasses
    // Swal.fire (e.g. Swal.mixin instances, Swal.showLoading, etc).
    const observer = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList && node.classList.contains('swal2-container')) {
            promote();
            return;
          }
          const nested = node.querySelector && node.querySelector('.swal2-container');
          if (nested) promote();
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}


