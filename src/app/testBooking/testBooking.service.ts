// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { ReservationGroupService } from '../reservationGroup/reservationGroup.service';
import { ReservationGroupDetailsService } from '../reservationGroupDetails/reservationGroupDetails.service';
import { AllotCarAndDriverService } from '../allotCarAndDriver/allotCarAndDriver.service';
import { DriverService } from '../driver/driver.service';
import { DriverInventoryAssociationService } from '../driverInventoryAssociation/driverInventoryAssociation.service';

@Injectable()
export class TestBookingService {
  constructor(
    public generalService: GeneralService,
    private reservationGroupService: ReservationGroupService,
    private reservationGroupDetailsService: ReservationGroupDetailsService,
    private allotCarAndDriverService: AllotCarAndDriverService,
    private driverService: DriverService,
    private driverInventoryAssociationService: DriverInventoryAssociationService,
    private httpClient: HttpClient
  ) {}

  asList(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.items)) {
      return data.items;
    }
    if (Array.isArray(data?.$values)) {
      return data.$values;
    }
    if (Array.isArray(data?.driverInventoryAssociationModel)) {
      return data.driverInventoryAssociationModel;
    }
    if (data && typeof data === 'object' && (data.inventoryID || data.InventoryID || data.driverID || data.driverName)) {
      return [data];
    }
    return [];
  }

  normalize(value: any): string {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');
  }

  findByName(list: any[], wanted: string, keys: string[]): any {
    const rows = this.asList(list);
    const wantedNorm = this.normalize(wanted);
    if (!wantedNorm || !rows.length) {
      return null;
    }
    const read = (row: any) => keys.map((key) => String(row?.[key] ?? '')).join(' ');
    return rows.find((row) => this.normalize(read(row)) === wantedNorm)
      || rows.find((row) => {
        const actual = this.normalize(read(row));
        return actual.includes(wantedNorm) || wantedNorm.includes(actual);
      })
      || null;
  }

  toPromise<T>(obs: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      obs.subscribe({
        next: (value) => resolve(value),
        error: (err) => reject(err),
      });
    });
  }

  async lookupCustomer(name: string): Promise<any> {
    const prefix = String(name || '').trim().split(/\s+/)[0] || name;
    const list = this.asList(await this.toPromise(this.generalService.getCustomerPrefix(prefix)));
    return this.findByName(list, name, ['customerName']);
  }

  async lookupBooker(customerID: number, customerGroupID: number, name: string): Promise<any> {
    let list: any[] = [];
    try {
      list = this.asList(await this.toPromise(this.generalService.GetCPForBookerOnCustomer(customerID)));
    } catch { /* try group list */ }
    if (!list.length && customerGroupID) {
      try {
        list = this.asList(await this.toPromise(this.generalService.GetCPForBooker(customerGroupID)));
      } catch { /* try prefix */ }
    }
    let found = this.findByName(list, name, ['customerPersonName']);
    if (!found) {
      const prefix = String(name || '').trim().split(/\s+/)[0] || name;
      try {
        const prefixed = this.asList(await this.toPromise(
          this.generalService.getCustomerPersonPrefix(customerID, prefix)
        ));
        found = this.findByName(prefixed, name, ['customerPersonName']);
      } catch { /* none */ }
    }
    return found;
  }

  async lookupCustomerType(name: string): Promise<any> {
    const list = this.asList(await this.toPromise(this.generalService.getCustomerType()));
    return this.findByName(list, name, ['customerType']);
  }

  async lookupPassenger(customerID: number, customerGroupID: number, name: string): Promise<any> {
    let list: any[] = [];
    if (customerGroupID) {
      try {
        list = this.asList(await this.toPromise(this.generalService.GetCPForPassenger(customerGroupID)));
      } catch { /* try prefix */ }
    }
    let found = this.findByName(list, name, ['customerPersonName']);
    if (!found && customerID) {
      const prefix = String(name || '').trim().split(/\s+/)[0] || name;
      try {
        const prefixed = this.asList(await this.toPromise(
          this.generalService.getCustomerPersonPrefix(customerID, prefix)
        ));
        found = this.findByName(prefixed, name, ['customerPersonName']);
      } catch { /* none */ }
    }
    return found;
  }

  async lookupSalesManager(customerID: number): Promise<any> {
    const list = this.asList(await this.toPromise(this.generalService.GetSalesManager(customerID)));
    return list[0] || null;
  }

  async lookupKam(customerID: number): Promise<any> {
    const list = this.asList(await this.toPromise(this.generalService.GetCustomerKam(customerID)));
    return list[0] || null;
  }

  async lookupTransferLocation(customerID: number): Promise<any> {
    const data = await this.toPromise(this.reservationGroupDetailsService.getTLBasedOnCustomer(customerID));
    if (Array.isArray(data)) {
      return data[0] || null;
    }
    return data || null;
  }

  async lookupDriver(name: string): Promise<any> {
    const rows = this.asList(await this.toPromise(
      this.driverService.getTableData(name, '', '', '', '', '', '', '', true, 0)
    ));
    let found = this.findByName(rows, name, ['driverName']);
    if (!found) {
      const prefix = String(name || '').trim().split(/\s+/)[0] || name;
      const prefixed = this.asList(await this.toPromise(
        this.driverService.getTableData(prefix, '', '', '', '', '', '', '', true, 0)
      ));
      found = this.findByName(prefixed, name, ['driverName']);
    }
    return found;
  }

  firstNonEmpty(...values: any[]): string {
    for (const value of values) {
      const text = String(value ?? '').trim();
      if (text && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'undefined') {
        return text;
      }
    }
    return '';
  }

  pickOwnedSupplied(row: any): string {
    return this.firstNonEmpty(
      row?.ownedSupplied,
      row?.OwnedSupplied,
      row?.inventoryOwnedSupplied,
      row?.InventoryOwnedSupplied,
      row?.inventorySupplierType,
      row?.InventorySupplierType
    );
  }

  pickInventorySupplierName(row: any): string {
    return this.firstNonEmpty(
      row?.inventorySupplierName,
      row?.InventorySupplierName,
      row?.vehicleSupplierName,
      row?.VehicleSupplierName,
      row?.supplierName,
      row?.SupplierName,
      row?.supplier,
      row?.Supplier
    );
  }

  async resolveSupplier(row: any): Promise<{ id: number; name: string }> {
    const id = Number(
      row?.inventorySupplierID || row?.InventorySupplierID || row?.supplierID || row?.SupplierID || 0
    );
    let name = this.pickInventorySupplierName(row);
    if (!name && id) {
      try {
        const supplier = await this.toPromise(this.generalService.GetSupplierByID(id));
        name = this.firstNonEmpty(
          supplier?.supplierName,
          supplier?.SupplierName,
          supplier?.supplier,
          supplier?.Supplier
        );
      } catch { /* keep empty */ }
    }
    return { id, name };
  }

  private registrationOf(row: any): string {
    return this.normalize(
      this.firstNonEmpty(
        row?.inventoryName,
        row?.InventoryName,
        row?.inventory,
        row?.Inventory,
        row?.registrationNumber,
        row?.RegistrationNumber
      )
    );
  }

  getInventoryById(inventoryID: number): Observable<any> {
    return this.httpClient.get(this.generalService.BaseURL + 'inventory/' + inventoryID);
  }

  lookupInventoryByRegistration(registration: string): Observable<any> {
    const reg = encodeURIComponent(registration || 'null');
    return this.httpClient.get(
      this.generalService.BaseURL + 'inventory/' + reg + '/0/null/null/null/null/null/0/InventoryID/Ascending'
    );
  }

  async lookupDriverInventory(driverID: number, vehicleHint?: string): Promise<any> {
    const wantedReg = this.normalize(vehicleHint || 'UP16GA6220');
    const wantedRaw = String(vehicleHint || 'UP16GA6220').trim();
    let rows: any[] = [];

    try {
      rows = this.asList(await this.toPromise(
        this.driverInventoryAssociationService.getTableData(
          0, driverID, 'null', 'null', 'null', 'null', 'null', wantedRaw, wantedRaw,
          'null', 'null', 'null', 'null', 'null', 'null', true, 1
        )
      ));
    } catch {
      rows = [];
    }

    if (!rows.length) {
      rows = this.asList(await this.toPromise(
        this.driverInventoryAssociationService.getDriverInventoryData(
          driverID, 'null', 0, 'null', wantedRaw, 'null', true, 0
        )
      ));
    }
    if (!rows.length) {
      rows = this.asList(await this.toPromise(
        this.driverInventoryAssociationService.getDriverInventoryData(
          driverID, 'null', 0, 'null', 'null', 'null', true, 0
        )
      ));
    }
    if (!rows.length) {
      try {
        rows = this.asList(await this.toPromise(
          this.driverInventoryAssociationService.getTableData(
            0, driverID, 'null', 'null', 'null', 'null', 'null', 'null', 'null',
            'null', 'null', 'null', 'null', 'null', 'null', true, 1
          )
        ));
      } catch {
        rows = [];
      }
    }

    const withCar = rows.filter((row) =>
      Number(row?.inventoryID || row?.InventoryID || 0) > 0
    );
    const pool = withCar.length ? withCar : rows;
    let found = pool.find((row) => this.registrationOf(row) === wantedReg)
      || this.findByName(pool, wantedRaw, ['inventoryName', 'InventoryName', 'inventory', 'Inventory', 'registrationNumber', 'RegistrationNumber'])
      || null;

    if (!found) {
      return null;
    }

    const inventoryID = Number(found?.inventoryID || found?.InventoryID || 0);
    let inventory = null;
    if (inventoryID) {
      try {
        inventory = await this.toPromise(this.getInventoryById(inventoryID));
      } catch { /* try registration search */ }
    }
    if (!inventory) {
      try {
        inventory = this.findByName(
          await this.toPromise(this.lookupInventoryByRegistration(wantedRaw)),
          wantedRaw,
          ['registrationNumber', 'RegistrationNumber']
        );
      } catch { /* keep association row */ }
    }
    if (inventory) {
      const resolvedInventoryID = Number(inventory.inventoryID || inventory.InventoryID || inventoryID);
      found = {
        ...found,
        ...inventory,
        inventoryID: resolvedInventoryID,
        InventoryID: resolvedInventoryID,
        inventoryName: this.firstNonEmpty(inventory.registrationNumber, inventory.RegistrationNumber, found.inventoryName, wantedRaw),
        ownedSupplied: this.pickOwnedSupplied(inventory) || this.pickOwnedSupplied(found),
        inventorySupplierID: inventory.supplierID || inventory.SupplierID || found.inventorySupplierID || found.InventorySupplierID,
        inventorySupplierName: this.pickInventorySupplierName(inventory) || this.pickInventorySupplierName(found),
        vehicleID: inventory.vehicleID || inventory.VehicleID || found.vehicleID || found.VehicleID,
        vehicle: inventory.vehicle || inventory.Vehicle || found.vehicle || found.Vehicle,
        vehicleCategoryID: inventory.vehicleCategoryID || inventory.VehicleCategoryID || found.vehicleCategoryID || found.VehicleCategoryID,
        vehicleCategory: inventory.vehicleCategory || inventory.VehicleCategory || found.vehicleCategory || found.VehicleCategory,
      };
    }
    return found;
  }

  createReservationGroup(payload: any): Observable<any> {
    return this.reservationGroupService.add(payload);
  }

  allot(payload: any): Observable<any> {
    return this.allotCarAndDriverService.add(payload);
  }

  clearIMEI(driverID: number): Observable<any> {
    return this.driverService.clearIMEI(driverID);
  }
}
