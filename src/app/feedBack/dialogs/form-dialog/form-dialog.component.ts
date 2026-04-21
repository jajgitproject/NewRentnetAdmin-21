// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { FeedBackService } from '../../feedBack.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FeedBack } from '../../feedBack.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { FeedBackDropDown } from '../../feedBackDropDown.model';
// import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
//import { CityDropDown } from '../../cityDropDown.model';
import { UomDropDown } from 'src/app/additionalService/uomDropDown.model';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { AdditionalServiceDropDown } from 'src/app/general/additionalServiceDropDown.model';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogComponent } from '../delete/delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeesDropDown } from '../../employeeDropDown.model';
import { tripFeedBackAttachmentFormDialogComponent } from 'src/app/feedBackAttachment/dialogs/form-dialog/form-dialog.component';
import { FeedBackAttachmentService } from 'src/app/feedBackAttachment/feedBackAttachment.service';
import { DeleteDialogComponent as DeleteDialogComponentForfeedBackAttachment } from 'src/app/feedBackAttachment/dialogs/delete/delete.component';
@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent {

  displayedColumns = [

    'reservationID',
    'dutySlipID',
    'tripFeedBackAttachment',
    'status',
    'actions'

  ];
  dataSource: FeedBack[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: FeedBack;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  sortingData: number;
  sortType: string;

  // public CityList?: CityDropDown[] = [];
  // filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public uomList?: UomDropDown[] = [];
  public additionalList?: AdditionalServiceDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  public EmployeeList1?: EmployeesDropDown[] = [];
  filteredEmployeeOptions1: Observable<EmployeesDropDown[]>;
  searchEmployee: FormControl = new FormControl();
  // Create a Subject to emit messages to the parent component
  messageSubject: Subject<string> = new Subject<any>();
  image: any;
  fileUploadEl: any;
  UOMID: any;
  ServiceID: any;
  service: string;
  geoPointCityID: any;
  ReservationID: any;
  CustomerPersonID: any;
  employeeID: any;
  AllotmentID: any;
  InventoryID: any;
  DriverID: any;
  RegistrationNumber: any;
  DriverName: any;
  activation: string;
  SearchRate: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  tripFeedBackID: any;
  ReservationPassengerID: any;
  DutySlipID: any;
  primaryPassengerID: any;
  dutySlipID: any;
  driverName: string = '';
  tripFeedBack_ID: any;
  reservationID: any;
  @Input() item: any;
  customerPersonName: any;
  customerPersonID: any;
  feedBackAttachmentID: any;
  saveDisabled:boolean=true;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;
  //dialog: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: FeedBackService,
    public feedBackService: FeedBackService,
    public feedBackAttachmentService: FeedBackAttachmentService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    this.customerPersonName = data.customerPersonName;
    this.CustomerPersonID = data.customerPersonID ?? data.CustomerPersonID;
   
    // Set the defaults
    this.action = data.action;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.action === 'edit') {
      this.dialogTitle = ' Edit Attachment To DutySlip No.';
      this.advanceTable = data.advanceTable;

      this.uploadedByName();
      this.searchEmployee.setValue(this.advanceTable.firstName + " " + this.advanceTable.lastName);
      this.advanceTable.registrationNumber = data.registrationNumber;
      this.advanceTable.driverName = data.driverName;
      this.advanceTable.reservationID = data.reservationID;
      this.advanceTable.dutySlipID = data.dutySlipID;
      this.advanceTable.allotmentID = data.allotmentID;
    } else {
      this.dialogTitle = 'Trip FeedBack.';
      this.advanceTable = new FeedBack({});
      this.advanceTable.activationStatus = true;

      this.uploadedByName();
      this.advanceTable.registrationNumber = data.registrationNumber;
      this.advanceTable.driverName = data.driverName;
      this.advanceTable.reservationID = data.reservationID;
      this.advanceTable.dutySlipID = data.dutySlipID;
      this.advanceTable.allotmentID = data.allotmentID;
      // this.advanceTable.customerPersonName= data.customerPersonName;
      this.CustomerPersonID = data.customerPersonID;
      this.customerPersonName = data.customerPersonName;
    }
    this.advanceTableForm = this.createContactForm();
    this.ReservationID = data.reservationID;
    this.CustomerPersonID = data.customerPersonID;
    this.customerPersonName = data.customerPersonName;
    this.AllotmentID = data.allotmentID;
    this.InventoryID = data.inventoryID;
    this.DriverID = data.driverID;
    this.RegistrationNumber = data.registrationNumber;
    this.DriverName = data.driverName;
    this.ReservationPassengerID = data.reservationPassengerID;
    this.DutySlipID = data.dutySlipID;
    if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    {
      this.isSaveAllowed = true;
    } 
    else
    {
      this.isSaveAllowed = false;
    }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  // public ngOnInit()
  // {

  //   this.InitEmployee();
  //   this.loadData();
  // }

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      this.tripFeedBackID = paramsData.tripFeedBackID;
      this.dutySlipID = paramsData.dutySlipID;
      this.reservationID = paramsData.reservationID;

      this.advanceTableForm.patchValue({ customerPersonName: this.customerPersonName });
      this.advanceTableForm.patchValue({ CustomerPersonID: this.CustomerPersonID });
      // this.CustomerPersonID=paramsData.customerPersonID;


    });
    this.InitEmployee();
    this.loadData();

  }
  onContextMenu(event: MouseEvent, item: FeedBack) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  // editCall(row) {
  //   this.dialogTitle =' Edit Trip FeedBack.';  
  //   this.advanceTableForm.patchValue({tripFeedBackID:row.tripFeedBackID});  
  //   //this.advanceTableForm.patchValue({dutySlipID:row.dutySlipID});
  //   //this.advanceTableForm.patchValue({allotmentID:row.allotmentID});
  //   //this.advanceTableForm.patchValue({reservationID:row.reservationID});
  //   this.advanceTableForm.patchValue({driverName:row.driverName});
  //   this.advanceTableForm.patchValue({registrationNumber:row.registrationNumber});
  //   this.advanceTableForm.patchValue({employeeID: row.employeeID });
  //   this.searchEmployee.setValue(row.firstName+" "+row.lastName);
  //   this.advanceTableForm.patchValue({dateOfFeedback:row.dateOfFeedback});
  //   this.advanceTableForm.patchValue({timeOfFeedback:row.timeOfFeedback});
  //   this.advanceTableForm.patchValue({feedbackPointsOutOfFive:row.feedbackPointsOutOfFive});
  //   this.advanceTableForm.patchValue({feedbackRemark:row.feedbackRemark});

  //   this.advanceTableForm.patchValue({activationStatus:row.activationStatus});
  //   this.action="edit";
  // }

  editCall(row) {
    //    alert(row.id);
    this.feedBackAttachmentID = row.feedBackAttachmentID;
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        tripFeedBackID: this.tripFeedBackID,
        dutySlipID: row.dutySlipID

      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.tripBackAttachmentloadData();
    });

  }

  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  uploadedByName() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.EmployeeList = data;
        const first = Array.isArray(data) && data.length ? data[0] : null;
        if (first && this.advanceTableForm) {
          this.advanceTableForm.patchValue({
            feedbackEnteredBy: `${first.firstName ?? ''} ${first.lastName ?? ''}`.trim(),
          });
        }
      }
    );
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        tripFeedBackID: [this.advanceTable?.tripFeedBackID],
        dutySlipID: [this.advanceTable?.dutySlipID],
        allotmentID: [this.advanceTable?.allotmentID],
        reservationID: [this.advanceTable?.reservationID,],
        driverID: [this.advanceTable?.driverID],
        inventoryID: [this.advanceTable?.inventoryID,],
        passengerID: [this.advanceTable?.passengerID],
        customerPersonName: [this.advanceTable?.customerPersonName],
        customerPersonID: [this.advanceTable?.primaryPassengerID,],
        employeeID: [this.advanceTable?.employeeID],
        // primaryPassengerID: [this.advanceTable.primaryPassengerID],
        feedbackPointsOutOfFive: [],
        feedbackRemark: [this.advanceTable?.feedbackRemark],
        feedbackEnteredBy: [this.advanceTable?.feedbackEnteredBy],
        dateOfFeedback: [this.advanceTable?.dateOfFeedback],
        timeOfFeedback: [this.advanceTable?.timeOfFeedback],
        activationStatus: [this.advanceTable?.activationStatus],
        registrationNumber: [this.advanceTable?.registrationNumber],
        driverName: [this.advanceTable?.driverName],

      });
  }
  // InitEmployee() {
  //   this._generalService.GetFeedBack(this.ReservationID).subscribe(
  //     data => {
  //       this.EmployeeList = data;
  //       //console.log(this.EmployeeList);
  //       this.filteredEmployeeOptions = this.searchEmployee.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filter(value || ''))
  //       );
  //     });
  // }

  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   //console.log(this.EmployeeList);
  //   return this.EmployeeList.filter(
  //     customer => {
  //       return customer.firstName?.toLowerCase().indexOf(filterValue) === 0;
  //     }
  //   );
  // }

  // getTitles(employeeID: any) {
  //   this.employeeID = employeeID;

  // }

  InitEmployee() {
    {
      this._generalService.GetFeedBack(this.ReservationID).subscribe(
          data => {
            this.EmployeeList1 = data ?? [];
            this.advanceTableForm.controls['customerPersonName'].updateValueAndValidity();
            this.filteredEmployeeOptions1 = this.advanceTableForm.controls['customerPersonName'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterCategory(value || ''))
            );
          }
        );
    }
  }

  private _filterCategory(value: string): any {
    const filterValue = (value || '').toLowerCase();
    if (!this.EmployeeList1?.length) {
      return [];
    }
    return this.EmployeeList1.filter(
      customer => {
        const name = customer.customerPersonName?.toLowerCase() ?? '';
        return name.indexOf(filterValue) === 0;
      }
    );
  }

  getTitles(item: any) {
    this.primaryPassengerID = item.primaryPassengerID;
    this.CustomerPersonID = item.primaryPassengerID;
    this.advanceTableForm.patchValue({ primaryPassengerID: this.primaryPassengerID })
  }

  employeeValidator(EmployeeList1: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList1.some(group => group.customerPersonName?.toLowerCase() === value);
      return match ? null : { employeeFeedbackInvalid: true };
    };
  }
  public loadData() {
    this.feedBackService.getTableData(this.ReservationID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
          this.dataSource.forEach((row: any) => {
            const feedbackPointsOutOfFive = parseFloat(row?.feedbackPointsOutOfFive)?.toString();
            this.action = 'edit';
            this.tripFeedBackID = row.tripFeedBackID;
            this.advanceTableForm.patchValue({ tripFeedBackID: row.tripFeedBackID });
            this.advanceTableForm.patchValue({ driverName: row.driverName });
            this.advanceTableForm.patchValue({ registrationNumber: row.registrationNumber });
            this.advanceTableForm.patchValue({ employeeID: row.employeeID });
            this.searchEmployee.setValue(row.firstName + " " + row.lastName);
            this.advanceTableForm.patchValue({ dateOfFeedback: row.dateOfFeedback });
            this.advanceTableForm.patchValue({ timeOfFeedback: row.timeOfFeedback });
            this.advanceTableForm.patchValue({ feedbackPointsOutOfFive: feedbackPointsOutOfFive });
            this.advanceTableForm.patchValue({ feedbackRemark: row.feedbackRemark });
            this.advanceTableForm.patchValue({ customerPersonName: row.customerPersonName });
            this.advanceTableForm.patchValue({ activationStatus: row.activationStatus });
            if (this.tripFeedBackID !== 0) {
              this.tripBackAttachmentloadData();
            }
          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
    //  this.tripBackAttachmentloadData();
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void {
    this.advanceTableForm.patchValue({ customerPersonID: this.CustomerPersonID });
    this.advanceTableForm.patchValue({ dutySlipID: this.DutySlipID });
    this.advanceTableForm.patchValue({ reservationID: this.ReservationID });
    this.advanceTableForm.patchValue({ passengerID: this.ReservationPassengerID });
    this.advanceTableForm.patchValue({ allotmentID: this.AllotmentID });
    this.advanceTableForm.patchValue({ inventoryID: this.InventoryID });
    this.advanceTableForm.patchValue({ driverID: this.DriverID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      (response) => {
        this.messageSubject.next(this.advanceTableForm.getRawValue());
        this._generalService.sendUpdate('FeedBackCreate:FeedBackView:Success');
        this.loadData();
        this.showNotification(
          'snackbar-success',
          'Tripfeedback Created ...!!!',
          'bottom',
          'center'
        );

        this.saveDisabled = true;
        this.dialogRef.close();
      },
      (error) => {
        this._generalService.sendUpdate('FeedBackAll:FeedBackView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ customerPersonID: this.CustomerPersonID });
    this.advanceTableForm.patchValue({ reservationID: this.ReservationID });
    this.advanceTableForm.patchValue({ allotmentID: this.AllotmentID });
    this.advanceTableForm.patchValue({ inventoryID: this.InventoryID });
    this.advanceTableForm.patchValue({ driverID: this.DriverID });
    this.advanceTableForm.patchValue({ passengerID: this.ReservationPassengerID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.messageSubject.next(this.advanceTableForm.getRawValue());
          this._generalService.sendUpdate('FeedBackUpdate:FeedBackView:Success');//To Send Updates 
          this.loadData();
          this.showNotification(
            'snackbar-success',
            'Tripfeedback Updated ...!!!',
            'bottom',
            'center'
          );//To Send Updates
          this.saveDisabled = true;
          this.dialogRef.close();
        },
        error => {
          this._generalService.sendUpdate('FeedBackAll:FeedBackView:Failure');//To Send Updates  
          this.saveDisabled = true;
        }
      )
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action === "edit") {
      this.Put();
    }
    else {
      this.Post();
    }

  }

  // OnFeedBackChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
  // }
  deleteItemfeedBackAttachment(row) {

    this.tripFeedBackID = row.tripFeedBackAttachmentID;
    const dialogRef = this.dialog.open(DeleteDialogComponentForfeedBackAttachment,
      {

        data: row
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
      this.showNotification(
        'snackbar-success',
        'TripFeedBack Deleted ...!!!',
        'bottom',
        'center'
      );
    })
  }

  // TripFeedBackAttachment(row) {
  //   this.router.navigate([
  //     '/feedBackAttachment',  
  //   ],
  //   {
  //     queryParams: {

  //       tripFeedBackID:row.tripFeedBackID,

  //     }

  //   }); 
  //   this.dialogRef.close();
  // }

  refresh() {

    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  tripFeedBackAttachment() {
    const dialogRef = this.dialog.open(tripFeedBackAttachmentFormDialogComponent, {
      width: '500px',
      data: {
        // // row: item
        tripFeedBackID: this.tripFeedBackID,
        dutySlipID: this.DutySlipID,
        verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
      }

    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.tripBackAttachmentloadData();
    });
  }

  getUom() {
    this._generalService.getUOM(this.UOMID).subscribe(
      data => {
        this.uomList = data;
        this.advanceTableForm.patchValue({ uom: this.uomList[0].uom });
      }
    )
  }

  public tripBackAttachmentloadData() {
    this.feedBackAttachmentService.getTableData(this.tripFeedBackID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
          this.dataSource.forEach((ele) => {
            if (ele.activationStatus === true) {
              this.activation = "Active";

            }
            if (ele.activationStatus === false) {
              this.activation = "Deleted"
            }
          })

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ tripFeedBack: this.ImagePath })
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  // Only Numbers with Decimals
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  SortingData(coloumName: any) {

    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.feedBackService.getTableDataSort(this.ReservationID, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

}



