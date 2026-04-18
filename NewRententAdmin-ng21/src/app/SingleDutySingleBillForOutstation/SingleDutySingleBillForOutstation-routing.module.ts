// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleDutySingleBillForOutstationComponent } from './SingleDutySingleBillForOutstation.component';

const routes: Routes = [
  {
    path: '',
    component: SingleDutySingleBillForOutstationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDutySingleBillForOutstationRoutingModule {}

