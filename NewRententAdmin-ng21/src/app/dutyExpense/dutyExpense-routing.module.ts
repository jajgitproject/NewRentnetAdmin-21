// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyExpenseComponent } from './dutyExpense.component';

const routes: Routes = [
  {
    path: '',
    component: DutyExpenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyExpenseRoutingModule {}

