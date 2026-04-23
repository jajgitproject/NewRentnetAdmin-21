// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarPaidTaxMISComponent } from './carPaidTaxMIS.component';

const routes: Routes = [
  {
    path: '',
    component: CarPaidTaxMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarPaidTaxMISRoutingModule {}

