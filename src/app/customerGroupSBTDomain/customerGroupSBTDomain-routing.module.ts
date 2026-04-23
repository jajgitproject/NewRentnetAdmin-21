// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerGroupSBTDomainComponent } from './customerGroupSBTDomain.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerGroupSBTDomainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerGroupSBTDomainRoutingModule {}

