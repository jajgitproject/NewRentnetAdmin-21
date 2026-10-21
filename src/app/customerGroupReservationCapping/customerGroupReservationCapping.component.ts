// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerGroupReservationCappingService } from './customerGroupReservationCapping.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerGroupReservationCappingModel, CappingListStatusFilter, CappingImportError } from './customerGroupReservationCapping.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent } from '../customerGroupReservationCapping/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { BulkDeleteDialogComponent } from './dialogs/bulk-delete-dialog/bulk-delete-dialog.component';
import {
  CappingDuplicateCombination,
  CappingMessageDialogComponent
} from './dialogs/message-dialog/message-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerGroupReservationCapping',
  templateUrl: './customerGroupReservationCapping.component.html',
  styleUrls: ['./customerGroupReservationCapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerGroupReservationCappingComponent implements OnInit {
  displayedColumns = [
    'select',
    'GeoPoint.GeoPointName',
    'PackageType.PackageType',
    'CustomerGroupReservationCapping.CappingType',
    'Vehicle.Vehicle',
    'CustomerGroupReservationCapping.MondayCap',
    'CustomerGroupReservationCapping.TuesdayCap',
    'CustomerGroupReservationCapping.WednesdayCap',
    'CustomerGroupReservationCapping.ThursdayCap',
    'CustomerGroupReservationCapping.FridayCap',
    'CustomerGroupReservationCapping.SaturdayCap',
    'CustomerGroupReservationCapping.SundayCap',
    'status',
    'actions'
  ];
  dataSource: CustomerGroupReservationCappingModel[] | null = null;
  tableDataSource = new MatTableDataSource<CustomerGroupReservationCappingModel>([]);
  advanceTable: CustomerGroupReservationCappingModel | null;

  cappingTypeOptions: string[] = ['Hard Capping', 'Soft Capping'];
  filterCappingType: string = 'Hard Capping';
  filterPackageTypeIDs: number[] = [];
  packageFilterText = '';
  filterCityIDs: number[] = [];
  cityFilterText = '';
  allCitiesLoaded = false;
  /** Sentinel for “All vehicles” in the multi-select (not sent to API). */
  readonly vehicleFilterAllValue = -1;
  filterVehicleIDs: number[] = [this.vehicleFilterAllValue];
  vehicleFilterText = '';
  filterStatus: CappingListStatusFilter = 'Active';

  packageList: PackageTypeDropDown[] = [];
  vehicleList: VehicleDropDown[] = [];
  cityList: CityDropDown[] = [];

  PageNumber: number = 0;
  readonly pageSize = 10;
  hasNextPage = false;
  sortingData: number;
  sortType: string = 'Ascending';
  sortColumn: string = 'CustomerGroupReservationCappingID';
  customerGroup_ID: any;
  customerGroup_Name: any;

  selectedIds = new Set<number>();
  filtersCollapsed = false;
  hasSearched = false;
  selectedRows = new Map<number, CustomerGroupReservationCappingModel>();
  importInProgress = false;

  constructor(
    public dialog: MatDialog,
    public customerGroupReservationCappingService: CustomerGroupReservationCappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route: ActivatedRoute
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  @ViewChild('excelFileInput') excelFileInput: ElementRef<HTMLInputElement>;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedCustomerGroupID = paramsData.CustomerGroupID;
      const encryptedCustomerGroupName = paramsData.CustomerGroupName;
      this.customerGroup_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
      this.customerGroup_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupName));
    });
    this.setVehicleFilterToAll();
    this.loadMasterData();
    this.SubscribeUpdateService();
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  loadMasterData(): void {
    this._generalService.GetPackgeType().subscribe((data) => {
      this.packageList = data || [];
    });
    this._generalService.GetVehicle().subscribe((data) => {
      this.vehicleList = data || [];
      this.filterVehicleIDs = this.normalizeVehicleFilterIds(this.filterVehicleIDs);
    });
  }

  ensureCityMasterLoaded(): void {
    if (this.allCitiesLoaded) {
      return;
    }
    this._generalService.GetCitys().subscribe((data) => {
      this.cityList = (data || []).map((c) => this.normalizeCityDropDown(c)).filter((c) => c.geoPointID > 0);
      this.allCitiesLoaded = true;
    });
  }

  normalizeCityDropDown(city: any): CityDropDown {
    return {
      geoPointID: Number(city?.geoPointID ?? city?.GeoPointID ?? -1),
      geoPointName: city?.geoPointName ?? city?.GeoPointName ?? ''
    };
  }

  get filteredPackageList(): PackageTypeDropDown[] {
    const term = (this.packageFilterText || '').trim().toLowerCase();
    const list = this.packageList || [];
    if (!term) {
      return list;
    }
    return list.filter((pkg) => (pkg.packageType || '').toLowerCase().includes(term));
  }

  onPackageFilterPanelOpen(opened: boolean): void {
    if (!opened) {
      this.packageFilterText = '';
    }
  }

  get filteredCityList(): CityDropDown[] {
    const term = (this.cityFilterText || '').trim().toLowerCase();
    const list = this.cityList || [];
    if (!term) {
      return list;
    }
    return list.filter((city) => (this.getCityOptionName(city) || '').toLowerCase().includes(term));
  }

  getCityOptionId(city: CityDropDown): number {
    return Number(city?.geoPointID ?? city?.GeoPointID);
  }

  getCityOptionName(city: CityDropDown): string {
    return city?.geoPointName ?? city?.GeoPointName ?? '';
  }

  onCityFilterPanelOpen(opened: boolean): void {
    if (opened) {
      this.ensureCityMasterLoaded();
    } else {
      this.cityFilterText = '';
    }
  }

  get filteredVehicleList(): VehicleDropDown[] {
    const term = (this.vehicleFilterText || '').trim().toLowerCase();
    const list = this.vehicleList || [];
    if (!term) {
      return list;
    }
    return list.filter((v) => (this.getVehicleOptionName(v) || '').toLowerCase().includes(term));
  }

  onVehicleFilterPanelOpen(opened: boolean): void {
    if (!opened) {
      this.vehicleFilterText = '';
    }
  }

  get isVehicleFilterAll(): boolean {
    const ids = this.filterVehicleIDs || [];
    return !ids.length || ids.includes(this.vehicleFilterAllValue);
  }

  get vehicleFilterDisplayText(): string {
    const ids = (this.filterVehicleIDs || []).filter(
      (id) => id !== this.vehicleFilterAllValue && id > 0
    );
    if (!ids.length) {
      return '';
    }
    return ids
      .map((id) => this.getVehicleNameById(id))
      .filter((name) => !!name)
      .join(', ');
  }

  /** Closed-field label (matches Capping Type / Status style). */
  get vehicleFilterTriggerText(): string {
    if (this.isVehicleFilterAll) {
      return 'All';
    }
    return this.vehicleFilterDisplayText;
  }

  getVehicleNameById(id: number): string {
    const match = (this.vehicleList || []).find((v) => this.getVehicleOptionId(v) === id);
    return match ? this.getVehicleOptionName(match) : '';
  }

  setVehicleFilterToAll(): void {
    this.filterVehicleIDs = [this.vehicleFilterAllValue];
    this.vehicleFilterText = '';
  }

  private getAllVehicleFilterIds(): number[] {
    return (this.vehicleList || [])
      .map((v) => this.getVehicleOptionId(v))
      .filter((id) => Number.isFinite(id) && id > 0);
  }

  private collapseToAllIfEveryVehicleSelected(specifics: number[]): number[] {
    const selected = [...new Set(specifics.filter((id) => id > 0))];
    const allIds = this.getAllVehicleFilterIds();
    if (
      allIds.length &&
      selected.length >= allIds.length &&
      allIds.every((id) => selected.includes(id))
    ) {
      return [this.vehicleFilterAllValue];
    }
    return selected;
  }

  private normalizeVehicleFilterIds(ids: number[] | null | undefined): number[] {
    const allToken = this.vehicleFilterAllValue;
    const raw = (ids || []).map((id) => Number(id));
    if (!raw.length) {
      return [allToken];
    }
    const hasAll = raw.includes(allToken);
    const specifics = raw.filter((id) => id !== allToken && id > 0);
    if (hasAll && !specifics.length) {
      return [allToken];
    }
    if (!specifics.length) {
      return [allToken];
    }
    return this.collapseToAllIfEveryVehicleSelected(specifics);
  }

  vehicleFilterIdsForApi(): number[] | null {
    const specifics = (this.filterVehicleIDs || []).filter(
      (id) => id !== this.vehicleFilterAllValue && id > 0
    );
    return specifics.length ? specifics : null;
  }

  onVehicleFilterIdsChange(ids: number[]): void {
    const allToken = this.vehicleFilterAllValue;
    const next = (ids || []).map((id) => Number(id));
    if (!next.length) {
      this.filterVehicleIDs = [allToken];
      return;
    }
    const hasAll = next.includes(allToken);
    const specifics = next.filter((id) => id !== allToken && id > 0);
    if (hasAll && specifics.length) {
      this.filterVehicleIDs = this.collapseToAllIfEveryVehicleSelected(specifics);
      return;
    }
    if (hasAll) {
      this.filterVehicleIDs = [allToken];
      return;
    }
    this.filterVehicleIDs = this.collapseToAllIfEveryVehicleSelected(specifics);
  }

  get tableVisible(): boolean {
    return this.hasSearched && !!this.filterCappingType;
  }

  get statusIsActive(): boolean {
    return this.filterStatus === 'Active';
  }

  onCappingTypeChanged(): void {
    if (!this.filterCappingType) {
      this.hasSearched = false;
      this.dataSource = null;
      this.clearSelection();
    }
  }

  SearchData(): void {
    if (!this.filterCappingType) {
      this.showNotification('snackbar-danger', 'Please select Capping Type before searching.', 'bottom', 'center');
      return;
    }
    this.PageNumber = 0;
    this.hasSearched = true;
    this.clearSelection();
    this.loadData();
  }

  resetFilters(): void {
    this.filterCappingType = 'Hard Capping';
    this.filterPackageTypeIDs = [];
    this.packageFilterText = '';
    this.filterCityIDs = [];
    this.cityFilterText = '';
    this.setVehicleFilterToAll();
    this.filterStatus = 'Active';
    this.PageNumber = 0;
    this.hasSearched = false;
    this.dataSource = null;
    this.clearSelection();
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.selectedRows.clear();
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  isRowSelected(row: CustomerGroupReservationCappingModel): boolean {
    return this.selectedIds.has(row.customerGroupReservationCappingID);
  }

  toggleRow(row: CustomerGroupReservationCappingModel): void {
    const id = row.customerGroupReservationCappingID;
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      this.selectedRows.delete(id);
    } else {
      this.selectedIds.add(id);
      this.selectedRows.set(id, row);
    }
  }

  isAllPageSelected(): boolean {
    if (!this.dataSource?.length) {
      return false;
    }
    return this.dataSource.every((row) => this.selectedIds.has(row.customerGroupReservationCappingID));
  }

  isPageSelectionIndeterminate(): boolean {
    if (!this.dataSource?.length) {
      return false;
    }
    const selectedOnPage = this.dataSource.filter((row) => this.selectedIds.has(row.customerGroupReservationCappingID)).length;
    return selectedOnPage > 0 && selectedOnPage < this.dataSource.length;
  }

  masterToggle(): void {
    if (!this.dataSource?.length) {
      return;
    }
    if (this.isAllPageSelected()) {
      this.dataSource.forEach((row) => {
        this.selectedIds.delete(row.customerGroupReservationCappingID);
        this.selectedRows.delete(row.customerGroupReservationCappingID);
      });
    } else {
      this.dataSource.forEach((row) => {
        this.selectedIds.add(row.customerGroupReservationCappingID);
        this.selectedRows.set(row.customerGroupReservationCappingID, row);
      });
    }
  }

  getVehicleOptionId(option: VehicleDropDown): number {
    return Number(option?.vehicleID ?? option?.VehicleID);
  }

  getVehicleOptionName(option: VehicleDropDown): string {
    return option?.vehicle ?? option?.Vehicle ?? '';
  }

  addNew()
  {
    this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerGroupID:this.customerGroup_ID,
          CustomerGroupName:this.customerGroup_Name
        }
    });
  }

  editCall(row) {
    this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerGroupID:this.customerGroup_ID,
        CustomerGroupName:this.customerGroup_Name
      }
    });
  }

  private getPackageTypeKey(row: CustomerGroupReservationCappingModel): string {
    const id = Number(row?.packageTypeID ?? row?.PackageTypeID ?? 0);
    if (Number.isFinite(id) && id > 0) {
      return `id:${id}`;
    }
    const name = (row?.packageType ?? row?.PackageType ?? '').toString().trim().toLowerCase();
    return name ? `name:${name}` : '';
  }

  private selectedRowsShareSamePackageType(): boolean {
    const rows = Array.from(this.selectedRows.values());
    if (rows.length <= 1) {
      return true;
    }
    const keys = rows.map((row) => this.getPackageTypeKey(row)).filter((key) => key !== '');
    if (!keys.length) {
      return true;
    }
    return new Set(keys).size === 1;
  }

  private showBulkPackageTypeMessage(): void {
    this.dialog.open(CappingMessageDialogComponent, {
      width: '440px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: {
        title: 'Bulk Edit',
        message: 'Bulk Capping records will be edit based on same Package Type'
      }
    });
  }

  bulkEdit(): void {
    if (this.selectedIds.size === 0) {
      return;
    }
    if (!this.selectedRowsShareSamePackageType()) {
      this.showBulkPackageTypeMessage();
      return;
    }
    this.dialog.open(FormDialogComponent, {
      data: {
        action: 'bulk',
        bulkIds: Array.from(this.selectedIds),
        bulkRows: Array.from(this.selectedRows.values()),
        CustomerGroupID: this.customerGroup_ID,
        CustomerGroupName: this.customerGroup_Name
      }
    });
  }

  private getRowCombinationKey(row: CustomerGroupReservationCappingModel): string {
    const cappingType = (row?.cappingType ?? row?.CappingType ?? '').toString().trim().toLowerCase();
    const packageTypeId = Number(row?.packageTypeID ?? row?.PackageTypeID ?? 0);
    const cityId = Number(row?.cityID ?? row?.CityID ?? 0);
    const vehicleId = Number(row?.vehicleID ?? row?.VehicleID ?? 0);
    if (packageTypeId > 0 && cityId > 0 && vehicleId > 0) {
      return `id:${cappingType}|${packageTypeId}|${cityId}|${vehicleId}`;
    }
    const packageType = (row?.packageType ?? row?.PackageType ?? '').toString().trim().toLowerCase();
    const city = (row?.city ?? row?.City ?? '').toString().trim().toLowerCase();
    const vehicle = (row?.vehicle ?? row?.Vehicle ?? '').toString().trim().toLowerCase();
    return `name:${cappingType}|${packageType}|${city}|${vehicle}`;
  }

  private getDuplicateCombinationsInSelection(
    rows: CustomerGroupReservationCappingModel[]
  ): CappingDuplicateCombination[] {
    const groups = new Map<string, CustomerGroupReservationCappingModel[]>();
    rows.forEach((row) => {
      const key = this.getRowCombinationKey(row);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(row);
    });
    const combinations: CappingDuplicateCombination[] = [];
    groups.forEach((groupRows, key) => {
      if (groupRows.length > 1 && key) {
        const row = groupRows[0];
        combinations.push({
          cappingType: (row?.cappingType ?? row?.CappingType ?? '').toString(),
          packageType: (row?.packageType ?? row?.PackageType ?? '').toString(),
          city: (row?.city ?? row?.City ?? '').toString(),
          vehicle: (row?.vehicle ?? row?.Vehicle ?? '').toString(),
          selectedCount: groupRows.length
        });
      }
    });
    return combinations;
  }

  private mapConflictCombinations(items: any[]): CappingDuplicateCombination[] {
    return (items || []).map((item) => ({
      cappingType: (item?.cappingType ?? item?.CappingType ?? '').toString(),
      packageType: (item?.packageType ?? item?.PackageType ?? '').toString(),
      city: (item?.city ?? item?.City ?? '').toString(),
      vehicle: (item?.vehicle ?? item?.Vehicle ?? '').toString()
    }));
  }

  private showBulkDuplicateActivateMessage(duplicateCombinations: CappingDuplicateCombination[]): void {
    this.dialog.open(CappingMessageDialogComponent, {
      width: '560px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: {
        title: 'Bulk Activate',
        message:
          'Some of the selected records are duplicate. Bulk activate cannot enable multiple rows with the same combination.',
        duplicateCombinations,
        combinationListHeading: 'Duplicate combinations in your selection:',
        footerMessage: 'Please select only unique records to proceed.'
      }
    });
  }

  private showActiveRecordExistsMessage(combinations: CappingDuplicateCombination[]): void {
    this.dialog.open(CappingMessageDialogComponent, {
      width: '560px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: {
        title: 'Bulk Activate',
        message:
          'The same existing record is already available as active. You cannot activate this record until the active one is deactivated.',
        duplicateCombinations: combinations,
        combinationListHeading: 'Combination(s):'
      }
    });
  }

  bulkActivate(): void {
    if (this.selectedIds.size === 0) {
      return;
    }
    const rows = Array.from(this.selectedRows.values());
    const duplicateCombinations = this.getDuplicateCombinationsInSelection(rows);
    if (duplicateCombinations.length) {
      this.showBulkDuplicateActivateMessage(duplicateCombinations);
      return;
    }
    const ids = Array.from(this.selectedIds);
    this.customerGroupReservationCappingService.bulkActivateCheck(ids).subscribe({
      next: (checkResult) => {
        const activeConflicts = this.mapConflictCombinations(checkResult?.conflicts);
        if (activeConflicts.length) {
          this.showActiveRecordExistsMessage(activeConflicts);
          return;
        }
        this.customerGroupReservationCappingService.bulkActivate(ids).subscribe({
          next: () => {
            this._generalService.sendUpdate('CustomerGroupReservationCappingBulkActivate:CustomerGroupReservationCappingView:Success');
          },
          error: (err) => {
            const message = err?.error?.toString?.() ?? err?.error ?? '';
            if (typeof message === 'string' && message.includes('ActiveRecordExists')) {
              this.customerGroupReservationCappingService.bulkActivateCheck(ids).subscribe({
                next: (retry) => this.showActiveRecordExistsMessage(this.mapConflictCombinations(retry?.conflicts))
              });
              return;
            }
            this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
          }
        });
      },
      error: () => {
        this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      }
    });
  }

  bulkDelete(): void {
    if (this.selectedIds.size === 0) {
      return;
    }
    this.dialog.open(BulkDeleteDialogComponent, {
      width: '420px',
      data: {
        ids: Array.from(this.selectedIds)
      }
    });
  }

  deleteItem(row)
  {
    this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false;
  }

  formatCappingTypeShort(value: string): string {
    const text = (value || '').toLowerCase();
    if (text.includes('hard')) {
      return 'Hard';
    }
    if (text.includes('soft')) {
      return 'Soft';
    }
    return value || '';
  }

  private normalizeListRow(raw: any): CustomerGroupReservationCappingModel {
    const city =
      raw?.city ??
      raw?.City ??
      raw?.geoPointName ??
      raw?.GeoPointName ??
      '';
    return {
      ...raw,
      customerGroupReservationCappingID: raw?.customerGroupReservationCappingID ?? raw?.CustomerGroupReservationCappingID,
      customerGroupID: raw?.customerGroupID ?? raw?.CustomerGroupID,
      customerGroup: raw?.customerGroup ?? raw?.CustomerGroup,
      cityID: raw?.cityID ?? raw?.CityID,
      city,
      packageTypeID: raw?.packageTypeID ?? raw?.PackageTypeID,
      packageType: raw?.packageType ?? raw?.PackageType,
      cappingType: raw?.cappingType ?? raw?.CappingType,
      vehicleID: raw?.vehicleID ?? raw?.VehicleID,
      vehicle: raw?.vehicle ?? raw?.Vehicle,
      mondayCap: raw?.mondayCap ?? raw?.MondayCap,
      tuesdayCap: raw?.tuesdayCap ?? raw?.TuesdayCap,
      wednesdayCap: raw?.wednesdayCap ?? raw?.WednesdayCap,
      thursdayCap: raw?.thursdayCap ?? raw?.ThursdayCap,
      fridayCap: raw?.fridayCap ?? raw?.FridayCap,
      saturdayCap: raw?.saturdayCap ?? raw?.SaturdayCap,
      sundayCap: raw?.sundayCap ?? raw?.SundayCap,
      activationStatus: raw?.activationStatus ?? raw?.ActivationStatus
    };
  }

  private applyListResponse(data: any): void {
    const rows = Array.isArray(data) ? data.map((item) => this.normalizeListRow(item)) : [];
    this.dataSource = rows;
    this.tableDataSource.data = rows;
    this.hasNextPage = rows.length >= this.pageSize;
  }

  public loadData() 
  {
    if (!this.filterCappingType) {
      this.dataSource = null;
      this.tableDataSource.data = [];
      return;
    }
    this.customerGroupReservationCappingService.getTableDataFilter(
      Number(this.customerGroup_ID),
      this.filterCappingType,
      this.filterPackageTypeIDs?.length ? this.filterPackageTypeIDs : null,
      this.filterCityIDs?.length ? this.filterCityIDs : null,
      this.vehicleFilterIdsForApi(),
      this.statusIsActive,
      this.PageNumber,
      this.sortColumn,
      this.sortType,
      this.pageSize
    ).subscribe(
      data => this.applyListResponse(data),
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        this.tableDataSource.data = [];
        this.hasNextPage = false;
      }
    );
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: CustomerGroupReservationCappingModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall()
  {
    if (this.hasNextPage)
    {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData(); 
    } 
  }

  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription;

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerGroupReservationCappingCreate")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                if (this.filterCappingType) {
                  this.hasSearched = true;
                }
                this.clearSelection();
                this.loadData();
                this.showNotification('snackbar-success', 'Customer Group Reservation Capping Created...!!!', 'bottom', 'center');
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingUpdate" || this.MessageArray[0]=="CustomerGroupReservationCappingBulkUpdate")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               if (this.filterCappingType) {
                 this.hasSearched = true;
               }
               this.clearSelection();
               this.loadData();
               this.showNotification('snackbar-success', 'Customer Group Reservation Capping Updated...!!!', 'bottom', 'center');
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingBulkActivate")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               if (this.filterCappingType) {
                 this.hasSearched = true;
               }
               this.clearSelection();
               this.loadData();
               this.showNotification('snackbar-success', 'Selected records activated...!!!', 'bottom', 'center');
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingDelete")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               if (this.filterCappingType) {
                 this.hasSearched = true;
               }
               this.clearSelection();
               this.loadData();
               this.showNotification('snackbar-success', 'Customer Group Reservation Capping Deleted...!!!', 'bottom', 'center');
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingAll")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.showNotification('snackbar-danger', 'Duplicate Value Found.....!!!', 'bottom', 'center');
              }
            }
          }
        }
      }
    );
  }

  triggerExcelImport(): void {
    if (!this.customerGroup_ID || this.importInProgress) {
      return;
    }
    this.excelFileInput?.nativeElement?.click();
  }

  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    input.value = '';
    if (!file || !this.customerGroup_ID) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.showNotification('snackbar-danger', 'Please upload a .xlsx file.', 'top', 'right');
      return;
    }

    this.importInProgress = true;
    this.customerGroupReservationCappingService.importExcel(Number(this.customerGroup_ID), file).subscribe({
      next: (result) => {
        this.importInProgress = false;
        const created = result?.createdCount ?? (result as any)?.CreatedCount ?? 0;
        const updated = result?.updatedCount ?? (result as any)?.UpdatedCount ?? 0;
        this.showNotification(
          'snackbar-success',
          `Import complete. Created ${created}, updated ${updated}.`,
          'top',
          'right'
        );
        if (this.hasSearched) {
          this.SearchData();
        }
      },
      error: (error: unknown) => {
        this.importInProgress = false;
        this.showImportErrorDialog(error);
      }
    });
  }

  private showImportErrorDialog(error: unknown): void {
    let message = 'Import failed. Please check the file and try again.';
    if (typeof error === 'string' && error.trim()) {
      message = error.trim();
    } else if (error instanceof HttpErrorResponse) {
      const body = error.error;
      const errors: CappingImportError[] = body?.errors ?? body?.Errors ?? [];
      const fallback = body?.message ?? body?.Message ?? error.message;
      message = this.formatImportErrorMessage(errors, fallback);
    }
    this.dialog.open(CappingMessageDialogComponent, {
      width: '520px',
      maxHeight: '80vh',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: {
        title: 'Excel import failed',
        message
      }
    });
  }

  downloadImportTemplate(): void {
    if (!this.customerGroup_ID) {
      this.showNotification('snackbar-danger', 'Customer group is not selected.', 'top', 'right');
      return;
    }
    const groupId = Number(this.customerGroup_ID);
    this.customerGroupReservationCappingService.downloadImportTemplate(groupId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `CustomerGroupReservationCapping_${groupId}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.showNotification('snackbar-danger', 'Could not download Excel file.', 'top', 'right');
      }
    });
  }

  private formatImportErrorMessage(errors: CappingImportError[], fallback?: string): string {
    if (errors?.length) {
      return errors
        .map((err) => {
          const row = err?.rowNumber ?? (err as any)?.RowNumber;
          const text = err?.message ?? (err as any)?.Message ?? 'Invalid row';
          const field = err?.field ?? (err as any)?.Field;
          const prefix = row ? `Row ${row}` : 'File';
          return field ? `${prefix} (${field}): ${text}` : `${prefix}: ${text}`;
        })
        .join('\n');
    }
    return fallback || 'Import failed. Please check the file and try again.';
  }

  SortingData(coloumName:any) {
    if (!this.filterCappingType) {
      return;
    }
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = "Ascending";
    } else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.sortColumn = coloumName.active;
    this.customerGroupReservationCappingService.getTableDataFilterSort(
      Number(this.customerGroup_ID),
      this.filterCappingType,
      this.filterPackageTypeIDs?.length ? this.filterPackageTypeIDs : null,
      this.filterCityIDs?.length ? this.filterCityIDs : null,
      this.vehicleFilterIdsForApi(),
      this.statusIsActive,
      this.PageNumber,
      this.sortColumn,
      this.sortType,
      this.pageSize
    ).subscribe(
      data => this.applyListResponse(data),
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        this.tableDataSource.data = [];
        this.hasNextPage = false;
      }
    );
  }
}
