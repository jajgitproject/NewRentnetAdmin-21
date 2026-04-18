// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalNoteDetailsComponent } from './internalNoteDetails.component';

const routes: Routes = [
  {
    path: '',
    component: InternalNoteDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalNoteDetailsRoutingModule {}

