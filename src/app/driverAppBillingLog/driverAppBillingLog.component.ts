import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-driver-app-billing-log',
  template: `
    <app-driver-app-transaction-log
      kind="billing"
      title="Driver App Billing Log"
      crumb="Driver App Billing Log">
    </app-driver-app-transaction-log>
  `
})
export class DriverAppBillingLogComponent {}
