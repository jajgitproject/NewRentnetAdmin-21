// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrationLogComponent } from './integrationLog.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationLogRoutingModule {}

