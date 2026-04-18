// @ts-nocheck
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


