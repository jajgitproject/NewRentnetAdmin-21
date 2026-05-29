// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZonalDutyRegisterComponent } from './zonalDutyRegister.component';

const routes: Routes = [
  {
    path: '',
    component: ZonalDutyRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonalDutyRegisterRoutingModule {}

