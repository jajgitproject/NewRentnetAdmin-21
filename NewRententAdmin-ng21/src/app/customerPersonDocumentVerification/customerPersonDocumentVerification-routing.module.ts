// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonDocumentVerificationComponent } from './customerPersonDocumentVerification.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonDocumentVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonDocumentVerificationRoutingModule {}

