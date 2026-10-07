import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GtrackRunningDetailsComponent } from './gtrackRunningDetails.component';

const routes: Routes = [
  {
    path: '',
    component: GtrackRunningDetailsComponent,
    data: {
      requiredPageKey: 'Gtrack Running Details',
      alternatePageKeys: ['gtrackRunningDetails', 'bulkInvoice', 'Closing', 'closingOne'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GtrackRunningDetailsRoutingModule {}
