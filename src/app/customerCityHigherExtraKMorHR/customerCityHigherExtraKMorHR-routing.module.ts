// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCityHigherExtraKMorHRComponent } from './customerCityHigherExtraKMorHR.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCityHigherExtraKMorHRComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCityHigherExtraKMorHRRoutingModule {}
