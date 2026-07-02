// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierPayoutComponent } from './supplierPayout.component';

const routes: Routes = [{ path: '', component: SupplierPayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierPayoutRoutingModule {}
