// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkBillsDownloadComponent } from './bulkBillsDownload.component';

const routes: Routes = [
  {
    path: '',
    component: BulkBillsDownloadComponent,
    data: {
      requiredPageKey: 'Bulk Bills Download',
      alternatePageKeys: [
        'bulkBillsDownload',
        'invoiceHome',
        'Invoice Home',
        'controlPanelDesign',
        'Control Panel',
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkBillsDownloadRoutingModule {}
