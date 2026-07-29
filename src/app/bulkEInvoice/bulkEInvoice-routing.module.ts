// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkEInvoiceComponent } from './bulkEInvoice.component';

const routes: Routes = [
  {
    path: '',
    component: BulkEInvoiceComponent,
    data: {
      requiredPageKey: 'Bulk E-Invoice',
      alternatePageKeys: ['bulkEInvoice', 'generateEInvoice', 'Generate E - Invoice'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkEInvoiceRoutingModule {}
