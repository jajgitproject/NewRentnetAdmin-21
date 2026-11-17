import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverAppApiLogComponent } from './driverAppApiLog.component';

const routes: Routes = [
  { path: '', component: DriverAppApiLogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverAppApiLogRoutingModule {}
