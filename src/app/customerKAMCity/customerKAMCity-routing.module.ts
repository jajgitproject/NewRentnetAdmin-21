// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerKAMCityComponent } from './customerKAMCity.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerKAMCityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerKAMCityRoutingModule {}

