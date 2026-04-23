// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalSMSDetailsComponent } from './additionalSMSDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalSMSDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalSMSDetailsRoutingModule {}

