// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherFilterComponent } from './otherFilter.component';

const routes: Routes = [
  {
    path: '',
    component: OtherFilterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherFilterRoutingModule {}

