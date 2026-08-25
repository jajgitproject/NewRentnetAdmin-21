import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkReadyForBulkBillingComponent } from './markReadyForBulkBilling.component';

const routes: Routes = [
  {
    path: '',
    component: MarkReadyForBulkBillingComponent,
    data: {
      requiredPageKey: 'Mark Ready For Bulk Billing',
      alternatePageKeys: [
        'markReadyForBulkBilling',
        'bulkInvoice',
        'bulkGfb',
        'closingOne',
        'Closing',
        'generateEInvoice',
        'Generate E - Invoice',
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarkReadyForBulkBillingRoutingModule {}
