// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebitTypeComponent } from './debitType.component';

const routes: Routes = [
  {
    path: '',
    component: DebitTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitTypeRoutingModule {}

