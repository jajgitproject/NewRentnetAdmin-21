// @ts-nocheck
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicsTestingService } from './dynamicsTesting.service';

type DynamicsAction = 'invoice' | 'einvoice';

@Component({
  standalone: false,
  selector: 'app-dynamics-testing',
  templateUrl: './dynamicsTesting.component.html',
  styleUrls: ['./dynamicsTesting.component.scss']
})
export class DynamicsTestingComponent {
  invoiceId = '';
  busy = false;
  activeAction: DynamicsAction | null = null;
  hasResponse = false;
  apiStatusCode: number | null = null;
  dynamicsStatusCode: number | null = null;
  dynamicsStatusCodeName = '';
  dynamicsIsSuccess = false;
  responseMessage = '';
  responseBody = '';
  responseTitle = '';
  dynamicsHistory: any = null;
  resolvedInvoiceNumber = '';
  customerBillingType = '';

  constructor(
    private dynamicsTestingService: DynamicsTestingService,
    private snackBar: MatSnackBar
  ) {}

  createInvoice(): void {
    this.runAction('invoice', (invoiceId) => this.dynamicsTestingService.sendInvoiceToDynamics(invoiceId));
  }

  sendEInvoice(): void {
    this.runAction('einvoice', (invoiceId) => this.dynamicsTestingService.sendEInvoiceToDynamics(invoiceId));
  }

  private runAction(
    action: DynamicsAction,
    requestFactory: (invoiceId: number) => any
  ): void {
    const invoiceId = Number(String(this.invoiceId || '').trim());
    if (!invoiceId || Number.isNaN(invoiceId) || invoiceId <= 0) {
      this.showNotification('snackbar-danger', 'Please enter a valid Invoice ID.', 'bottom', 'center');
      return;
    }

    this.busy = true;
    this.activeAction = action;
    this.hasResponse = false;
    this.apiStatusCode = null;
    this.dynamicsStatusCode = null;
    this.dynamicsStatusCodeName = '';
    this.dynamicsIsSuccess = false;
    this.responseMessage = '';
    this.responseBody = '';
    this.dynamicsHistory = null;
    this.resolvedInvoiceNumber = '';
    this.customerBillingType = '';
    this.responseTitle = action === 'invoice'
      ? 'Create Invoice Response'
      : 'E-Invoice PATCH Response';

    requestFactory(invoiceId).subscribe({
      next: (httpResponse) => {
        this.busy = false;
        this.hasResponse = true;
        this.apiStatusCode = httpResponse.status;

        const body = httpResponse.body || {};
        const dynamicsResult = body.dynamicsApiResult || body.DynamicsApiResult || null;

        this.dynamicsStatusCode = dynamicsResult
          ? Number(dynamicsResult.statusCode ?? dynamicsResult.StatusCode ?? 0)
          : null;
        this.dynamicsStatusCodeName = dynamicsResult
          ? String(dynamicsResult.statusCodeName ?? dynamicsResult.StatusCodeName ?? '')
          : '';
        const alreadyExists = Boolean(
          dynamicsResult?.alreadyExistsInDynamics
            ?? dynamicsResult?.AlreadyExistsInDynamics
        )
          || dynamicsResult?.statusCodeName === 'AlreadyExists'
          || dynamicsResult?.StatusCodeName === 'AlreadyExists';

        this.dynamicsIsSuccess = dynamicsResult
          ? Boolean(dynamicsResult.isSuccess ?? dynamicsResult.IsSuccess) || alreadyExists
          : false;

        this.dynamicsHistory = body.dynamicsApiHistory ?? body.DynamicsApiHistory ?? null;
        this.resolvedInvoiceNumber = String(
          body.invoiceNumberWithPrefix
            ?? body.InvoiceNumberWithPrefix
            ?? body.requestPayload?.invoiceNo
            ?? body.RequestPayload?.InvoiceNo
            ?? ''
        ).trim();
        this.customerBillingType = String(
          body.customerBillingType
            ?? body.CustomerBillingType
            ?? body.requestPayload?.type
            ?? body.RequestPayload?.Type
            ?? ''
        ).trim();

        this.responseMessage = String(
          body.message
            ?? body.Message
            ?? body.result
            ?? dynamicsResult?.errorMessage
            ?? dynamicsResult?.ErrorMessage
            ?? dynamicsResult?.reasonPhrase
            ?? dynamicsResult?.ReasonPhrase
            ?? (this.dynamicsIsSuccess ? 'Request completed successfully.' : '')
        ).trim();

        this.responseBody = this.formatResponseBody(body, dynamicsResult, action);

        if (this.responseMessage) {
          this.showNotification(
            this.dynamicsIsSuccess ? 'snackbar-success' : 'snackbar-danger',
            this.responseMessage,
            'bottom',
            'center'
          );
        }
      },
      error: (err) => {
        this.busy = false;
        this.hasResponse = true;
        this.apiStatusCode = err?.status ?? 0;
        this.dynamicsIsSuccess = false;
        this.resolvedInvoiceNumber = String(
          err?.error?.invoiceNumberWithPrefix
            ?? err?.error?.InvoiceNumberWithPrefix
            ?? ''
        ).trim();
        this.customerBillingType = String(
          err?.error?.customerBillingType
            ?? err?.error?.CustomerBillingType
            ?? ''
        ).trim();
        this.responseMessage = this.extractErrorMessage(err);
        this.responseBody = this.formatResponseBody(err?.error, null, action);
        this.showNotification('snackbar-danger', this.responseMessage || 'Request failed.', 'bottom', 'center');
      }
    });
  }

  private formatResponseBody(body: any, dynamicsResult: any, action: DynamicsAction): string {
    if (!body && !dynamicsResult) {
      return '';
    }

    const display: any = {
      invoiceID: body?.invoiceID ?? body?.InvoiceID,
      invoiceNumberWithPrefix: body?.invoiceNumberWithPrefix ?? body?.InvoiceNumberWithPrefix,
      customerBillingType: body?.customerBillingType ?? body?.CustomerBillingType,
      invoiceFound: body?.invoiceFound ?? body?.InvoiceFound,
      message: body?.message ?? body?.Message,
      result: body?.result,
      dynamicsApiHistory: body?.dynamicsApiHistory ?? body?.DynamicsApiHistory,
      dynamicsApiResult: dynamicsResult
        ? {
            statusCode: dynamicsResult.statusCode ?? dynamicsResult.StatusCode,
            statusCodeName: dynamicsResult.statusCodeName ?? dynamicsResult.StatusCodeName,
            isSuccess: dynamicsResult.isSuccess ?? dynamicsResult.IsSuccess,
            reasonPhrase: dynamicsResult.reasonPhrase ?? dynamicsResult.ReasonPhrase,
            errorMessage: dynamicsResult.errorMessage ?? dynamicsResult.ErrorMessage,
            responseBody: this.tryParseJson(
              dynamicsResult.responseBody ?? dynamicsResult.ResponseBody
            )
          }
        : null,
      requestPayload: body?.requestPayload ?? body?.RequestPayload,
      finalSalesInvoicePayload: body?.finalSalesInvoicePayload ?? body?.FinalSalesInvoicePayload
    };

    if (action === 'invoice') {
      delete display.finalSalesInvoicePayload;
    } else {
      delete display.requestPayload;
    }

    return JSON.stringify(display, null, 2);
  }

  private tryParseJson(value: any): any {
    if (typeof value !== 'string' || !value.trim()) {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private extractErrorMessage(err: any): string {
    const message = err?.error?.message
      ?? err?.error?.Message
      ?? err?.error?.result
      ?? err?.message
      ?? err?.statusText;
    return String(message || 'Request failed.').trim();
  }

  showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string): void {
    this.snackBar.open(text, '', {
      duration: 4000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
