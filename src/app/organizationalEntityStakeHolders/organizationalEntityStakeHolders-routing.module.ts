// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationalEntityStakeHoldersComponent } from './organizationalEntityStakeHolders.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationalEntityStakeHoldersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalEntityStakeHoldersRoutingModule {}

