// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalKmsDetailsComponent } from './additionalKmsDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalKmsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalKmsDetailsRoutingModule {}

