// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../general/general.service';
import { ReservationComponent } from '../reservation/reservation.component';
import { TestBookingService } from './testBooking.service';

@Component({
  standalone: false,
  selector: 'app-testBooking',
  templateUrl: './testBooking.component.html',
  styleUrls: ['./testBooking.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TestBookingComponent implements OnInit {
  @ViewChild(ReservationComponent) reservationComponent: ReservationComponent;

  busy = false;
  ready = false;
  defaultsApplied = false;
  lookupError = '';
  statusMessage = '';
  reservationID: any = '';
  reservationGroupID: any = '';
  private bootstrapping = false;
  private applyingDefaults = false;
  private cachedDriver: any = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public generalService: GeneralService,
    public testBookingService: TestBookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((paramsData) => {
      const reservationID = this.decryptParam(paramsData.reservationID);
      if (reservationID) {
        this.reservationID = reservationID;
        this.reservationGroupID = this.decryptParam(paramsData.reservationGroupID);
        this.ready = true;
        this.bootstrapping = false;
        this.scheduleApplyDefaults();
        return;
      }
      if (!this.bootstrapping && !this.ready) {
        this.bootstrap();
      }
    });
  }

  onSave() {
    if (this.busy || !this.ready || this.lookupError) {
      if (this.lookupError) {
        this.showNotification('snackbar-danger', this.lookupError, 'bottom', 'center');
      }
      return;
    }
    if (!this.reservationComponent) {
      this.showNotification('snackbar-danger', 'Booking form is not ready.', 'bottom', 'center');
      return;
    }
    this.reservationComponent.saveFromTestPage();
  }

  onSavedAfterBooking(reservationID: any) {
    if (reservationID) {
      this.reservationID = reservationID;
    }
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.statusMessage = 'Hard allotting driver Anand Awasthy...';
    this.allotDriver()
      .then((message) => {
        this.showNotification('snackbar-success', message, 'bottom', 'center');
        this.statusMessage = message;
        this.reservationComponent?.showTestBookingSavePopup(message);
      })
      .catch((err) => {
        const message = this.errorText(err, 'Allotment failed.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
        this.statusMessage = message;
        this.reservationComponent?.showTestBookingSavePopup(message);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  onClearImei() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.statusMessage = 'Clearing IMEI for Anand Awasthy...';
    this.clearDriverImei()
      .then((message) => {
        this.showNotification('snackbar-success', message, 'bottom', 'center');
        this.statusMessage = message;
      })
      .catch((err) => {
        const message = this.errorText(err, 'Clear IMEI failed.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
        this.statusMessage = message;
      })
      .finally(() => {
        this.busy = false;
      });
  }

  onClear() {
    if (this.busy) {
      return;
    }
    this.ready = false;
    this.defaultsApplied = false;
    this.applyingDefaults = false;
    this.lookupError = '';
    this.statusMessage = '';
    this.reservationID = '';
    this.reservationGroupID = '';
    this.cachedDriver = null;
    this.bootstrapping = true;
    this.router.navigate(['/testBooking'], { queryParams: {}, replaceUrl: true }).then(() => {
      this.bootstrap();
    });
  }

  private async bootstrap(): Promise<void> {
    this.bootstrapping = true;
    this.busy = true;
    this.lookupError = '';
    this.statusMessage = 'Looking up test booking data...';
    try {
      const customer = await this.testBookingService.lookupCustomer('JAJ Technologies');
      if (!customer) {
        throw new Error('Could not find customer "JAJ Technologies".');
      }
      const customerType = await this.testBookingService.lookupCustomerType('Corporate');
      if (!customerType) {
        throw new Error('Could not find customer type "Corporate".');
      }
      customer.customerTypeID = customerType.customerTypeID;
      customer.customerType = customerType.customerType;
      const booker = await this.testBookingService.lookupBooker(
        customer.customerID,
        customer.customerGroupID,
        'Mayank Mishra'
      );
      if (!booker) {
        throw new Error('Could not find booker "Mayank Mishra".');
      }

      let sales = null;
      let kam = null;
      let location = null;
      try {
        sales = await this.testBookingService.lookupSalesManager(customer.customerID);
      } catch { /* optional until group create */ }
      try {
        kam = await this.testBookingService.lookupKam(customer.customerID);
      } catch { /* optional until group create */ }
      try {
        location = await this.testBookingService.lookupTransferLocation(customer.customerID);
      } catch { /* filled later from city */ }

      if (!sales) {
        throw new Error('Sales Executive is missing for JAJ Technologies.');
      }
      if (!kam) {
        throw new Error('KAM is missing for JAJ Technologies.');
      }

      const payload = this.buildGroupPayload(customer, booker, sales, kam, location);
      this.statusMessage = 'Creating reservation group...';
      const response = await this.testBookingService.toPromise(
        this.testBookingService.createReservationGroup(payload)
      );
      const reservationGroupID = response?.reservationGroupID || response?.ReservationGroupID;
      const reservationID = response?.reservationID || response?.ReservationID;
      if (!reservationGroupID || !reservationID) {
        throw new Error('Reservation group was created but IDs were not returned.');
      }

      this.reservationID = reservationID;
      this.reservationGroupID = reservationGroupID;
      this.statusMessage = 'Loading booking form...';
      await this.router.navigate(['/testBooking'], {
        queryParams: this.buildQueryParams(customer, reservationID, reservationGroupID, location),
        replaceUrl: true,
      });
    } catch (err) {
      this.bootstrapping = false;
      this.lookupError = this.errorText(err, 'Could not start Test Booking.');
      this.statusMessage = this.lookupError;
      this.showNotification('snackbar-danger', this.lookupError, 'bottom', 'center');
    } finally {
      this.busy = false;
    }
  }

  private scheduleApplyDefaults(): void {
    if (this.defaultsApplied || this.applyingDefaults) {
      return;
    }
    setTimeout(() => this.applyDefaultsWhenReady(), 0);
  }

  private applyDefaultsWhenReady(): void {
    if (this.defaultsApplied || this.applyingDefaults) {
      return;
    }
    if (!this.reservationComponent) {
      setTimeout(() => this.applyDefaultsWhenReady(), 150);
      return;
    }
    this.applyingDefaults = true;
    this.busy = true;
    this.statusMessage = 'Applying test booking defaults...';
    this.reservationComponent.applyTestBookingDefaults()
      .then((error) => {
        this.applyingDefaults = false;
        this.busy = false;
        if (error) {
          this.lookupError = error;
          this.statusMessage = error;
          this.showNotification('snackbar-danger', error, 'bottom', 'center');
          return;
        }
        this.defaultsApplied = true;
        this.lookupError = '';
        this.statusMessage = 'Test booking defaults applied.';
      })
      .catch((err) => {
        this.applyingDefaults = false;
        this.busy = false;
        this.lookupError = this.errorText(err, 'Could not apply test booking defaults.');
        this.statusMessage = this.lookupError;
        this.showNotification('snackbar-danger', this.lookupError, 'bottom', 'center');
      });
  }

  private async allotDriver(): Promise<string> {
    const driver = await this.resolveDriver();
    const association = await this.testBookingService.lookupDriverInventory(driver.driverID, 'UP16GA6220');
    const inventoryID = Number(association?.inventoryID || association?.InventoryID || 0);
    if (!association || !inventoryID) {
      throw new Error('Car UP16GA6220 is not associated with driver Anand Awasthy.');
    }
    const inventoryOwnedSupplied = this.testBookingService.pickOwnedSupplied(association);
    if (!inventoryOwnedSupplied) {
      throw new Error('The car UP16GA6220 is missing Owned/Supplied.');
    }
    const inventorySupplier = await this.testBookingService.resolveSupplier(association);
    if (!inventorySupplier.name) {
      throw new Error('The car UP16GA6220 is missing Inventory Supplier Name.');
    }
    const driverOwnedSupplier = this.testBookingService.firstNonEmpty(
      association.driverOwnedSupplier,
      association.DriverOwnedSupplier,
      association.driverSupplierType,
      association.DriverSupplierType,
      driver.ownedSupplier,
      driver.OwnedSupplier
    );
    let driverSupplierID = Number(
      association.driverSupplierID || association.DriverSupplierID || driver.supplierID || driver.SupplierID || 0
    );
    let driverSupplierName = this.testBookingService.firstNonEmpty(
      association.driverSupplierName,
      association.DriverSupplierName,
      driver.supplierName,
      driver.SupplierName,
      driver.supplier,
      driver.Supplier
    );
    if (!driverSupplierName && driverSupplierID) {
      const resolvedDriverSupplier = await this.testBookingService.resolveSupplier({
        supplierID: driverSupplierID,
      });
      driverSupplierName = resolvedDriverSupplier.name;
      driverSupplierID = resolvedDriverSupplier.id || driverSupplierID;
    }
    const payload = {
      allotmentID: -1,
      reservationID: Number(this.reservationID),
      inventoryID,
      registrationNumber: this.testBookingService.firstNonEmpty(
        association.inventoryName, association.InventoryName, association.inventory, association.Inventory, association.registrationNumber, 'UP16GA6220'
      ),
      vehicleID: association.vehicleID || association.VehicleID,
      vehicleName: this.testBookingService.firstNonEmpty(association.vehicle, association.Vehicle, association.vehicleName),
      vehicleCategoryID: association.vehicleCategoryID || association.VehicleCategoryID,
      vehicleCategoryName: this.testBookingService.firstNonEmpty(association.vehicleCategory, association.VehicleCategory, association.vehicleCategoryName),
      inventoryOwnedSupplied,
      inventorySupplierID: inventorySupplier.id || 0,
      inventorySupplierName: inventorySupplier.name,
      driverInventoryAssociationID: association.driverInventoryAssociationID || association.DriverInventoryAssociationID,
      driverID: driver.driverID || association.driverID || association.DriverID,
      driverName: driver.driverName || association.driverName || association.DriverName,
      driverOwnedSupplier,
      driverSupplierID,
      driverSupplierName,
      allotmentType: 'Hard',
      allotmentStatus: 'Alloted',
      allotmentRemark: 'Test Booking',
      driverAcceptanceStatus: 'Pending',
    };
    await this.testBookingService.toPromise(this.testBookingService.allot(payload));
    return 'Hard allotted driver Anand Awasthy with UP16GA6220.';
  }

  private async clearDriverImei(): Promise<string> {
    const driver = await this.resolveDriver();
    await this.testBookingService.toPromise(this.testBookingService.clearIMEI(driver.driverID));
    return 'Cleared IMEI for Anand Awasthy.';
  }

  private async resolveDriver(): Promise<any> {
    if (this.cachedDriver?.driverID) {
      return this.cachedDriver;
    }
    const driver = await this.testBookingService.lookupDriver('Anand Awasthy');
    if (!driver?.driverID) {
      throw new Error('Could not find driver "Anand Awasthy".');
    }
    this.cachedDriver = driver;
    return driver;
  }

  private buildGroupPayload(customer: any, booker: any, sales: any, kam: any, location: any): any {
    const bookerLabel = [
      booker.customerPersonName,
      booker.gender,
      booker.importance,
      booker.phone,
      booker.customerDepartment,
      booker.customerDesignation,
      booker.customerName,
    ].join('-');
    const salesLabel = [sales.firstName, sales.lastName].filter(Boolean).join(' ')
      + '-' + (sales.mobile || '') + '-' + (sales.email || '');
    const kamLabel = [kam.firstName, kam.lastName].filter(Boolean).join(' ')
      + '-' + (kam.mobile || '') + '-' + (kam.email || '');
    return {
      reservationGroupID: -1,
      reservationID: -1,
      customerID: customer.customerID,
      customer: customer.customerName,
      customerGroupID: customer.customerGroupID,
      customerGroup: customer.customerGroup,
      customerCustomerGroup: customer.customerName + '-' + customer.customerGroup,
      customerTypeID: customer.customerTypeID,
      customerType: customer.customerType,
      primaryBookerID: booker.customerPersonID,
      primaryBooker: bookerLabel,
      numberOfBookings: 1,
      bookingType: 'Normal',
      activationStatus: true,
      reservationExecutiveID: this.generalService.getUserID(),
      salesExecutiveID: sales.salesExecutiveID || sales.employeeID || 0,
      salesExecutive: salesLabel,
      kamID: kam.kamID || kam.employeeID || 0,
      kam: kamLabel,
      locationID: location?.organizationalEntityID || 0,
      locationName: location?.organizationalEntityName || '',
      reservationStartDate: null,
      reservationEndDate: null,
    };
  }

  private buildQueryParams(customer: any, reservationID: any, reservationGroupID: any, location: any): any {
    const enc = (value: any) => encodeURIComponent(this.generalService.encrypt(String(value ?? '')));
    const params: any = {
      reservationID: enc(reservationID),
      reservationGroupID: enc(reservationGroupID),
      customerID: enc(customer.customerID),
      customerName: enc(customer.customerName),
      customerTypeID: enc(customer.customerTypeID),
      customerType: enc(customer.customerType),
      customerGroupID: enc(customer.customerGroupID),
      customerGroup: enc(customer.customerGroup),
    };
    if (location?.organizationalEntityID) {
      params.transferedLocationID = enc(location.organizationalEntityID);
      params.transferedLocation = enc(location.organizationalEntityName);
    }
    return params;
  }

  private decryptParam(value: any): string {
    if (!value) {
      return '';
    }
    return this.generalService.decrypt(decodeURIComponent(value));
  }

  private errorText(err: any, fallback: string): string {
    const message = err?.error?.message || err?.message || err?.error || err;
    const text = String(message || '').trim();
    return text || fallback;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 4000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
