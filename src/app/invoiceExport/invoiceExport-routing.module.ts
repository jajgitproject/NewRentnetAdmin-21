// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceExportComponent } from './invoiceExport.component';

const routes: Routes = [{ path: '', component: InvoiceExportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceExportRoutingModule {}
