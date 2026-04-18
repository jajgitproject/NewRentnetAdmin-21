// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropOffDetailsComponent } from './dropOffDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DropOffDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DropOffDetailsRoutingModule {}

