// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClearIMEIComponent } from './clearIMEI.component';

const routes: Routes = [
  {
    path: '',
    component: ClearIMEIComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClearIMEIRoutingModule {}

