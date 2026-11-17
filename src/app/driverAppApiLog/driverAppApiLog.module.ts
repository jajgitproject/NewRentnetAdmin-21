import { NgModule } from '@angular/core';
import { DriverAppTransactionLogModule } from '../driverAppTransactionLog/driverAppTransactionLog.module';
import { DriverAppApiLogRoutingModule } from './driverAppApiLog-routing.module';
import { DriverAppApiLogComponent } from './driverAppApiLog.component';

@NgModule({
  declarations: [DriverAppApiLogComponent],
  imports: [
    DriverAppTransactionLogModule,
    DriverAppApiLogRoutingModule
  ]
})
export class DriverAppApiLogModule {}
