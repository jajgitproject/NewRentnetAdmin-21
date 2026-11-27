// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitVoucherComponent } from './debit-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: DebitVoucherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitVoucherRoutingModule {}