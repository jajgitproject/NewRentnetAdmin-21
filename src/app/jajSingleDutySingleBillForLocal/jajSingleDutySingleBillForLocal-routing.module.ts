// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JajSingleDutySingleBillForLocalComponent } from './jajSingleDutySingleBillForLocal.component';


const routes: Routes = [
  {
    path: '',
    component: JajSingleDutySingleBillForLocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JajSingleDutySingleBillForLocalRoutingModule {}

