// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateBillMainComponent } from './generateBillMain.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateBillMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateBillMainRoutingModule {}

