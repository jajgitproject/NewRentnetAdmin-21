// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSpecificDetailsComponent } from './customerSpecificDetails.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerSpecificDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSpecificDetailsRoutingModule {}

