// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditNotePrintComponent } from './creditNotePrint.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNotePrintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNotePrintRoutingModule {}

