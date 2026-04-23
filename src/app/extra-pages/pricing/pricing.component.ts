// @ts-nocheck
import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
@Component({
  standalone: false,
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
    imports: [BreadcrumbComponent]
})
export class PricingComponent {
  breadscrums = [
    {
      title: 'Pricing',
      items: ['Extra'],
      active: 'Pricing',
    },
  ];

  constructor() {
    //constructor
  }
}


