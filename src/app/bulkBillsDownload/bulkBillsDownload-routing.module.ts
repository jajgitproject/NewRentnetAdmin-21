// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkBillsDownloadComponent } from './bulkBillsDownload.component';

const routes: Routes = [{ path: '', component: BulkBillsDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkBillsDownloadRoutingModule {}
