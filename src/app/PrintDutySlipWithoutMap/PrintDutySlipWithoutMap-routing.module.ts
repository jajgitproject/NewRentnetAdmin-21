// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintDutySlipWithoutMapComponent } from './PrintDutySlipWithoutMap.component';

const routes: Routes = [
  {
    path: '',
    component: PrintDutySlipWithoutMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintDutySlipWithoutMapRoutingModule {}

