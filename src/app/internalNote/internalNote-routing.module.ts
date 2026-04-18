// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalNoteComponent } from './internalNote.component';

const routes: Routes = [
  {
    path: '',
    component: InternalNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalNoteRoutingModule {}

