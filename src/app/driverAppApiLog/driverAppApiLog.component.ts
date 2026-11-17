import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-driver-app-api-log',
  template: `
    <app-driver-app-transaction-log
      kind="api"
      title="Driver App API Log"
      crumb="Driver App API Log">
    </app-driver-app-transaction-log>
  `
})
export class DriverAppApiLogComponent {}
