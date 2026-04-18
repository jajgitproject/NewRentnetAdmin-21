// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonDriverRestrictionComponent } from './customerPersonDriverRestriction.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonDriverRestrictionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonDriverRestrictionRoutingModule {}

