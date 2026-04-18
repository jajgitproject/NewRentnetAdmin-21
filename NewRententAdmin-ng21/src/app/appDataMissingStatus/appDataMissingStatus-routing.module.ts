// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDataMissingStatusComponent } from './appDataMissingStatus.component';

const routes: Routes = [
  {
    path: '',
    component: AppDataMissingStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppDataMissingStatusRoutingModule {}

