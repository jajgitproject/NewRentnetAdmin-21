// @ts-nocheck
/**
 * Local replacement for `ngx-google-places-autocomplete` (see templates).
 * `importLibrary("places")` when needed. In a MatDialog, reparent
 * `.pac-container` to the same `cdk-overlay-pane` (absolute, pane-relative) so
 * it stacks above the dialog; otherwise `document.body` with `position: fixed`
 * and viewport coordinates. Scroll/resize + dialog content scroll listeners, etc.
 */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

declare const google: any;

const READY_POLL_MS = 150;
const READY_POLL_MAX_ATTEMPTS = 200;
let sharedPlacesImportPromise: Promise<unknown> | null = null;

@Directive({
  selector: '[ngx-google-places-autocomplete]',
  exportAs: 'ngx-places',
  standalone: false,
})
export class GooglePlaceDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('options') options: any;
  @Output() onAddressChange = new EventEmitter<any>();

  private autocomplete: any = null;
  private placeChangedListener: any = null;
  private readyTimer: any = null;
  private readyAttempts = 0;
  private visibleAttempts = 0;
  private destroyed = false;
  private pacLayoutListener: ((event: Event) => void) | null = null;
  private scrollRaf = 0;
  private dialogScrollElement: Element | null = null;
  private pacRetryTimers: ReturnType<typeof setTimeout>[] = [];

  private readonly onWindowScrollOrResize = (): void => {
    if (this.scrollRaf) {
      return;
    }
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      this.flushPacReposition();
    });
  };

  private readonly onHostFocus = (): void => {
    if (this.destroyed) {
      return;
    }
    if (this.autocomplete) {
      return;
    }
    this.visibleAttempts = 0;
    this.readyAttempts = 0;
    if (this.readyTimer) {
      clearTimeout(this.readyTimer);
      this.readyTimer = null;
    }
    this.waitForGoogleAndInit();
  };

  constructor(private elementRef: ElementRef<HTMLInputElement>, private zone: NgZone) {}

  private applyHostInputDefaults(el: HTMLInputElement): void {
    if (!el.hasAttribute('type')) {
      el.setAttribute('type', 'text');
    }
    if (!el.hasAttribute('autocomplete')) {
      el.setAttribute('autocomplete', 'off');
    }
  }

  ngAfterViewInit(): void {
    const el = this.elementRef?.nativeElement;
    if (el) {
      this.applyHostInputDefaults(el);
      el.addEventListener('focus', this.onHostFocus, true);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onWindowScrollOrResize, true);
      window.addEventListener('resize', this.onWindowScrollOrResize, true);
    }
    this.dialogScrollElement =
      el?.closest?.(
        '.mat-mdc-dialog-content, [mat-dialog-content], .mdc-dialog__content, .cdk-dialog-container'
      ) || null;
    this.dialogScrollElement?.addEventListener('scroll', this.onWindowScrollOrResize, { passive: true });
    this.waitForGoogleAndInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.autocomplete && this.options) {
      try {
        this.autocomplete.setOptions(this.normalizeOptions(this.options));
      } catch {
        /* ignore */
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.elementRef?.nativeElement) {
      this.elementRef.nativeElement.removeEventListener('focus', this.onHostFocus, true);
    }
    if (this.readyTimer) {
      clearTimeout(this.readyTimer);
      this.readyTimer = null;
    }
    if (this.placeChangedListener && typeof google !== 'undefined' && google?.maps?.event) {
      try {
        google.maps.event.removeListener(this.placeChangedListener);
      } catch {
        /* noop */
      }
    }
    this.placeChangedListener = null;
    if (this.pacLayoutListener && this.elementRef?.nativeElement) {
      this.elementRef.nativeElement.removeEventListener('input', this.pacLayoutListener);
    }
    this.pacLayoutListener = null;
    this.clearPacRetryTimers();
    this.dialogScrollElement?.removeEventListener('scroll', this.onWindowScrollOrResize);
    this.dialogScrollElement = null;
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onWindowScrollOrResize, true);
      window.removeEventListener('resize', this.onWindowScrollOrResize, true);
    }
    if (this.scrollRaf && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
    this.autocomplete = null;
  }

  private clearPacRetryTimers(): void {
    this.pacRetryTimers.forEach((id) => clearTimeout(id));
    this.pacRetryTimers = [];
  }

  private flushPacReposition(): void {
    const input = this.elementRef?.nativeElement;
    if (!input || this.destroyed) {
      return;
    }
    const pacContainers = Array.from(
      document.querySelectorAll('.pac-container')
    ) as HTMLElement[];
    this.repositionPacContainers(input, pacContainers);
  }

  private schedulePacReposition(): void {
    this.flushPacReposition();
    requestAnimationFrame(() => {
      this.flushPacReposition();
      requestAnimationFrame(() => this.flushPacReposition());
    });
    this.clearPacRetryTimers();
    [0, 16, 50, 100, 200, 400].forEach((ms) => {
      this.pacRetryTimers.push(
        setTimeout(() => {
          this.flushPacReposition();
        }, ms)
      );
    });
  }

  private waitForGoogleAndInit(): void {
    if (this.destroyed) {
      return;
    }
    const w = (window as any).google;
    if (w?.maps?.places?.Autocomplete) {
      this.initAutocomplete();
      return;
    }
    if (w?.maps && typeof w.maps.importLibrary === 'function' && !sharedPlacesImportPromise) {
      sharedPlacesImportPromise = w.maps.importLibrary('places').catch((err: unknown) => {
        sharedPlacesImportPromise = null;
        return Promise.reject(err);
      });
    }
    if (sharedPlacesImportPromise) {
      sharedPlacesImportPromise
        .then(() => {
          this.zone.run(() => {
            this.readyAttempts = 0;
            this.waitForGoogleAndInit();
          });
        })
        .catch(() => {
          this.scheduleMapCorePoll();
        });
      return;
    }
    this.scheduleMapCorePoll();
  }

  private scheduleMapCorePoll(): void {
    if (this.destroyed) {
      return;
    }
    if ((window as any).google?.maps?.places?.Autocomplete) {
      this.initAutocomplete();
      return;
    }
    if (this.readyAttempts >= READY_POLL_MAX_ATTEMPTS) {
      // eslint-disable-next-line no-console
      console.warn('[google-places-shim] Google Maps places never became available');
      return;
    }
    this.readyAttempts += 1;
    this.readyTimer = setTimeout(() => this.waitForGoogleAndInit(), READY_POLL_MS);
  }

  private getAutocompleteConstructor(): any {
    const w = (window as any).google?.maps?.places;
    return w?.Autocomplete || null;
  }

  private initAutocomplete(): void {
    const input = this.elementRef?.nativeElement;
    if (!input) {
      return;
    }
    if (this.autocomplete) {
      return;
    }
    const Ctor = this.getAutocompleteConstructor();
    if (!Ctor) {
      return;
    }
    const rect = input.getBoundingClientRect();
    const hasLayout =
      input.isConnected &&
      (rect.width > 0 ||
        rect.height > 0 ||
        input.clientWidth > 0 ||
        input.clientHeight > 0 ||
        input.offsetWidth > 0 ||
        input.offsetHeight > 0);
    if (!hasLayout) {
      if (this.visibleAttempts < 200) {
        this.visibleAttempts += 1;
        requestAnimationFrame(() => this.initAutocomplete());
      }
      return;
    }
    try {
      this.autocomplete = new Ctor(input, this.normalizeOptions(this.options));
      this.pacLayoutListener = () => {
        this.schedulePacReposition();
      };
      input.addEventListener('input', this.pacLayoutListener);
      this.placeChangedListener = this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        this.zone.run(() => this.onAddressChange.emit(place));
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[google-places-shim] Autocomplete init failed:', err);
    }
  }

  /**
   * 1) MatDialog: append `.pac-container` to the same `cdk-overlay-pane` as
   *    a last child, `position: absolute`, offsets from input vs pane rects.
   * 2) Otherwise: `document.body` + `position: fixed` + viewport coordinates.
   */
  private repositionPacContainers(input: HTMLInputElement, pacContainers: HTMLElement[]): void {
    if (!pacContainers || pacContainers.length === 0) {
      return;
    }
    const ir = input.getBoundingClientRect();
    if (ir.width <= 0 && ir.height <= 0) {
      return;
    }

    const w = Math.max(Math.round(ir.width), 260);
    const pane = input.closest?.('.cdk-overlay-pane') as HTMLElement | null;

    pacContainers.forEach((pac) => {
      if (pane && document.body.contains(pane)) {
        if (pac.parentElement !== pane) {
          pane.appendChild(pac);
        }
        const pr = pane.getBoundingClientRect();
        const left = ir.left - pr.left;
        const top = ir.bottom - pr.top;
        pac.style.setProperty('position', 'absolute', 'important');
        pac.style.setProperty('left', `${Math.round(left)}px`, 'important');
        pac.style.setProperty('top', `${Math.round(top)}px`, 'important');
        pac.style.setProperty('width', `${w}px`, 'important');
        pac.style.removeProperty('z-index');
        pac.style.setProperty('pointer-events', 'auto', 'important');
        pac.style.setProperty('opacity', '1', 'important');
        return;
      }

      if (pac.parentElement !== document.body) {
        document.body.appendChild(pac);
      }
      pac.style.setProperty('position', 'fixed', 'important');
      pac.style.setProperty('left', `${Math.round(ir.left)}px`, 'important');
      pac.style.setProperty('top', `${Math.round(ir.bottom)}px`, 'important');
      pac.style.setProperty('width', `${w}px`, 'important');
      pac.style.setProperty('z-index', '2147483000', 'important');
      pac.style.setProperty('pointer-events', 'auto', 'important');
      pac.style.setProperty('opacity', '1', 'important');
    });
  }

  private normalizeOptions(options: any): any {
    const base: any = !options || typeof options !== 'object' ? {} : { ...options };
    // Do not inject a default `fields` list: some API / loader versions reject
    // unknown or incompatible Autocomplete options and the widget never mounts.
    // `getPlace()` still returns geometry and formatted_address for a selection.
    return base;
  }
}

@NgModule({
  declarations: [GooglePlaceDirective],
  exports: [GooglePlaceDirective],
})
export class GooglePlaceModule {}
