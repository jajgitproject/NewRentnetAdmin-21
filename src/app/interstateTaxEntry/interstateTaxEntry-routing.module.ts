// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterstateTaxEntryComponent } from './interstateTaxEntry.component';

const routes: Routes = [
  {
    path: '',
    component: InterstateTaxEntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterstateTaxEntryRoutingModule {}

