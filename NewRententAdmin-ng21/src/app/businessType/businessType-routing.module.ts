// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessTypeComponent } from './businessType.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessTypeRoutingModule {}

