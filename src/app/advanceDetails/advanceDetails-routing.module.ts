// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceDetailsComponent } from './advanceDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AdvanceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceDetailsRoutingModule {}

