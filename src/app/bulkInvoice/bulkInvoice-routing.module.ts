import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkInvoiceComponent } from './bulkInvoice.component';

const routes: Routes = [
  {
    path: '',
    component: BulkInvoiceComponent,
    data: {
      requiredPageKey: 'Bulk Invoice',
      alternatePageKeys: ['bulkInvoice', 'bulkGfb', 'closingOne', 'Closing', 'generateEInvoice', 'Generate E - Invoice'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkInvoiceRoutingModule {}
