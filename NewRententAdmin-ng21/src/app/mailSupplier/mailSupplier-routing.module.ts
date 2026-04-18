// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailSupplierComponent } from './mailSupplier.component';

const routes: Routes = [
  {
    path: '',
    component: MailSupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailSupplierRoutingModule {}

