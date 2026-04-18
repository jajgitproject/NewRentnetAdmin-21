// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeVendorComponent } from './changeVendor.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeVendorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeVendorRoutingModule {}

