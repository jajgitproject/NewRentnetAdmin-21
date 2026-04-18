// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SavedAddressComponent } from './savedAddress.component';

const routes: Routes = [
  {
    path: '',
    component: SavedAddressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedAddressRoutingModule {}

