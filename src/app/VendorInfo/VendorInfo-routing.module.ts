// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorInfoComponent } from './VendorInfo.component';

const routes: Routes = [
  {
    path: '',
    component: VendorInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorInfoRoutingModule {}

