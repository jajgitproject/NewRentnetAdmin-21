// @ts-nocheck
import { Router } from '@angular/router';
import { GeneralService } from '../general/general.service';

/** Open a customer-scoped child route in a new tab with encrypted query params. */
export function openCustomerChildRouteInNewTab(
  generalService: GeneralService,
  router: Router,
  routePath: string,
  row: { customerID: number | string; customerName: string }
): void {
  const encryptedCustomerID = encodeURIComponent(
    generalService.encrypt(String(row.customerID))
  );
  const encryptedCustomerName = encodeURIComponent(
    generalService.encrypt(row.customerName)
  );
  const baseUrl = generalService.FormURL;
  const url = router.serializeUrl(
    router.createUrlTree([routePath], {
      queryParams: {
        CustomerID: encryptedCustomerID,
        CustomerName: encryptedCustomerName,
      },
    })
  );
  window.open(baseUrl + url, '_blank');
}
