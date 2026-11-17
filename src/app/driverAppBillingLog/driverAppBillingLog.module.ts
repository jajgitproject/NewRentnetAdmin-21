import { NgModule } from '@angular/core';
import { DriverAppTransactionLogModule } from '../driverAppTransactionLog/driverAppTransactionLog.module';
import { DriverAppBillingLogRoutingModule } from './driverAppBillingLog-routing.module';
import { DriverAppBillingLogComponent } from './driverAppBillingLog.component';

@NgModule({
  declarations: [DriverAppBillingLogComponent],
  imports: [
    DriverAppTransactionLogModule,
    DriverAppBillingLogRoutingModule
  ]
})
export class DriverAppBillingLogModule {}
