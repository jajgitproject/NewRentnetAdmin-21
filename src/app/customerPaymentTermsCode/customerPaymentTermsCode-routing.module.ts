// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPaymentTermsCodeComponent } from './customerPaymentTermsCode.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentTermsCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPaymentTermsCodeRoutingModule {}

