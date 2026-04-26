// @ts-nocheck
/**
 * Local replacement for `ngx-google-places-autocomplete` (see templates).
 * When `showPopover` is available, mount `.pac-container` in a `popover="manual"`
 * host so the list shares the browser top layer with Angular 21+ CDK dialogs
 * (z-index on `body` alone cannot win there — see `efpInPac` debug logs).
 * Otherwise fall back to last child of `document.body` with `position: fixed`.
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

// #region agent log
const __agentDbg = (message: string, data: any, hypothesisId: string) => {
  try {
    fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0ef503' },
      body: JSON.stringify({
        sessionId: '0ef503',
        location: 'google-places-shim.ts',
        message,
        data,
        hypothesisId,
        runId: 'debug',
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch {
    /* noop */
  }
};
// #endregion

const POP_HOST_ID = 'rentnet-google-places-popover';

function supportsManualPopover(): boolean {
  if (typeof HTMLElement === 'undefined') {
    return false;
  }
  return typeof (HTMLElement.prototype as unknown as { showPopover?: () => void }).showPopover === 'function';
}

function getOrCreatePacPopHost(): HTMLDivElement | null {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  let el = document.getElementById(POP_HOST_ID) as HTMLDivElement | null;
  if (el) {
    return el;
  }
  el = document.createElement('div');
  el.id = POP_HOST_ID;
  el.setAttribute('popover', 'manual');
  el.setAttribute('aria-hidden', 'false');
  el.style.cssText = [
    'box-sizing:border-box',
    'margin:0',
    'padding:0',
    'border:0',
    'background:transparent',
    'pointer-events:auto',
    'overflow:visible',
  ].join(';');
  document.body.appendChild(el);
  return el;
}

function hidePacPopHost(): void {
  const el = document.getElementById(POP_HOST_ID) as (HTMLDivElement & { hidePopover?: () => void }) | null;
  if (el && typeof el.hidePopover === 'function') {
    try {
      el.hidePopover();
    } catch {
      /* noop */
    }
  }
}

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
  /** Re-assert loop generation; bump to cancel in-flight rAF chain. */
  private pacLayerLockGen = 0;
  private pacZOrderObserver: MutationObserver | null = null;
  private pacZDebounceRaf = 0;

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
    this.pacLayerLockGen += 1;
    if (this.pacZDebounceRaf && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pacZDebounceRaf);
      this.pacZDebounceRaf = 0;
    }
    if (this.pacZOrderObserver) {
      try {
        this.pacZOrderObserver.disconnect();
      } catch {
        /* noop */
      }
      this.pacZOrderObserver = null;
    }
    hidePacPopHost();
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
    // #region agent log
    if (pacContainers.length) {
      __agentDbg('flushPacReposition n', { n: pacContainers.length }, 'H3');
    }
    // #endregion
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

  private applyPacLayerStyles(input: HTMLInputElement, pacEls: HTMLElement[]): void {
    if (!pacEls || pacEls.length === 0) {
      return;
    }
    if (typeof document === 'undefined' || !document.body) {
      return;
    }
    const ir = input.getBoundingClientRect();
    if (ir.width <= 0 && ir.height <= 0) {
      return;
    }
    const w = Math.max(Math.round(ir.width), 260);
    const usePop = supportsManualPopover();
    const host = usePop ? getOrCreatePacPopHost() : null;

    for (const pac of pacEls) {
      if (usePop && host) {
        host.appendChild(pac);
        host.style.setProperty('position', 'fixed', 'important');
        host.style.setProperty('left', `${Math.round(ir.left)}px`, 'important');
        host.style.setProperty('top', `${Math.round(ir.bottom)}px`, 'important');
        host.style.setProperty('width', `${w}px`, 'important');
        host.style.setProperty('z-index', '2147483647', 'important');
        host.style.setProperty('bottom', 'auto', 'important');
        host.style.setProperty('right', 'auto', 'important');

        pac.style.setProperty('position', 'static', 'important');
        pac.style.setProperty('left', 'auto', 'important');
        pac.style.setProperty('top', 'auto', 'important');
        pac.style.setProperty('width', '100%', 'important');
        pac.style.setProperty('z-index', 'auto', 'important');
        pac.style.setProperty('bottom', 'auto', 'important');
        pac.style.setProperty('right', 'auto', 'important');
        pac.style.setProperty('pointer-events', 'auto', 'important');
        pac.style.setProperty('opacity', '1', 'important');
        pac.style.setProperty('transform', 'translateZ(0)', 'important');
        pac.style.setProperty('isolation', 'isolate', 'important');
        pac.style.setProperty('overflow', 'visible', 'important');
        pac.style.setProperty('background-color', '#ffffff', 'important');
        try {
          (host as unknown as { showPopover?: () => void }).showPopover?.();
        } catch {
          /* noop */
        }
      } else {
        document.body.appendChild(pac);
        pac.style.setProperty('position', 'fixed', 'important');
        pac.style.setProperty('left', `${Math.round(ir.left)}px`, 'important');
        pac.style.setProperty('top', `${Math.round(ir.bottom)}px`, 'important');
        pac.style.setProperty('width', `${w}px`, 'important');
        pac.style.setProperty('z-index', '2147483647', 'important');
        pac.style.setProperty('bottom', 'auto', 'important');
        pac.style.setProperty('right', 'auto', 'important');
        pac.style.setProperty('pointer-events', 'auto', 'important');
        pac.style.setProperty('opacity', '1', 'important');
        pac.style.setProperty('transform', 'translateZ(0)', 'important');
        pac.style.setProperty('isolation', 'isolate', 'important');
        pac.style.setProperty('overflow', 'visible', 'important');
        pac.style.setProperty('background-color', '#ffffff', 'important');
      }
    }
  }

  private runPacLayerLock(input: HTMLInputElement, maxFrames: number): void {
    this.pacLayerLockGen += 1;
    const myGen = this.pacLayerLockGen;
    let frame = 0;
    const tick = () => {
      if (this.destroyed) {
        return;
      }
      if (this.pacLayerLockGen !== myGen) {
        return;
      }
      const pacs = Array.from(document.querySelectorAll('.pac-container')) as HTMLElement[];
      if (pacs.length) {
        this.applyPacLayerStyles(input, pacs);
        if (typeof queueMicrotask === 'function') {
          queueMicrotask(() => {
            if (this.destroyed || this.pacLayerLockGen !== myGen) {
              return;
            }
            const again = Array.from(document.querySelectorAll('.pac-container')) as HTMLElement[];
            if (again.length) {
              this.applyPacLayerStyles(input, again);
            }
          });
        }
      }
      frame += 1;
      if (frame < maxFrames) {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(tick);
        }
      } else {
        const p0 = (Array.from(document.querySelectorAll('.pac-container'))[0] as HTMLElement) || null;
        if (p0) {
          // #region agent log
          const br = p0.getBoundingClientRect();
          const cx = Math.round(br.left + Math.min(12, Math.max(1, br.width / 2)));
          const cy = Math.round(br.top + Math.min(12, Math.max(1, br.height / 2)));
          let efpCenter: { tag: string; cls: string; z: string; pos: string } | null = null;
          try {
            const hit = document.elementFromPoint(cx, cy);
            if (hit) {
              const cs = getComputedStyle(hit as HTMLElement);
              efpCenter = {
                tag: (hit as HTMLElement).tagName,
                cls: (hit as HTMLElement).className?.toString?.().slice(0, 100) || '',
                z: cs.zIndex,
                pos: cs.position,
              };
            }
          } catch {
            /* noop */
          }
          let efpInPac = false;
          try {
            const elAt = document.elementFromPoint(cx, cy);
            efpInPac = !!elAt && (elAt === p0 || p0.contains(elAt));
          } catch {
            efpInPac = false;
          }
          __agentDbg(
            'pac lock last frame',
            {
              usesPopover: supportsManualPopover(),
              pos: getComputedStyle(p0).position,
              efpCenter,
              efpInPac,
              cx,
              cy,
              br: { w: br.width, h: br.height },
            },
            'postfix-verification'
          );
          // #endregion
        }
      }
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(tick);
    }
  }

  private wirePacStyleObserver(input: HTMLInputElement, watch: HTMLElement): void {
    if (this.pacZOrderObserver) {
      try {
        this.pacZOrderObserver.disconnect();
      } catch {
        /* noop */
      }
      this.pacZOrderObserver = null;
    }
    this.pacZOrderObserver = new MutationObserver(() => {
      if (this.destroyed) {
        return;
      }
      if (this.pacZDebounceRaf && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.pacZDebounceRaf);
      }
      this.pacZDebounceRaf = requestAnimationFrame(() => {
        this.pacZDebounceRaf = 0;
        if (this.destroyed) {
          return;
        }
        const pacs = Array.from(document.querySelectorAll('.pac-container')) as HTMLElement[];
        if (pacs.length) {
          this.applyPacLayerStyles(input, pacs);
          this.runPacLayerLock(input, 12);
        }
      });
    });
    this.pacZOrderObserver.observe(watch, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  /**
   * `fixed` + viewport px; PAC is in `#rentnet-google-places-popover` + `showPopover`
   * when supported, else last child of `document.body` with `fixed` on `.pac-container`.
   */
  private repositionPacContainers(input: HTMLInputElement, pacContainers: HTMLElement[]): void {
    if (!pacContainers || pacContainers.length === 0) {
      if (this.pacZOrderObserver) {
        try {
          this.pacZOrderObserver.disconnect();
        } catch {
          /* noop */
        }
        this.pacZOrderObserver = null;
      }
      this.pacLayerLockGen += 1;
      hidePacPopHost();
      return;
    }
    if (this.pacZOrderObserver) {
      try {
        this.pacZOrderObserver.disconnect();
      } catch {
        /* noop */
      }
      this.pacZOrderObserver = null;
    }
    const ir = input.getBoundingClientRect();
    if (ir.width <= 0 && ir.height <= 0) {
      return;
    }
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    this.applyPacLayerStyles(input, pacContainers);

    // #region agent log
    const first = pacContainers[0];
    const pr = (el: Element | null) => {
      if (!el) {
        return null;
      }
      const cs = getComputedStyle(el as HTMLElement);
      return {
        id: (el as HTMLElement).id,
        z: cs.zIndex,
        pos: cs.position,
        pe: cs.pointerEvents,
        tag: (el as HTMLElement).tagName,
        cls: (el as HTMLElement).className?.toString?.().slice(0, 100),
      };
    };
    const at = (x: number, y: number) => {
      try {
        const e = document.elementFromPoint(x, y);
        return pr(e);
      } catch {
        return { err: true };
      }
    };
    const sx = Math.round(ir.left + 12);
    const sy = Math.round(ir.bottom + 28);
    const bodyLast = document.body?.lastElementChild;
    const snap = {
      mount: supportsManualPopover() ? 'popover' : 'body',
      pac0Parent: first?.parentElement === document.body ? 'body' : first?.parentElement?.id,
      pac0pr: pr(first),
      bodyLastId: bodyLast ? (bodyLast as HTMLElement).id || bodyLast.tagName : null,
      cdk: pr(document.querySelector('.cdk-overlay-container')),
      efp: at(sx, sy),
    };
    __agentDbg('reposition sync', snap, 'H2-H4-H5');

    const reportDeferred = (phase: string) => {
      const f = pacContainers[0];
      __agentDbg(`reposition ${phase}`, {
        pac0Parent: f?.parentElement?.id,
        parentTag: f?.parentElement?.tagName,
        efp: at(sx, sy),
        pac0pr: pr(f),
      }, 'H1-H4');
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => reportDeferred('rAF'));
    }
    if (typeof setTimeout === 'function') {
      setTimeout(() => reportDeferred('t150ms'), 150);
    }
    // #endregion

    this.runPacLayerLock(input, 24);
    this.wirePacStyleObserver(input, first);
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
