// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttachAnotherDriverComponent } from './AttachAnotherDriver.component';

const routes: Routes = [
  {
    path: '',
    component: AttachAnotherDriverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachAnotherDriverRoutingModule {}

