// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppBillingReceiptComponent } from './appBillingReceipt.component';

const routes: Routes = [{ path: '', component: AppBillingReceiptComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppBillingReceiptRoutingModule {}
