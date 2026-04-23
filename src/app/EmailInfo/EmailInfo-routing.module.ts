// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailInfoComponent } from './EmailInfo.component';

const routes: Routes = [
  {
    path: '',
    component: EmailInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailInfoRoutingModule {}

