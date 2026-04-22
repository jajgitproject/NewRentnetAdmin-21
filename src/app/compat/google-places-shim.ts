// @ts-nocheck
/**
 * Local replacement for the deprecated `ngx-google-places-autocomplete`
 * library (last published 2019, Angular 2-era, incompatible with Angular 21
 * Ivy). Matches the public surface the existing templates depend on:
 *
 *   <input matInput
 *          ngx-google-places-autocomplete
 *          [options]="options"
 *          #placesRef="ngx-places"
 *          (onAddressChange)="handleAddressChange($event)">
 *
 * Behavior:
 *   - Waits for `window.google.maps.places` to be available (the script is
 *     injected by `RuntimeConfigService.loadGoogleMapsScript`).
 *   - Creates a `google.maps.places.Autocomplete` bound to the host input.
 *   - Applies the `[options]` object (types, bounds, componentRestrictions, ...).
 *   - Emits `(onAddressChange)` with the resolved `PlaceResult` whenever the
 *     user picks a suggestion.
 *   - Cleans up the Google listener on destroy.
 *
 * If the Maps script fails to load (no network, bad key, referrer restriction)
 * the directive degrades gracefully: the input still works as a plain text
 * field, no errors are thrown.
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

// Poll interval + cap while waiting for the Maps script to finish downloading.
// 150 ms * 200 = 30s, which is generous for a slow connection but still
// bounded so we don't leak timers forever on a page where Maps never loads.
const READY_POLL_MS = 150;
const READY_POLL_MAX_ATTEMPTS = 200;

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
  private debugInputListener: ((event: Event) => void) | null = null;
  private debugInputEvents = 0;

  constructor(private elementRef: ElementRef<HTMLInputElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H2',location:'google-places-shim.ts:66',message:'Directive ngAfterViewInit',data:{hasInput:!!this.elementRef?.nativeElement,hasOptions:!!this.options,googlePlacesReady:!!(window as any)?.google?.maps?.places?.Autocomplete},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.waitForGoogleAndInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Options can legitimately arrive after view init (async form bootstrap).
    // Push updates onto the existing Autocomplete instead of rebuilding it.
    if (changes['options'] && this.autocomplete && this.options) {
      try {
        this.autocomplete.setOptions(this.normalizeOptions(this.options));
      } catch {
        /* ignore - malformed options should not break the input */
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
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
    if (this.debugInputListener && this.elementRef?.nativeElement) {
      this.elementRef.nativeElement.removeEventListener('input', this.debugInputListener);
    }
    this.debugInputListener = null;
    this.autocomplete = null;
  }

  private waitForGoogleAndInit(): void {
    if (this.destroyed) {
      return;
    }
    if (
      typeof window !== 'undefined' &&
      (window as any).google?.maps?.places?.Autocomplete
    ) {
      this.initAutocomplete();
      return;
    }
    if (this.readyAttempts >= READY_POLL_MAX_ATTEMPTS) {
      // #region agent log
      fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H1',location:'google-places-shim.ts:110',message:'Google Places not ready after max attempts',data:{readyAttempts:this.readyAttempts},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      // Give up quietly - the input continues to work as plain text.
      // eslint-disable-next-line no-console
      console.warn(
        '[google-places-shim] google.maps.places never became available; ' +
          'autocomplete disabled on this input.'
      );
      return;
    }
    this.readyAttempts += 1;
    this.readyTimer = setTimeout(() => this.waitForGoogleAndInit(), READY_POLL_MS);
  }

  private initAutocomplete(): void {
    const input = this.elementRef?.nativeElement;
    if (!input) {
      return;
    }
    const inputVisible = !!input.offsetParent && input.clientWidth > 0;
    if (!inputVisible) {
      if (this.visibleAttempts < 120) {
        this.visibleAttempts += 1;
        // #region agent log
        fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'post-fix',hypothesisId:'H2',location:'google-places-shim.ts:136',message:'Deferring init until input visible',data:{visibleAttempts:this.visibleAttempts,inputOffsetParentNull:input.offsetParent===null,inputClientWidth:input.clientWidth},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        requestAnimationFrame(() => this.initAutocomplete());
      }
      return;
    }
    try {
      // #region agent log
      fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H2',location:'google-places-shim.ts:131',message:'Init autocomplete called',data:{inputConnected:!!input.isConnected,inputOffsetParentNull:input.offsetParent===null,inputClientWidth:input.clientWidth,hasOptions:!!this.options},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      this.autocomplete = new google.maps.places.Autocomplete(
        input,
        this.normalizeOptions(this.options)
      );
      this.debugInputListener = () => {
        if (this.debugInputEvents >= 3) {
          return;
        }
        this.debugInputEvents += 1;
        const pacContainers = Array.from(document.querySelectorAll('.pac-container')) as HTMLElement[];
        this.repositionPacContainers(input, pacContainers);
        const pacContainer = (pacContainers[pacContainers.length - 1] || null) as HTMLElement | null;
        const pacRect = pacContainer?.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();
        const probeX = pacRect ? Math.max(0, Math.floor(pacRect.left + 8)) : 0;
        const probeY = pacRect ? Math.max(0, Math.floor(pacRect.top + 8)) : 0;
        const probeCenterX = pacRect ? Math.max(0, Math.floor(pacRect.left + (pacRect.width / 2))) : 0;
        const probeCenterY = pacRect ? Math.max(0, Math.floor(pacRect.top + (pacRect.height / 2))) : 0;
        const topElement = pacContainer ? document.elementFromPoint(probeX, probeY) as HTMLElement | null : null;
        const topElementCenter = pacContainer ? document.elementFromPoint(probeCenterX, probeCenterY) as HTMLElement | null : null;
        const pacItem = pacContainer?.querySelector('.pac-item') as HTMLElement | null;
        const pacItemRect = pacItem?.getBoundingClientRect();
        const pacStyle = pacContainer ? window.getComputedStyle(pacContainer) : null;
        // #region agent log
        fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix-3',hypothesisId:'H7',location:'google-places-shim.ts:148',message:'Input typed - pac geometry state',data:{typedValue:(input.value||'').slice(0,20),pacCount:pacContainers.length,pacExists:!!pacContainer,pacDisplay:pacStyle?.display||null,pacVisibility:pacStyle?.visibility||null,pacZIndex:pacStyle?.zIndex||null,pacOpacity:pacStyle?.opacity||null,pacTransform:pacStyle?.transform||null,pacBackground:pacStyle?.backgroundColor||null,pacChildrenCount:pacContainer?.children?.length||0,pacTop:pacRect?.top??null,pacLeft:pacRect?.left??null,pacBottom:pacRect?.bottom??null,pacRight:pacRect?.right??null,pacWidth:pacRect?.width??null,pacHeight:pacRect?.height??null,pacItemExists:!!pacItem,pacItemTop:pacItemRect?.top??null,pacItemLeft:pacItemRect?.left??null,pacItemBottom:pacItemRect?.bottom??null,pacItemHeight:pacItemRect?.height??null,inputTop:inputRect.top,inputLeft:inputRect.left,inputBottom:inputRect.bottom,inputRight:inputRect.right,viewportW:window.innerWidth,viewportH:window.innerHeight,topElementTag:topElement?.tagName||null,topElementClass:topElement?.className||null,topElementCenterTag:topElementCenter?.tagName||null,topElementCenterClass:topElementCenter?.className||null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        try {
          const service = new google.maps.places.AutocompleteService();
          service.getPlacePredictions(
            { input: input.value || '', componentRestrictions: this.options?.componentRestrictions },
            (predictions: any[], status: string) => {
              // #region agent log
              fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix-2',hypothesisId:'H6',location:'google-places-shim.ts:152',message:'AutocompleteService prediction status',data:{typedValue:(input.value||'').slice(0,20),status,predictionCount:predictions?.length||0},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
            }
          );
        } catch (e) {
          // #region agent log
          fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix-2',hypothesisId:'H6',location:'google-places-shim.ts:159',message:'AutocompleteService call failed',data:{errorMessage:(e as any)?.message||'unknown'},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
        }
      };
      input.addEventListener('input', this.debugInputListener);
      this.placeChangedListener = this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        // #region agent log
        fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H3',location:'google-places-shim.ts:139',message:'place_changed emitted',data:{hasPlace:!!place,hasGeometry:!!place?.geometry,placeId:place?.place_id||null,name:place?.name||null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        // Bring the event back into Angular's zone so change detection runs
        // for downstream form updates (patchValue, etc.).
        this.zone.run(() => this.onAddressChange.emit(place));
      });
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H2',location:'google-places-shim.ts:146',message:'Init autocomplete failed',data:{errorMessage:(err as any)?.message||'unknown'},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      // eslint-disable-next-line no-console
      console.warn('[google-places-shim] failed to init Autocomplete:', err);
    }
  }

  private repositionPacContainers(input: HTMLInputElement, pacContainers: HTMLElement[]): void {
    if (!pacContainers || pacContainers.length === 0) {
      return;
    }
    const rect = input.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    pacContainers.forEach((pacContainer) => {
      if (pacContainer.parentElement !== document.body) {
        document.body.appendChild(pacContainer);
      }
      pacContainer.style.setProperty('position', 'fixed', 'important');
      pacContainer.style.setProperty('top', `${Math.round(rect.bottom)}px`, 'important');
      pacContainer.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
      pacContainer.style.setProperty('width', `${Math.max(Math.round(rect.width), 260)}px`, 'important');
      pacContainer.style.setProperty('z-index', '2147483647', 'important');
      pacContainer.style.setProperty('pointer-events', 'auto', 'important');
      pacContainer.style.setProperty('opacity', '1', 'important');
    });
    const lastContainer = pacContainers[pacContainers.length - 1];
    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'post-fix-2',hypothesisId:'H9',location:'google-places-shim.ts:208',message:'Repositioned pac containers',data:{pacCount:pacContainers.length,lastParent:lastContainer?.parentElement?.tagName||null,top:lastContainer?.style.top||null,left:lastContainer?.style.left||null,width:lastContainer?.style.width||null,zIndex:lastContainer?.style.zIndex||null,pointerEvents:lastContainer?.style.pointerEvents||null,opacity:lastContainer?.style.opacity||null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  /**
   * The legacy library accepted a loose options bag. Pass through everything
   * Google understands; silently drop anything that's not a plain object so a
   * stray `undefined`/`null` from a parent form doesn't crash the constructor.
   */
  private normalizeOptions(options: any): any {
    if (!options || typeof options !== 'object') {
      return {};
    }
    return options;
  }
}

@NgModule({
  declarations: [GooglePlaceDirective],
  exports: [GooglePlaceDirective],
})
export class GooglePlaceModule {}

export interface Address {
  [key: string]: unknown;
}
