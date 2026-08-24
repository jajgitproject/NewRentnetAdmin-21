// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutySlipLobExportComponent } from './dutySlipLobExport.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipLobExportComponent,
    data: {
      requiredPageKey: 'DutySlip Map / Running Export',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DutySlipLobExportRoutingModule {}
