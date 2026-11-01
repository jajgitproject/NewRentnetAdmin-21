import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KamAddressCorrectionComponent } from './kamAddressCorrection.component';
const routes: Routes = [
  { path: '', component: KamAddressCorrectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KamAddressCorrectionRoutingModule {}
