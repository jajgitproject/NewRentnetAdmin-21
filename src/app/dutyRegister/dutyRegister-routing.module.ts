// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyRegisterComponent } from './dutyRegister.component';

const routes: Routes = [
  {
    path: '',
    component: DutyRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyRegisterRoutingModule {}

