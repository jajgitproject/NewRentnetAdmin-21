// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarAndDriverAllotmentTempComponent } from './CarAndDriverAllotmentTemp.component';

const routes: Routes = [
  {
    path: '',
    component: CarAndDriverAllotmentTempComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarAndDriverAllotmentTempRoutingModule {}

