// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettledRateClosingComponent } from './settledRateClosing.component';


const routes: Routes = [
  {
    path: '',
    component: SettledRateClosingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettledRateClosingRoutingModule {}

