// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverDocumentComponent } from './driverDocument.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverDocumentRoutingModule {}

