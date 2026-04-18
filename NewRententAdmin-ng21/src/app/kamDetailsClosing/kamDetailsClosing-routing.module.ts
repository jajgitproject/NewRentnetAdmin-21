// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KAMDetailsClosingComponent } from './kamDetailsClosing.component';



const routes: Routes = [
  {
    path: '',
    component: KAMDetailsClosingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KAMDetailsClosingRoutingModule {}

