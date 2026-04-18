// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverDocumentVerificationComponent } from './driverDocumentVerification.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDocumentVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverDocumentVerificationRoutingModule {}

