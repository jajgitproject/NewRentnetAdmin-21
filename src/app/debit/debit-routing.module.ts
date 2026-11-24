// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebitComponent } from './debit.component';

const routes: Routes = [
  {
    path: '',
    component: DebitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitRoutingModule {}