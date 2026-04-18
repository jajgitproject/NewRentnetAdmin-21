// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { GaugeModule } from 'angular-gauge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TestComponent } from './test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { AdvanceTableTestComponent } from './advance-table-test/advance-table-test.component';
import { DeleteDialogTestComponent } from './advance-table-test/dialogsTest/delete-test/delete-test.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FormDialogTestComponent } from './advance-table-test/dialogsTest/form-dialog-test/form-dialog-test.component';
import { MaterialTableComponent } from './material-table/material-table.component';
import { CityMasterComponent } from './city-master/city-master.component';
import { EmployeeCrudComponent } from './employee-crud/employee-crud.component';
import { FormDialogCrudComponent } from './employee-crud/dialogscrud/form-dialog-crud/form-dialog-crud.component';
import { DeleteDialogCityComponent } from './city-master/dialogscity/delete-city/delete-city.component';
import { FormDialogCityComponent } from './city-master/dialogscity/form-dialog-city/form-dialog-city.component';
import { DeleteDialogCrudComponent } from './employee-crud/dialogscrud/delete-crud/delete-crud.component';



@NgModule({
  declarations: [
    MainComponent, 
    Dashboard2Component, 
    Dashboard3Component, 
    TestComponent,
    AdvanceTableTestComponent,
    DeleteDialogTestComponent,
    FormDialogTestComponent,   
    MaterialTableComponent,
    CityMasterComponent,
    EmployeeCrudComponent,
    DeleteDialogCrudComponent,
    FormDialogCrudComponent,
    DeleteDialogCityComponent,
    FormDialogCityComponent,
   
    

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSortModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MaterialFileInputModule,
    CommonModule,
    DashboardRoutingModule,
    chartjsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRadioModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    GaugeModule.forRoot()
  ],
  providers:[]
})
export class DashboardModule {}



