// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app-layout/main-layout/main-layout.component';
import { FilterPipe } from './sidebar/filter.pipe';
import { RouterModule } from '@angular/router';
import { NoSidebarLayoutComponent } from './app-layout/no-sidebar-layout/no-sidebar-layout.component';
import { ChangePasswordService } from '../changePassword/changePassword.service';
// import { RolePageMappingService } from '../rolePageMapping/rolePageMapping.service';
// import { FilterPipe } from './sidebar/filter.pipe';
@NgModule({
  imports: [CommonModule, NgbModule, MatTabsModule],
  declarations: [AuthLayoutComponent, MainLayoutComponent, FilterPipe,NoSidebarLayoutComponent],
  bootstrap: [MainLayoutComponent],
  providers:[ChangePasswordService]
})
export class LayoutModule {}

