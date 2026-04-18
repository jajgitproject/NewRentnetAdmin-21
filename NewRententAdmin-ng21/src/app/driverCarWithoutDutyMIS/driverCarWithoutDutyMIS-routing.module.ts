// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverCarWithoutDutyMISComponent } from './driverCarWithoutDutyMIS.component';



const routes: Routes = [
  {
    path: '',
    component: DriverCarWithoutDutyMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverCarWithoutDutyMISRoutingModule {}

