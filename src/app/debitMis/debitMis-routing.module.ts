import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitMisComponent } from './debitMis.component';

const routes: Routes = [{ path: '', component: DebitMisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitMisRoutingModule {}