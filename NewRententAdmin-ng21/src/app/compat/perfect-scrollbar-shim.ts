// @ts-nocheck
import { Directive, InjectionToken, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[perfectScrollbar]',
  standalone: false,
})
export class PerfectScrollbarDirective {
  @Input('perfectScrollbar') config: unknown;
}

export interface PerfectScrollbarConfigInterface {
  [key: string]: unknown;
}

export const PERFECT_SCROLLBAR_CONFIG =
  new InjectionToken<PerfectScrollbarConfigInterface>('PERFECT_SCROLLBAR_CONFIG');

@NgModule({
  declarations: [PerfectScrollbarDirective],
  exports: [PerfectScrollbarDirective],
})
export class PerfectScrollbarModule {}


