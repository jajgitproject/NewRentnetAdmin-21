// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMisComponent } from './vendorMis.component';

const routes: Routes = [{ path: '', component: VendorMisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorMisRoutingModule {}
