// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonDocumentComponent } from './customerPersonDocument.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonDocumentRoutingModule {}

