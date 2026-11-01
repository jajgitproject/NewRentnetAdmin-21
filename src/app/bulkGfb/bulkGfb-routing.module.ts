import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkGfbComponent } from './bulkGfb.component';

const routes: Routes = [
  {
    path: '',
    component: BulkGfbComponent,
    data: {
      requiredPageKey: 'Bulk GFB',
      alternatePageKeys: ['bulkGfb', 'closingOne', 'Closing', 'generateEInvoice', 'Generate E - Invoice'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkGfbRoutingModule {}
