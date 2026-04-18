// @ts-nocheck
import { Directive, Input, NgModule } from '@angular/core';

@Directive({
  selector:
    'canvas[baseChart],canvas[chartType],canvas[datasets],canvas[labels],canvas[options],canvas[plugins],canvas[legend],canvas[colors]',
  standalone: false,
})
export class BaseChartDirective {
  @Input() chartType: unknown;
  @Input() datasets: unknown;
  @Input() labels: unknown;
  @Input() options: unknown;
  @Input() plugins: unknown;
  @Input() legend: unknown;
  @Input() colors: unknown;
}

@NgModule({
  declarations: [BaseChartDirective],
  exports: [BaseChartDirective],
})
export class ChartsModule {}


