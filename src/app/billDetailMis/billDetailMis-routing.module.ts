// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillDetailMisComponent } from './billDetailMis.component';

const routes: Routes = [{ path: '', component: BillDetailMisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillDetailMisRoutingModule {}
