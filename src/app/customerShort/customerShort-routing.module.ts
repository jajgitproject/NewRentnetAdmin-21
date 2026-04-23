// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerShortComponent } from './customerShort.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerShortComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerShortRoutingModule {}

