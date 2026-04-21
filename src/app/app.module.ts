// @ts-nocheck
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import{FormsModule} from '@angular/forms';
import { FilterPipe } from './layout/sidebar/filter.pipe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';
import { WINDOW_PROVIDERS } from './core/service/window.service';
import { GeneralService } from './general/general.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RolePageMappingService } from './rolePageMapping/rolePageMapping.service';
import { DurationPipe } from './clossingScreen/duration.pipe';
import { NoSidebarLayoutComponent } from './layout/app-layout/no-sidebar-layout/no-sidebar-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { ChangePasswordService } from './changePassword/changePassword.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoDataDialogModule } from './no-data-dialog/no-data-dialog.module';
import { ChangePasswordDialogModule } from './changePassword/change-password-dialog.module';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RuntimeConfigService } from './core/service/runtime-config.service';
import { GlobalErrorHandler } from './core/error/global-error.handler';

export function initRuntimeConfig(runtime: RuntimeConfigService): () => Promise<void> {
  return () => runtime.load();
}

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    NoSidebarLayoutComponent,
    FilterPipe,
  ],
  imports: [
    MatProgressSpinnerModule, 
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FormsModule,
    MatDialogModule,
    NoDataDialogModule,
    ChangePasswordDialogModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

    CoreModule,
    SharedModule,
    MatSnackBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initRuntimeConfig,
      deps: [RuntimeConfigService],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    RolePageMappingService,
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        autoFocus: 'first-tabbable',
        restoreFocus: true,
        maxWidth: '90vw',
      },
    },
    GeneralService,
    provideCharts(withDefaultRegisterables()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: 'assets/i18n/',
        suffix: '.json'
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    WINDOW_PROVIDERS,ChangePasswordService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}


