// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidateOTPComponent } from './validateOTP.component';

const routes: Routes = [
  {
    path: '',
    component: ValidateOTPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidateOTPRoutingModule {}

