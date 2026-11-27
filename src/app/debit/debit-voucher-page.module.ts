// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitVoucherComponent } from './debit-voucher.component';
import { DebitVoucherRoutingModule } from './debit-voucher-routing.module';
import { DebitService } from './debit.service';

@NgModule({
  declarations: [DebitVoucherComponent],
  imports: [CommonModule, DebitVoucherRoutingModule],
  providers: [DebitService],
})
export class DebitVoucherPageModule {}