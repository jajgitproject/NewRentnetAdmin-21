// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerBillToShipToComponent } from './customerBillToShipTo.component';

const routes: Routes = [{ path: '', component: CustomerBillToShipToComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerBillToShipToRoutingModule {}
