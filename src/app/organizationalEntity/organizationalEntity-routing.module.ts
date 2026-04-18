// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationalEntityComponent } from './organizationalEntity.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationalEntityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalEntityRoutingModule {}

