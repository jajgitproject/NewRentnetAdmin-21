// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KamDetailsComponent } from './kamDetails.component';

const routes: Routes = [
  {
    path: '',
    component: KamDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KamDetailsRoutingModule {}

