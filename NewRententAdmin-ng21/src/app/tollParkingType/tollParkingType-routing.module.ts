// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TollParkingTypeComponent } from './tollParkingType.component';

const routes: Routes = [
  {
    path: '',
    component: TollParkingTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TollParkingTypeRoutingModule {}

