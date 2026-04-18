// @ts-nocheck
import { Component, Directive, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[owlDateTime]',
  standalone: false,
})
export class OwlDateTimeDirective {
  @Input('owlDateTime') picker: unknown;
}

@Directive({
  selector: '[owlDateTimeTrigger]',
  standalone: false,
})
export class OwlDateTimeTriggerDirective {
  @Input('owlDateTimeTrigger') picker: unknown;
}

@Component({
  selector: 'owl-date-time',
  template: '',
  standalone: false,
})
export class OwlDateTimeComponent {
  @Input() pickerType: string;
  @Input() selectMode: string;
  @Input() rangeSeparator: string;
  @Input() startAt: unknown;
  @Input() endAt: unknown;
  @Input() min: unknown;
  @Input() max: unknown;
  @Input() hour12Timer: boolean;
  @Input() stepMinute: number;
  @Input() stepHour: number;
  @Input() stepSecond: number;
}

@Component({
  selector: 'owl-date-time-inline',
  template: '',
  standalone: false,
})
export class OwlDateTimeInlineComponent {
  @Input() pickerType: string;
  @Input() selectMode: string;
}

@NgModule({
  declarations: [
    OwlDateTimeDirective,
    OwlDateTimeTriggerDirective,
    OwlDateTimeComponent,
    OwlDateTimeInlineComponent,
  ],
  exports: [
    OwlDateTimeDirective,
    OwlDateTimeTriggerDirective,
    OwlDateTimeComponent,
    OwlDateTimeInlineComponent,
  ],
})
export class OwlDateTimeModule {}

@NgModule({
  exports: [OwlDateTimeModule],
})
export class OwlNativeDateTimeModule {}


