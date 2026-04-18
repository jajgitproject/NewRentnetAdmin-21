// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendEmsAndEmailComponent } from './sendEmsAndEmail.component';

const routes: Routes = [
  {
    path: '',
    component: SendEmsAndEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendEmsAndEmailRoutingModule {}

