// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintInvoiceSummaryComponent } from './printInvoiceSummary.component';
import { PrintInvoiceSummaryRoutingModule } from './printInvoiceSummary-routing.module';
import { PrintInvoiceSummaryService } from './printInvoiceSummary.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PrintInvoiceSummaryComponent],
  imports: [CommonModule, PrintInvoiceSummaryRoutingModule, MatButtonModule],
  providers: [PrintInvoiceSummaryService]
})
export class PrintInvoiceSummaryModule {}
