// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonInventoryRestrictionComponent } from './customerPersonInventoryRestriction.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonInventoryRestrictionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonInventoryRestrictionRoutingModule {}

