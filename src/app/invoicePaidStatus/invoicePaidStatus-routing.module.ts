// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicePaidStatusComponent } from './invoicePaidStatus.component';

const routes: Routes = [{ path: '', component: InvoicePaidStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicePaidStatusRoutingModule {}
