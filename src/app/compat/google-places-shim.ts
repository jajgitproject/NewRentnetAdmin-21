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
  private destroyed = false;

  constructor(private elementRef: ElementRef<HTMLInputElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
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
    try {
      this.autocomplete = new google.maps.places.Autocomplete(
        input,
        this.normalizeOptions(this.options)
      );
      this.placeChangedListener = this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        // Bring the event back into Angular's zone so change detection runs
        // for downstream form updates (patchValue, etc.).
        this.zone.run(() => this.onAddressChange.emit(place));
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[google-places-shim] failed to init Autocomplete:', err);
    }
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
