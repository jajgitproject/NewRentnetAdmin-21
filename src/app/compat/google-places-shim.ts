// @ts-nocheck
/**
 * TODO: This is a LOCAL NO-OP STUB for the deprecated
 * `ngx-google-places-autocomplete` library (last published 2019,
 * Angular 2-era, incompatible with Angular 21 Ivy).
 *
 * The directive matches the selector `[ngx-google-places-autocomplete]`
 * and accepts `[options]` + `(onAddressChange)` so existing templates
 * compile, but it does NOT wire up Google Places Autocomplete.
 *
 * To restore real autocomplete behaviour, replace this with a custom
 * directive that drives `google.maps.places.Autocomplete` against the
 * host `<input>` element and emits `onAddressChange` with the resolved
 * PlaceResult. The Google Maps API key is already surfaced via
 * RuntimeConfigService (`googleMapsApiKey`).
 */
import { Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';

@Directive({
  selector: '[ngx-google-places-autocomplete]',
  exportAs: 'ngx-places',
  standalone: false,
})
export class GooglePlaceDirective {
  @Input('options') options: unknown;
  @Output() onAddressChange = new EventEmitter<unknown>();
}

@NgModule({
  declarations: [GooglePlaceDirective],
  exports: [GooglePlaceDirective],
})
export class GooglePlaceModule {}

export interface Address {
  [key: string]: unknown;
}
