// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockEmployeeComponent } from './unlockEmployee.component';

const routes: Routes = [
  {
    path: '',
    component: UnlockEmployeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockEmployeeRoutingModule {}

