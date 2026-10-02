import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, TimeoutError } from 'rxjs';
import { map, startWith, timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';

import {
  EmailBookingConfirmPayload,
  EmailBookingCorrespondenceItem,
  EmailBookingExtracted,
  EmailBookingAttachmentItem,
  EmailBookingRequestDetail,
  EmailBookingReservationCandidate
} from '../emailBookingRequest/emailBookingRequest.model';
import { EmailBookingRequestService } from '../emailBookingRequest/emailBookingRequest.service';
import { GeneralService } from '../general/general.service';
import { ReservationService } from '../reservation/reservation.service';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { GoogleAddressDropDown } from '../reservation/googleAddressDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { ReservationSourceDropDown } from '../reservation/reservationSourceDropDown.model';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { CustomerPersonDropDown } from '../customerPerson/customerPersonDropDown.model';
import { FormDialogComponentCustomerPerson } from '../customerPerson/dialogs/form-dialog/form-dialog.component';
import {
  getCustomerDisplayLabel,
  getCustomerDisplayValue,
  getCustomerNameFromAutocomplete,
  getCustomerTallyId,
  getCustomerIdValue,
  resolveCustomerFromAutocomplete
} from '../shared/customer-autocomplete.util';

@Component({
  standalone: false,
  selector: 'app-emailBookingConfiguration',
  templateUrl: './emailBookingConfiguration.component.html',
  styleUrls: ['./emailBookingConfiguration.component.sass']
})
export class EmailBookingConfigurationComponent implements OnInit, OnDestroy {
  bookingId = 0;
  loading = false;
  saving = false;
  saveDisabled = true;
  detail: EmailBookingRequestDetail | null = null;
  leftCapture: EmailBookingExtracted = {};
  captured: EmailBookingConfirmPayload = { emailBookingRequestId: 0 };
  rejectReason = '';
  emailCategory = '';
  suggestedEmailCategory = '';
  suggestedEmailCategoryReason = '';
  categorySuggestionApplied = false;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private claimHeld = false;
  reservationCandidates: EmailBookingReservationCandidate[] = [];
  selectedReservationId: number | null = null;
  typedReservationId = '';
  searchingReservations = false;
  contractID: any;
  packageTypeID: any;
  packageType: any;
  packageID: any;
  pickupCityID: any;
  vehicleID: any;
  vehicleCategoryID: any;
  serviceLocationID: any;
  ifBlock = true;
  dropOffifBlock = true;

  CustomerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  BookerList: CustomerPersonDropDown[] = [];
  filteredBookerOptions: Observable<CustomerPersonDropDown[]> = of([]);
  PassengerList: CustomerPersonDropDown[] = [];
  filteredPassengerOptions: Observable<CustomerPersonDropDown[]> = of([]);
  selectedBooker: CustomerPersonDropDown | null = null;
  selectedPassenger: CustomerPersonDropDown | null = null;
  customerGroupName = '';
  private readonly customerPersonQuickAddDialog = {
    panelClass: ['role-form-wide-dialog', 'bc-modeless-person-dialog'],
    width: '1200px',
    maxWidth: '98vw',
    hasBackdrop: false,
    disableClose: false,
    position: { top: '48px', right: '16px' }
  };
  PackageTypeList: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  PackageList: PackageDropDown[] = [];
  filteredPackageOptions: Observable<PackageDropDown[]>;
  CityList: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  VehicleList: VehicleVehicleCategoryDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleVehicleCategoryDropDown[]>;
  ServiceLocationList: OrganizationalEntityDropDown[] = [];
  filteredServiceLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  PaymentModeList: ModeOfPaymentDropDown[] = [];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]> = of([]);
  createdReservationCount = 0;
  expectedReservationCount = 0;
  multiHint = '';
  correspondence: EmailBookingCorrespondenceItem[] = [];
  requestDetailsEmailEnabled = false;
  showRequestDetailsForm = false;
  sendingDetails = false;
  requestDetailsTo = '';
  requestDetailsSubject = '';
  requestDetailsBody = '';
  sourceEmailView: 'formatted' | 'plain' = 'formatted';
  sourceEmailSrcdoc = '';
  GoogleAddressList: GoogleAddressDropDown[] = [];
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  DropOffGoogleAddressList: GoogleAddressDropDown[] = [];
  filteredDropOffGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;

  options = { componentRestrictions: { country: ['IN'] } };

  googlePlacesForm = this.fb.group({
    geoPointID: [null as any],
    geoLocation: [''],
    latitude: [''],
    longitude: [''],
    geoSearchString: [''],
    geoPointName: [''],
    googlePlacesID: [''],
    activationStatus: [false as any]
  });

  advanceTableForm = this.fb.group({
    customerID: [null as any, Validators.required],
    customerName: ['', Validators.required],
    packageTypeID: [null as any, Validators.required],
    packageType: ['', Validators.required],
    packageID: [null as any, Validators.required],
    package: ['', Validators.required],
    vehicleID: [null as any, Validators.required],
    vehicle: ['', Validators.required],
    vehicleCategoryID: [null as any],
    vehicleCategory: [''],
    carType: ['', Validators.required],
    pickupCityID: [null as any, Validators.required],
    pickupCity: ['', Validators.required],
    serviceLocationID: [null as any, Validators.required],
    serviceLocation: ['', Validators.required],
    requestType: ['Local', Validators.required],
    ticketNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{12,15}$/)]],
    pickupDateTime: [null as Date | null, Validators.required],
    pickupAddress: ['', Validators.required],
    pickupAddressDetails: [''],
    pickupAddressLatitude: [''],
    pickupAddressLongitude: [''],
    googleAddresses: [false],
    dropOffDateTime: [null as Date | null, Validators.required],
    dropOffAddress: [''],
    dropOffAddressDetails: [''],
    dropOffAddressLatitude: [''],
    dropOffAddressLongitude: [''],
    googleAdressesDropOff: [false],
    bookerName: ['', Validators.required],
    bookerMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    bookerEmail: ['', [Validators.required, Validators.email]],
    passengerName: ['', Validators.required],
    passengerMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    passengerEmail: ['', [Validators.required, Validators.email]],
    extraPassengers: this.fb.array([]),
    emailCategory: [''],
    specialInstructions: [''],
    customerGroupID: [null as any],
    customerTypeID: [null as any],
    primaryBookerID: [0],
    primaryPassengerID: [0],
    salesExecutiveID: [null as any],
    kamID: [null as any],
    reservationExecutiveID: [null as any],
    reservationSourceID: [null as any],
    reservationSource: [''],
    ecoCompanyID: [11],
    modeOfPayment: ['', Validators.required],
    modeOfPaymentID: [null as any, Validators.required],
    moreThanOneReservation: [false],
    expectedReservationCount: [null as number | null],
    sameGuest: [false]
  });

  getCustomerDisplayLabel = getCustomerDisplayLabel;
  getCustomerDisplayValue = getCustomerDisplayValue;

  get extraPassengers(): FormArray {
    return this.advanceTableForm.get('extraPassengers') as FormArray;
  }

  private readonly requestTypes = ['Airport Pickup', 'Airport Drop', 'Local', 'Outstation', 'Other'];

  private hints = {
    customerName: '',
    packageType: '',
    package: '',
    vehicle: '',
    city: '',
    serviceLocation: '',
    requestType: '',
    pickupAddress: '',
    dropoffAddress: '',
    paymentMode: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EmailBookingRequestService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.InitCustomer();
    this.InitServiceLocation();
    this.InitGoogleAddress();
    this.InitDropOffGoogleAddress();
    this.InitReservationSource();
    this.advanceTableForm.controls.pickupDateTime.valueChanges.subscribe(() => {
      if (this.advanceTableForm.value.customerID) {
        this.onPickupDateChange();
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.bookingId = Number(params.BookingID || params.bookingId || 0);
      if (this.bookingId > 0) {
        this.claimAndLoad();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopHeartbeat();
    this.releaseClaimQuietly();
  }

  @HostListener('window:beforeunload')
  onBrowserLeave(): void {
    this.releaseClaimQuietly();
  }

  private claimAndLoad(): void {
    this.loading = true;
    this.service.claim(this.bookingId).subscribe(
      () => {
        this.claimHeld = true;
        this.startHeartbeat();
        this.load();
      },
      () => {
        this.service.getById(this.bookingId).subscribe(
          (raw) => {
            const status = String(this.pick(raw?.request, 'requestStatus') || this.pick(raw, 'requestStatus') || '').trim();
            if (status.toLowerCase() === 'waitingforreply') {
              this.claimHeld = false;
              this.load();
              return;
            }
            this.loading = false;
            Swal.fire({
              title: 'Email taken',
              text: 'Another clerk has this email.',
              icon: 'info'
            }).then(() => this.router.navigate(['/emailBookingRequest']));
          },
          () => {
            this.loading = false;
            Swal.fire({
              title: 'Email taken',
              text: 'Another clerk has this email.',
              icon: 'info'
            }).then(() => this.router.navigate(['/emailBookingRequest']));
          }
        );
      }
    );
  }

  load(): void {
    this.loading = true;
    this.service.getById(this.bookingId).subscribe(
      (raw) => {
        this.detail = this.normalizeDetail(raw);
        this.sourceEmailView = this.hasFormattedSourceEmail ? 'formatted' : 'plain';
        this.sourceEmailSrcdoc = this.hasFormattedSourceEmail
          ? this.buildSourceEmailSrcdoc(this.formattedSourceHtml)
          : '';
        const ai = this.detail.aiCapture || {};
        const req = this.detail.request || {};
        this.leftCapture = {
          ...ai,
          bookerName: this.sanitizePersonName(this.pick(ai, 'bookerName')),
          passengerName: this.sanitizePersonName(this.pick(ai, 'passengerName'))
        };
        const sender = this.parseSender(this.pick(this.detail, 'fromAddress') || this.pick(raw, 'fromAddress'));
        const emailPhone = this.phoneFromText(this.pick(this.detail, 'textBody') || this.pick(raw, 'textBody') || this.pick(raw, 'htmlBody'));
        this.captured = {
          emailBookingRequestId: this.bookingId,
          customerName: this.pick(ai, 'customerName') || this.pick(req, 'customerName'),
          customerTravelRequestNumber:
            this.pick(ai, 'customerTravelRequestNumber') || this.pick(req, 'customerTravelRequestNumber'),
          bookerName: this.pick(ai, 'bookerName') || this.pick(req, 'bookerName') || sender.name,
          bookerMobile: this.pick(ai, 'bookerMobile') || this.pick(req, 'bookerMobile') || emailPhone,
          bookerEmail: this.pick(ai, 'bookerEmail') || sender.email,
          passengerName: this.pick(ai, 'passengerName') || this.pick(ai, 'bookerName') || this.pick(req, 'bookerName') || sender.name,
          passengerMobile: this.pick(ai, 'passengerMobile') || this.pick(ai, 'bookerMobile') || this.pick(req, 'bookerMobile') || emailPhone,
          passengerEmail: this.pick(ai, 'passengerEmail') || this.pick(ai, 'bookerEmail') || sender.email,
          packageType: this.pick(ai, 'packageType'),
          package: this.pick(ai, 'package'),
          vehicleCategory: this.pick(ai, 'vehicleCategory'),
          vehicle: this.pick(ai, 'vehicle'),
          pickupCity: this.pick(ai, 'pickupCity'),
          pickupAddress: this.pick(ai, 'pickupAddress'),
          pickupDate: this.toDateInput(this.pick(ai, 'pickupDate') || this.pick(req, 'pickupDate')),
          pickupTime: this.toTimeInput(this.pick(ai, 'pickupTime') || this.pick(req, 'pickupTime')),
          dropoffCity: this.pick(ai, 'dropoffCity'),
          dropoffAddress: this.pick(ai, 'dropoffAddress'),
          dropoffDate: this.toDateInput(this.pick(ai, 'dropoffDate')),
          dropoffTime: this.toTimeInput(this.pick(ai, 'dropoffTime')),
          ticketNumber: this.pick(ai, 'ticketNumber'),
          specialRequest: this.pick(ai, 'specialRequest'),
          paymentMode: this.pick(ai, 'paymentMode') || this.pick(req, 'paymentMode')
        };
        this.hints = {
          customerName: this.captured.customerName || '',
          packageType: this.captured.packageType || '',
          package: this.captured.package || '',
          vehicle: this.captured.vehicle || '',
          city: this.captured.pickupCity || '',
          serviceLocation: this.captured.pickupCity || '',
          requestType: this.captured.packageType || this.captured.package || '',
          pickupAddress: this.captured.pickupAddress || '',
          dropoffAddress: this.captured.dropoffAddress || '',
          paymentMode: this.captured.paymentMode || ''
        };
        this.advanceTableForm.patchValue({
          customerName: '',
          customerID: null,
          packageType: '',
          packageTypeID: null,
          package: '',
          packageID: null,
          vehicle: '',
          vehicleID: null,
          carType: '',
          vehicleCategory: '',
          pickupCity: '',
          pickupCityID: null,
          serviceLocation: '',
          serviceLocationID: null,
          requestType: '',
          ticketNumber: this.captured.ticketNumber || '',
          pickupDateTime: this.combineDateTime(this.captured.pickupDate, this.captured.pickupTime),
          pickupAddress: this.captured.pickupAddress || '',
          pickupAddressDetails: this.captured.specialRequest || '',
          dropOffDateTime:
            this.combineDateTime(this.captured.dropoffDate, this.captured.dropoffTime)
            || this.combineDateTime(this.captured.pickupDate, this.captured.pickupTime),
          dropOffAddress: this.captured.dropoffAddress || '',
          bookerName: this.sanitizePersonName(this.captured.bookerName || sender.name || ''),
          bookerMobile: this.digitsMobile(this.captured.bookerMobile || emailPhone),
          bookerEmail: this.captured.bookerEmail || sender.email || '',
          passengerName: this.sanitizePersonName(this.captured.passengerName || this.captured.bookerName || sender.name || ''),
          passengerMobile: this.digitsMobile(this.captured.passengerMobile || this.captured.bookerMobile || emailPhone),
          passengerEmail: this.captured.passengerEmail || this.captured.bookerEmail || sender.email || '',
          specialInstructions: this.captured.specialRequest || '',
          reservationExecutiveID: this.generalService.getUserID(),
          primaryBookerID: 0,
          primaryPassengerID: 0,
          modeOfPayment: this.captured.paymentMode || '',
          modeOfPaymentID: null,
          moreThanOneReservation: false,
          expectedReservationCount: null,
          sameGuest: false
        });
        this.applyMultiSuggestion();
        const savedCategory = this.pick(this.detail, 'emailCategory')
          || this.pick(this.detail?.request, 'emailCategory')
          || '';
        this.suggestedEmailCategory = this.pick(this.detail, 'suggestedEmailCategory') || '';
        this.suggestedEmailCategoryReason = this.pick(this.detail, 'suggestedEmailCategoryReason') || '';
        this.categorySuggestionApplied = !savedCategory && !!this.suggestedEmailCategory;
        this.emailCategory = savedCategory || this.suggestedEmailCategory || '';
        if (this.emailCategory) {
          this.advanceTableForm.patchValue({ emailCategory: this.emailCategory }, { emitEvent: false });
          if (this.emailCategory === 'UpdateReservation' || this.emailCategory === 'CancelReservation') {
            this.searchReservations();
          }
        }
        this.applyRelativePickupDate();
        this.tryMatchCustomer();
        this.tryExactRequestType();
        this.tryExactServiceLocation();
        this.tryExactPickupAddress();
        this.tryExactDropoffAddress();
        this.correspondence = this.detail.correspondence || [];
        this.requestDetailsEmailEnabled = !!this.detail.requestDetailsEmailEnabled;
        this.applyDecisionLock();
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.snackBar.open('Could not load this email booking.', '', { duration: 4000 });
      }
    );
  }

  get passengerCount(): string {
    return this.leftCapture?.passengerName || this.leftCapture?.bookerName ? '1' : '--';
  }

  get receivedOnDisplay(): string {
    return this.formatReceivedUtc(this.detail?.receivedUtc) || '--';
  }

  get categoryHint(): string {
    if (this.emailCategory && !this.canConfirm()) {
      return '';
    }
    if (this.categorySuggestionApplied && this.suggestedEmailCategory === this.emailCategory) {
      const reason = this.suggestedEmailCategoryReason || 'similar earlier emails';
      return 'Suggested: ' + this.categoryLabel(this.suggestedEmailCategory) + ' — ' + reason
        + '. Change it if this is wrong. Save will learn your choice.';
    }
    if (this.suggestedEmailCategory && this.suggestedEmailCategory !== this.emailCategory) {
      return 'Suggestion was ' + this.categoryLabel(this.suggestedEmailCategory)
        + '. Your choice will be learned.';
    }
    if (!this.emailCategory) {
      return 'No suggestion yet. Select a category. Save will learn it for later emails.';
    }
    return 'Your choice will be learned for later emails.';
  }

  categoryLabel(value: string): string {
    switch (value) {
      case 'NewReservation': return 'New Reservation';
      case 'UpdateReservation': return 'Update Reservation';
      case 'CancelReservation': return 'Cancel Reservation';
      case 'NotRelated': return 'Not Related to Reservation';
      default: return value || '';
    }
  }

  get hasAnyAdditionalInfo(): boolean {
    return this.hasDisplayValue(this.detail?.subject)
      || this.hasDisplayValue(this.detail?.fromAddress)
      || this.hasDisplayValue(this.leftCapture.bookerName)
      || this.hasDisplayValue(this.leftCapture.bookerMobile || this.leftCapture.passengerMobile)
      || this.hasDisplayValue(this.leftCapture.ticketNumber)
      || this.hasDisplayValue(this.leftCapture.specialRequest)
      || this.hasDisplayValue(this.detail?.receivedUtc)
      || !!this.detail?.matchedHistoricalReservationId;
  }

  get saveButtonLabel(): string {
    if (this.emailCategory === 'NotRelated') {
      return 'Mark not related';
    }
    if (this.emailCategory === 'UpdateReservation' || this.emailCategory === 'CancelReservation') {
      return 'Save category';
    }
    return 'Save & Configure Booking';
  }

  onEmailCategoryChange(value: string): void {
    this.emailCategory = value || '';
    this.advanceTableForm.patchValue({ emailCategory: this.emailCategory }, { emitEvent: false });
    if (this.emailCategory === 'UpdateReservation' || this.emailCategory === 'CancelReservation') {
      this.searchReservations();
    } else {
      this.reservationCandidates = [];
      this.selectedReservationId = null;
    }
  }

  get identifyClues(): { customer: string; pickupDate: string; passenger: string } {
    const pickup = this.asDate(this.advanceTableForm.value.pickupDateTime)
      || this.asDate(this.leftCapture.pickupDate)
      || this.asDate(this.captured.pickupDate);
    return {
      customer: this.plainCustomerName(this.advanceTableForm.value.customerName)
        || this.leftCapture.customerName
        || this.captured.customerName
        || '',
      pickupDate: pickup ? this.toDateInput(pickup) : (this.leftCapture.pickupDate || this.captured.pickupDate || ''),
      passenger: this.personNameFromControl(this.advanceTableForm.value.passengerName, this.selectedPassenger)
        || this.leftCapture.passengerName
        || this.captured.passengerName
        || ''
    };
  }

  searchReservations(): void {
    if (!this.canConfirm()) {
      return;
    }
    const clues = this.identifyClues;
    const typedId = Number(String(this.typedReservationId || '').trim());
    this.searchingReservations = true;
    this.service.findReservations({
      emailBookingRequestId: this.bookingId,
      customerID: Number(this.advanceTableForm.value.customerID || 0) || undefined,
      customerName: clues.customer || undefined,
      pickupDate: clues.pickupDate || undefined,
      passengerName: clues.passenger || undefined,
      bookerName: this.personNameFromControl(this.advanceTableForm.value.bookerName, this.selectedBooker)
        || this.leftCapture.bookerName
        || this.captured.bookerName
        || undefined,
      bookerMobile: this.digitsMobile(this.advanceTableForm.value.bookerMobile || this.leftCapture.bookerMobile),
      bookerEmail: this.advanceTableForm.value.bookerEmail || this.leftCapture.bookerEmail || undefined,
      ticketNumber: this.advanceTableForm.value.ticketNumber
        || this.leftCapture.ticketNumber
        || this.captured.customerTravelRequestNumber
        || undefined,
      pickupCity: this.advanceTableForm.value.pickupCity || this.leftCapture.pickupCity || undefined,
      reservationID: typedId > 0 ? typedId : undefined
    }).subscribe(
      (rows) => {
        this.reservationCandidates = rows || [];
        this.searchingReservations = false;
        if (typedId > 0) {
          const match = this.reservationCandidates.find((row) => Number(row.reservationID) === typedId);
          this.selectedReservationId = match ? typedId : typedId;
        } else if (this.selectedReservationId
          && !this.reservationCandidates.some((row) => Number(row.reservationID) === this.selectedReservationId)) {
          this.selectedReservationId = null;
        }
      },
      () => {
        this.searchingReservations = false;
        this.reservationCandidates = [];
        this.snackBar.open('Could not search reservations.', '', { duration: 4000 });
      }
    );
  }

  selectReservation(id: number): void {
    this.selectedReservationId = Number(id) || null;
    if (this.selectedReservationId) {
      this.typedReservationId = String(this.selectedReservationId);
    }
  }

  linkedReservationId(): number | null {
    const selected = Number(this.selectedReservationId || 0);
    if (selected > 0) {
      return selected;
    }
    const typed = Number(String(this.typedReservationId || '').trim());
    return typed > 0 ? typed : null;
  }

  candidatePickup(row: EmailBookingReservationCandidate): string {
    return this.formatDateTime(row?.pickupDate, row?.pickupTime);
  }

  private plainCustomerName(value: any): string {
    return getCustomerNameFromAutocomplete(value) || '';
  }

  confirmAdd(): void {
    if (this.saving) {
      return;
    }
    if (!this.canConfirm()) {
      return;
    }
    if (!this.emailCategory) {
      Swal.fire({
        title: 'Select a category',
        text: 'Choose New Reservation, Update Reservation, Cancel Reservation, or Not Related to Reservation.',
        icon: 'error'
      });
      return;
    }
    if (this.emailCategory !== 'NewReservation') {
      if ((this.emailCategory === 'UpdateReservation' || this.emailCategory === 'CancelReservation')
        && !this.linkedReservationId()) {
        Swal.fire({
          title: 'Pick a reservation',
          text: 'Select a matching reservation or type a Reservation ID, then save.',
          icon: 'error'
        });
        return;
      }
      this.saveEmailCategory();
      return;
    }
    const pickup = this.asDate(this.advanceTableForm.value.pickupDateTime);
    if (pickup && !this.advanceTableForm.value.dropOffDateTime) {
      this.advanceTableForm.patchValue({ dropOffDateTime: pickup });
    }
    if (this.advanceTableForm.value.moreThanOneReservation) {
      const count = Number(this.advanceTableForm.value.expectedReservationCount || 0);
      if (!count || count < 2) {
        Swal.fire({
          title: 'Number of Reservations',
          text: 'Enter how many reservations this email needs (at least 2).',
          icon: 'error'
        });
        return;
      }
    }
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.extraPassengers.controls.forEach((group) => group.markAllAsTouched());
      const missing = this.listInvalidEcoFields();
      const bullets = missing
        .map((row) => `<li>${this.escapeHtml(row.label)} — ${this.escapeHtml(row.reason)}</li>`)
        .join('');
      Swal.fire({
        title: 'Missing details',
        html: `<p>Fill these required Eco fields. Drop Address is optional.</p><ul style="text-align:left;margin:0.5em 0 0;padding-left:1.25em;">${bullets || '<li>Required Eco fields are incomplete.</li>'}</ul>`,
        icon: 'error'
      }).then(() => this.scrollToInvalidEcoField(missing[0]?.controlName));
      return;
    }
    this.saving = true;
    try {
      this.checkDuplicateThenPost();
    } catch (err) {
      this.saving = false;
      Swal.fire({
        title: 'Save failed',
        text: err instanceof Error ? err.message : 'Could not start save.',
        icon: 'error'
      });
    }
  }

  private readonly ecoFieldOrder: { name: string; label: string; pairWith?: string }[] = [
    { name: 'customerName', label: 'Customer', pairWith: 'customerID' },
    { name: 'bookerName', label: 'Booker Name' },
    { name: 'bookerMobile', label: 'Booker Mobile' },
    { name: 'bookerEmail', label: 'Booker Email' },
    { name: 'passengerName', label: 'Passenger Name' },
    { name: 'passengerMobile', label: 'Passenger Mobile' },
    { name: 'passengerEmail', label: 'Passenger Email' },
    { name: 'packageType', label: 'Duty Type', pairWith: 'packageTypeID' },
    { name: 'package', label: 'Package', pairWith: 'packageID' },
    { name: 'vehicle', label: 'Car', pairWith: 'vehicleID' },
    { name: 'carType', label: 'Car Type' },
    { name: 'modeOfPayment', label: 'Mode of Payment', pairWith: 'modeOfPaymentID' },
    { name: 'pickupCity', label: 'City', pairWith: 'pickupCityID' },
    { name: 'serviceLocation', label: 'Service Location', pairWith: 'serviceLocationID' },
    { name: 'requestType', label: 'Request Type' },
    { name: 'ticketNumber', label: 'Ticket Number' },
    { name: 'pickupDateTime', label: 'Pickup Date & Time' },
    { name: 'pickupAddress', label: 'Pickup Address' },
    { name: 'dropOffDateTime', label: 'Drop-off Date & Time' }
  ];

  private listInvalidEcoFields(): { label: string; reason: string; controlName: string }[] {
    const items: { label: string; reason: string; controlName: string }[] = [];
    for (const field of this.ecoFieldOrder) {
      const control = this.advanceTableForm.get(field.name);
      const pair = field.pairWith ? this.advanceTableForm.get(field.pairWith) : null;
      const nameInvalid = !!control?.invalid;
      const pairInvalid = !!pair?.invalid;
      if (!nameInvalid && !pairInvalid) {
        continue;
      }
      let reason = control && nameInvalid
        ? this.ecoFieldReason(control, field.name)
        : 'select from the list';
      if (field.pairWith && pairInvalid && control && String(control.value || '').trim()
        && (!nameInvalid || control.hasError('required') === false)) {
        reason = 'select from the list';
      }
      items.push({ label: field.label, reason, controlName: field.name });
    }
    this.pushInvalidExtraPassengers(items);
    return items;
  }

  private pushInvalidExtraPassengers(items: { label: string; reason: string; controlName: string }[]): void {
    this.extraPassengers.controls.forEach((group, index) => {
      const n = index + 1;
      const labels: Record<string, string> = {
        name: `Additional Passenger ${n} Name`,
        mobile: `Additional Passenger ${n} Mobile`,
        email: `Additional Passenger ${n} Email`
      };
      ['name', 'mobile', 'email'].forEach((key) => {
        const extraControl = group.get(key);
        if (extraControl?.invalid) {
          items.push({
            label: labels[key],
            reason: this.ecoFieldReason(extraControl, key),
            controlName: `extra.${index}.${key}`
          });
        }
      });
    });
  }

  private ecoFieldReason(control: AbstractControl, controlName: string): string {
    const errors = control.errors || {};
    if (errors['personInvalid']) {
      return 'select from the customer person list';
    }
    if (errors['email']) {
      return 'enter a valid email';
    }
    if (errors['pattern'] || errors['minlength'] || errors['maxlength']) {
      if (controlName === 'ticketNumber') {
        return 'must be 12 to 15 digits';
      }
      if (controlName.toLowerCase().includes('mobile') || controlName === 'mobile') {
        return 'must be a 10-digit mobile starting with 6-9';
      }
      return 'has an invalid format';
    }
    if (errors['required']) {
      return 'is required';
    }
    return 'is required';
  }

  private escapeHtml(value: string): string {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private scrollToInvalidEcoField(controlName?: string): void {
    if (!controlName || typeof document === 'undefined') {
      return;
    }
    let input: HTMLElement | null = null;
    if (controlName.startsWith('extra.')) {
      const parts = controlName.split('.');
      const block = document.querySelectorAll('.bc-extra-passenger')[Number(parts[1])];
      input = block?.querySelector(`[formControlName="${parts[2]}"]`) as HTMLElement || null;
    } else {
      input = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement || null;
    }
    const field = (input?.closest('mat-form-field') as HTMLElement) || input;
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus?.();
  }

  private checkDuplicateThenPost(): void {
    const form = this.advanceTableForm.getRawValue();
    const pickup = this.asDate(form.pickupDateTime);
    const customerID = Number(form.customerID || 0);
    const passengerID = Number(form.primaryPassengerID || 0);
    const cityID = Number(form.pickupCityID || 0);
    const pickupTime = pickup ? this.toTimeInput(pickup) : '';

    if (!pickup || Number.isNaN(pickup.getTime()) || !customerID || !passengerID || !cityID) {
      this.Post();
      return;
    }

    this.reservationService
      .CheckValidationForSameReservation(customerID, passengerID, cityID, pickup as any, pickupTime || '00:00')
      .subscribe(
        (data) => {
          if (data?.result === true) {
            const customerLabel = getCustomerNameFromAutocomplete(form.customerName) || '';
            const passengerName = this.personNameFromControl(form.passengerName, this.selectedPassenger) || '';
            const pickupCity = form.pickupCity || '';
            Swal.fire({
              title: 'Confirmation',
              html: `
                <div style="text-align:left">
                  There is already a reservation with same details.<br>
                  <b>Customer : </b> ${customerLabel}<br>
                  <b>Passenger : </b> ${passengerName}<br>
                  <b>City : </b> ${pickupCity}<br>
                  <b>PickUp Date : </b> ${this.formatDuplicatePromptDate(pickup)}<br>
                  <b>PickUp Time : </b> ${pickupTime || '00:00'}<br>
                  Do you really want to make this booking?
                </div>
              `,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                this.Post();
                return;
              }
              this.saving = false;
            });
            return;
          }
          this.Post();
        },
        () => this.Post()
      );
  }

  private formatDuplicatePromptDate(value: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(value.getDate()).padStart(2, '0')}-${months[value.getMonth()]}-${value.getFullYear()}`;
  }

  private Post(): void {
    const form = this.advanceTableForm.getRawValue();
    const pickup = this.asDate(form.pickupDateTime);
    const drop = this.asDate(form.dropOffDateTime);
    const payload: EmailBookingConfirmPayload = {
      ...this.captured,
      emailBookingRequestId: this.bookingId,
      customerID: Number(form.customerID || 0) || undefined,
      customerName: getCustomerNameFromAutocomplete(form.customerName) || this.captured.customerName,
      customerTravelRequestNumber:
        this.captured.customerTravelRequestNumber || this.detail?.request?.customerTravelRequestNumber,
      bookerName: this.sanitizePersonName(this.personNameFromControl(form.bookerName, this.selectedBooker)),
      bookerMobile: this.digitsMobile(form.bookerMobile),
      bookerEmail: form.bookerEmail,
      passengerName: this.sanitizePersonName(this.personNameFromControl(form.passengerName, this.selectedPassenger)),
      passengerMobile: this.digitsMobile(form.passengerMobile),
      passengerEmail: form.passengerEmail,
      extraPassengers: (form.extraPassengers || []).map((row: any) => ({
        name: this.sanitizePersonName(row?.name),
        mobile: this.digitsMobile(row?.mobile),
        email: row?.email
      })),
      emailCategory: this.emailCategory || 'NewReservation',
      packageTypeID: Number(form.packageTypeID || 0) || undefined,
      packageType: form.packageType,
      packageID: Number(form.packageID || 0) || undefined,
      package: form.package,
      vehicleID: Number(form.vehicleID || 0) || undefined,
      vehicle: form.vehicle,
      vehicleCategoryID: Number(form.vehicleCategoryID || 0) || undefined,
      vehicleCategory: form.carType || form.vehicleCategory,
      pickupCityID: Number(form.pickupCityID || 0) || undefined,
      pickupCity: form.pickupCity,
      pickupAddress: form.pickupAddress,
      pickupAddressDetails: form.pickupAddressDetails,
      pickupDate: pickup ? this.toDateInput(pickup) : this.captured.pickupDate,
      pickupTime: pickup ? this.toTimeInput(pickup) : this.captured.pickupTime,
      dropoffCity: this.captured.dropoffCity || form.pickupCity,
      dropoffAddress: form.dropOffAddress,
      dropOffAddressDetails: form.dropOffAddressDetails,
      dropoffDate: drop ? this.toDateInput(drop) : this.captured.dropoffDate,
      dropoffTime: drop ? this.toTimeInput(drop) : this.captured.dropoffTime,
      serviceLocationID: Number(form.serviceLocationID || 0) || undefined,
      serviceLocation: form.serviceLocation,
      requestType: form.requestType,
      ticketNumber: form.ticketNumber,
      specialRequest: form.specialInstructions || this.captured.specialRequest,
      customerGroupID: Number(form.customerGroupID || 0) || undefined,
      customerTypeID: Number(form.customerTypeID || 0) || undefined,
      primaryBookerID: Number(form.primaryBookerID || 0) || undefined,
      primaryPassengerID: Number(form.primaryPassengerID || 0) || undefined,
      salesExecutiveID: Number(form.salesExecutiveID || 0) || undefined,
      kamID: Number(form.kamID || 0) || undefined,
      reservationExecutiveID: Number(form.reservationExecutiveID || this.generalService.getUserID() || 0) || undefined,
      userID: this.generalService.getUserID(),
      reservationSourceID: Number(form.reservationSourceID || 0) || undefined,
      reservationSource: form.reservationSource || 'Email Booking AI',
      pickupDateString: pickup ? this.formatBookingDateString(pickup) : undefined,
      pickupTimeString: pickup ? this.toTimeInput(pickup) : undefined,
      dropOffDateString: drop ? this.formatBookingDateString(drop) : undefined,
      dropOffTimeString: drop ? this.toTimeInput(drop) : undefined,
      pickupAddressLatitude: form.pickupAddressLatitude,
      pickupAddressLongitude: form.pickupAddressLongitude,
      dropOffAddressLatitude: form.dropOffAddressLatitude,
      dropOffAddressLongitude: form.dropOffAddressLongitude,
      ecoCompanyID: Number(form.ecoCompanyID || 11),
      paymentMode: form.modeOfPayment,
      modeOfPaymentID: Number(form.modeOfPaymentID || 0) || undefined,
      moreThanOneReservation: !!form.moreThanOneReservation,
      expectedReservationCount: form.moreThanOneReservation
        ? Number(form.expectedReservationCount || 0) || undefined
        : undefined,
      sameGuest: !!form.sameGuest
    };
    this.service.confirm(payload).pipe(timeout(120000)).subscribe(
      (res) => {
        const reservationId = Number(res?.reservationID || this.parseCopyId(res?.result) || 0);
        const copyId = Number(res?.reservationEmailAIID || 0);
        this.saving = false;
        if (this.detail?.request) {
          this.detail.request.requestStatus = 'Confirmed';
        }
        const continueLoop = !!(res as any)?.continueLoop || !!(res as any)?.ContinueLoop;
        const created = Number((res as any)?.createdReservationCount ?? (res as any)?.CreatedReservationCount ?? 0);
        const expected = Number((res as any)?.expectedReservationCount ?? (res as any)?.ExpectedReservationCount ?? 0);
        if (continueLoop) {
          this.prepareNextReservation(created, expected, reservationId);
          return;
        }
        this.claimHeld = false;
        this.stopHeartbeat();
        this.applyDecisionLock();
        Swal.fire({
          title: '',
          text: reservationId
            ? 'Reservation ' + reservationId + ' created on UAT in dbo.Reservation.'
              + (copyId ? ' Email AI copy ' + copyId + ' was also saved.' : '')
            : (res?.result || 'Email booking saved on UAT.'),
          icon: 'success'
        });
      },
      (error) => {
        const timedOut = error instanceof TimeoutError || error?.name === 'TimeoutError';
        const message = timedOut
          ? 'The API did not respond. Restart IIS Express, then save again.'
          : typeof error === 'string'
            ? error
            : error?.error?.result || error?.error?.message || error?.message || 'Failed to save reservation.';
        Swal.fire({
          title: 'Save failed',
          text: message,
          icon: 'error'
        });
        this.saving = false;
      }
    );
  }

  private parseCopyId(result?: string): string {
    if (!result) {
      return '';
    }
    const parts = String(result).split(':');
    return parts.length > 1 ? parts[1] : '';
  }

  private saveEmailCategory(): void {
    this.saving = true;
    this.service.classify(this.bookingId, this.emailCategory, this.linkedReservationId()).subscribe(
      (res) => {
        this.saving = false;
        if (this.detail?.request) {
          this.detail.request.requestStatus = this.emailCategory;
          this.detail.request.emailCategory = this.emailCategory;
          this.detail.emailCategory = this.emailCategory;
        }
        const linked = this.linkedReservationId();
        if (this.detail && linked) {
          this.detail.matchedHistoricalReservationId = linked;
        }
        this.claimHeld = false;
        this.stopHeartbeat();
        this.applyDecisionLock();
        Swal.fire({
          title: '',
          text: res?.result || 'Email category saved. This label will be used for learning.',
          icon: 'success'
        }).then(() => {
          if (this.emailCategory === 'NotRelated') {
            this.router.navigate(['/emailBookingRequest']);
          }
        });
      },
      (err) => {
        this.saving = false;
        Swal.fire({
          title: 'Save failed',
          text: err?.error?.result || 'Could not save the email category.',
          icon: 'error'
        });
      }
    );
  }

  reject(): void {
    if (!this.canRequestDetails()) {
      return;
    }
    this.saving = true;
    this.service.reject(this.bookingId, this.rejectReason).subscribe(
      (res) => {
        this.saving = false;
        this.claimHeld = false;
        this.stopHeartbeat();
        this.snackBar.open(res.result || 'Rejected', '', { duration: 3000 });
        this.router.navigate(['/emailBookingRequest']);
      },
      (err) => {
        this.saving = false;
        this.snackBar.open(err?.error?.result || 'Reject failed', '', { duration: 4000 });
      }
    );
  }

  canConfirm(): boolean {
    const status = String(this.pick(this.detail?.request, 'requestStatus') || '').trim();
    return status.toLowerCase() === 'awaitingconfirmation';
  }

  canRequestDetails(): boolean {
    const status = String(this.pick(this.detail?.request, 'requestStatus') || '').trim().toLowerCase();
    return status === 'awaitingconfirmation' || status === 'waitingforreply';
  }

  openRequestDetails(): void {
    if (!this.canRequestDetails()) {
      return;
    }
    if (!this.requestDetailsEmailEnabled) {
      Swal.fire({
        title: 'Production only',
        text: 'Request details email is blocked on UAT. Enable EmailBookingAI:RequestDetailsEmail=true on Production (go-live checklist).',
        icon: 'info'
      });
      return;
    }
    const token = '[EB-' + this.bookingId + ']';
    const original = String(this.detail?.subject || 'cab booking').trim();
    this.requestDetailsSubject = (original.toLowerCase().startsWith('re:') ? original : 'Re: ' + original) + ' ' + token;
    const to = [
      this.parseSender(this.detail?.fromAddress).email,
      this.advanceTableForm.value.bookerEmail || this.captured.bookerEmail,
      this.advanceTableForm.value.passengerEmail || this.captured.passengerEmail
    ]
      .map((value) => String(value || '').trim())
      .filter((value, index, all) => value && value.includes('@') && all.indexOf(value) === index);
    this.requestDetailsTo = to.join(', ');
    this.requestDetailsBody = this.buildDetailsTemplate();
    this.showRequestDetailsForm = true;
  }

  sendRequestDetails(): void {
    if (this.sendingDetails) {
      return;
    }
    if (!this.requestDetailsTo.trim() || !this.requestDetailsBody.trim()) {
      Swal.fire({
        title: 'Missing details',
        text: 'Enter at least one To email and a message.',
        icon: 'error'
      });
      return;
    }
    this.sendingDetails = true;
    this.service
      .requestDetails({
        emailBookingRequestId: this.bookingId,
        toAddresses: this.requestDetailsTo,
        subject: this.requestDetailsSubject,
        body: this.requestDetailsBody
      })
      .subscribe(
        (res) => {
          this.sendingDetails = false;
          this.showRequestDetailsForm = false;
          this.claimHeld = false;
          this.stopHeartbeat();
          Swal.fire({
            title: 'Email sent',
            text: res?.result || 'Waiting for the booker or passenger to reply. You can take the next email.',
            icon: 'success'
          }).then(() => this.router.navigate(['/emailBookingRequest']));
        },
        (err) => {
          this.sendingDetails = false;
          Swal.fire({
            title: 'Could not send',
            text: err?.error?.result || 'Request details email is blocked on UAT until Production go-live.',
            icon: 'error'
          });
        }
      );
  }

  cancelRequestDetails(): void {
    this.showRequestDetailsForm = false;
  }

  private buildDetailsTemplate(): string {
    const name = this.sanitizePersonName(
      this.advanceTableForm.value.passengerName
      || this.advanceTableForm.value.bookerName
      || this.leftCapture.passengerName
      || 'Sir / Madam'
    );
    const missing = this.listInvalidEcoFields().map((row) => '- ' + row.label).join('\n');
    return (
      'Dear ' + (name || 'Sir / Madam') + ',\n\n'
      + 'We received your cab booking request'
      + (this.detail?.subject ? ' (' + this.detail.subject + ')' : '')
      + '. We need the following details before we can create the reservation:\n\n'
      + (missing || '- Pickup date and time, pickup address, ticket number, booker and passenger (name, mobile, email)')
      + '\n\nPlease reply to this email with the missing information.\n\nRegards,\nEco Mobility'
    );
  }

  private applyDecisionLock(): void {
    const open = this.canConfirm();
    this.saveDisabled = open;
    if (open) {
      this.advanceTableForm.enable({ emitEvent: false });
      return;
    }
    this.advanceTableForm.disable({ emitEvent: false });
  }

  back(): void {
    this.stopHeartbeat();
    this.releaseClaimQuietly();
    this.router.navigate(['/emailBookingRequest']);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (!this.claimHeld || this.bookingId <= 0) {
        return;
      }
      this.service.heartbeat(this.bookingId).subscribe({
        error: () => {
          this.claimHeld = false;
          this.stopHeartbeat();
          Swal.fire({
            title: 'Email taken',
            text: 'Another clerk has this email, or the claim expired.',
            icon: 'info'
          }).then(() => this.router.navigate(['/emailBookingRequest']));
        }
      });
    }, 60000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private releaseClaimQuietly(): void {
    if (!this.claimHeld || this.bookingId <= 0) {
      return;
    }
    this.claimHeld = false;
    this.service.release(this.bookingId).subscribe({ error: () => undefined });
  }

  InitCustomer(): void {
    this.generalService.getCustomers().subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.advanceTableForm.controls.customerName.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCustomers(value || ''))
      );
      this.tryMatchCustomer();
    });
  }

  onCustomerSelected(value: string): void {
    const selected = resolveCustomerFromAutocomplete(value, this.CustomerList);
    if (selected) {
      this.applyCustomer(selected);
    }
  }

  private tryMatchCustomer(): void {
    if (this.advanceTableForm.value.customerID) {
      return;
    }
    const match = this.matchCustomerFromBody()
      || this.exactMatch(this.CustomerList, (row) => row.customerName, this.hints.customerName)
      || this.matchCustomerByFromDomain();
    if (match) {
      this.applyCustomer(match);
    }
  }

  addPassenger(): void {
    this.extraPassengers.push(this.createExtraPassengerGroup());
  }

  removePassenger(index: number): void {
    this.extraPassengers.removeAt(index);
  }

  extraPassengerGroup(index: number): FormGroup {
    return this.extraPassengers.at(index) as FormGroup;
  }

  private createExtraPassengerGroup(name = '', mobile = '', email = ''): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      mobile: [this.digitsMobile(mobile), [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: [email, [Validators.required, Validators.email]]
    });
  }

  onPersonMobileInput(controlName: string, event: any): void {
    this.advanceTableForm.get(controlName)?.setValue(this.digitsMobile(event?.target?.value), { emitEvent: false });
  }

  onExtraMobileInput(index: number, event: any): void {
    this.extraPassengerGroup(index).get('mobile')?.setValue(this.digitsMobile(event?.target?.value), { emitEvent: false });
  }

  private applyCustomer(selected: CustomerDropDown): void {
    this.advanceTableForm.patchValue({
      customerID: selected.customerID,
      customerName: getCustomerDisplayValue(selected),
      primaryBookerID: 0,
      primaryPassengerID: 0
    });
    this.selectedBooker = null;
    this.selectedPassenger = null;
    this.loadCustomerSupportIds(selected.customerID);
    this.loadCustomerPeople(selected.customerID);
    this.resolveContract();
  }

  private loadCustomerSupportIds(customerID: number): void {
    if (!customerID) {
      return;
    }
    this.generalService.GetSalesManager(customerID).subscribe((data) => {
      const first = (data || [])[0];
      if (first?.salesExecutiveID) {
        this.advanceTableForm.patchValue({ salesExecutiveID: first.salesExecutiveID });
      }
    });
    this.generalService.GetCustomerKam(customerID).subscribe((data) => {
      const first = (data || [])[0];
      if (first?.kamID) {
        this.advanceTableForm.patchValue({ kamID: first.kamID });
      }
    });
  }

  private loadCustomerPeople(customerID: number): void {
    if (!customerID) {
      return;
    }
    this.generalService.GetCustomerByID(customerID).subscribe(
      (detail) => {
        this.customerGroupName = detail?.customerGroup || detail?.CustomerGroup || '';
        this.advanceTableForm.patchValue({
          customerGroupID: detail?.customerGroupID || detail?.CustomerGroupID || null,
          customerTypeID: detail?.customerTypeID || detail?.CustomerTypeID || null
        });
        this.InitBooker(customerID);
        this.InitPassenger(customerID);
      },
      () => {
        this.InitBooker(customerID);
        this.InitPassenger(customerID);
      }
    );
  }

  InitBooker(customerID = Number(this.advanceTableForm.value.customerID || 0), selectId = 0): void {
    if (!customerID) {
      this.BookerList = [];
      this.filteredBookerOptions = of([]);
      return;
    }
    this.generalService.GetCPForBookerOnCustomer(customerID).subscribe(
      (data) => {
        this.BookerList = data || [];
        this.advanceTableForm.controls.bookerName.setValidators([
          Validators.required,
          this.personListValidator(() => this.BookerList)
        ]);
        this.advanceTableForm.controls.bookerName.updateValueAndValidity({ emitEvent: false });
        this.filteredBookerOptions = this.advanceTableForm.controls.bookerName.valueChanges.pipe(
          startWith(this.advanceTableForm.value.bookerName || ''),
          map((value) => this.filterPeople(this.BookerList, value))
        );
        const created = selectId ? this.findPersonById(this.BookerList, selectId) : null;
        if (created) {
          this.applyBooker(created);
        } else {
          this.tryMatchBooker();
        }
      },
      () => {
        this.BookerList = [];
        this.filteredBookerOptions = of([]);
      }
    );
  }

  InitPassenger(customerID = Number(this.advanceTableForm.value.customerID || 0), selectId = 0): void {
    if (!customerID) {
      this.PassengerList = [];
      this.filteredPassengerOptions = of([]);
      return;
    }
    this.generalService.GetPassengerForSBT(customerID).subscribe(
      (data) => {
        this.PassengerList = data || [];
        this.advanceTableForm.controls.passengerName.setValidators([
          Validators.required,
          this.personListValidator(() => this.PassengerList)
        ]);
        this.advanceTableForm.controls.passengerName.updateValueAndValidity({ emitEvent: false });
        this.filteredPassengerOptions = this.advanceTableForm.controls.passengerName.valueChanges.pipe(
          startWith(this.advanceTableForm.value.passengerName || ''),
          map((value) => this.filterPeople(this.PassengerList, value))
        );
        const created = selectId ? this.findPersonById(this.PassengerList, selectId) : null;
        if (created) {
          this.applyPassenger(created);
        } else {
          this.tryMatchPassenger();
        }
      },
      () => {
        this.PassengerList = [];
        this.filteredPassengerOptions = of([]);
      }
    );
  }

  personDisplay(row: CustomerPersonDropDown | null): string {
    if (!row) {
      return '';
    }
    const name = String(row.customerPersonName || '').trim();
    const phone = this.personPhone(row);
    return phone ? name + ' - ' + phone : name;
  }

  onBookerSelected(value: string): void {
    const selected = this.findPerson(this.BookerList, value);
    if (selected) {
      this.applyBooker(selected);
    }
  }

  onPassengerSelected(value: string): void {
    const selected = this.findPerson(this.PassengerList, value);
    if (selected) {
      this.applyPassenger(selected);
    }
  }

  openNewBooker(): void {
    this.ensureCustomerSelected();
    this.openCustomerPersonDialog('CB', {
      name: this.personNameFromControl(this.advanceTableForm.value.bookerName, this.selectedBooker)
        || this.captured.bookerName,
      mobile: this.advanceTableForm.value.bookerMobile || this.captured.bookerMobile,
      email: this.advanceTableForm.value.bookerEmail || this.captured.bookerEmail
    });
  }

  openNewPassenger(): void {
    this.ensureCustomerSelected();
    this.openCustomerPersonDialog('CP', {
      name: this.personNameFromControl(this.advanceTableForm.value.passengerName, this.selectedPassenger)
        || this.captured.passengerName,
      mobile: this.advanceTableForm.value.passengerMobile || this.captured.passengerMobile,
      email: this.advanceTableForm.value.passengerEmail || this.captured.passengerEmail
    });
  }

  formatReceivedUtc(value: any): string {
    const date = this.asDate(value);
    if (!date) {
      return '';
    }
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  private ensureCustomerSelected(): void {
    if (Number(this.advanceTableForm.value.customerID || 0) > 0) {
      return;
    }
    const typed = getCustomerNameFromAutocomplete(this.advanceTableForm.value.customerName);
    const matches = this.filterCustomers(typed || this.advanceTableForm.value.customerName || '');
    if (matches.length === 1) {
      this.applyCustomer(matches[0]);
    }
  }

  private openCustomerPersonDialog(forCP: 'CB' | 'CP', prefill: { name?: string; mobile?: string; email?: string }): void {
    const customerID = Number(this.advanceTableForm.value.customerID || 0);
    if (!customerID) {
      this.snackBar.open('Select a customer first.', '', { duration: 3000 });
      return;
    }
    const customerGroupID = Number(this.advanceTableForm.value.customerGroupID || 0);
    const customerName = getCustomerNameFromAutocomplete(this.advanceTableForm.value.customerName);
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, {
      ...this.customerPersonQuickAddDialog,
      data: {
        advanceTable: {
          customerID,
          customerName,
          customerGroupID,
          customerGroup: this.customerGroupName,
          customerCustomerGroup: customerName,
          customerPersonName: this.sanitizePersonName(this.stripPersonDisplay(prefill.name)),
          primaryMobile: this.digitsMobile(prefill.mobile),
          phone: this.digitsMobile(prefill.mobile),
          primaryEmail: prefill.email || ''
        },
        action: 'add',
        forCP,
        allowMinimize: true,
        CustomerGroupID: customerGroupID,
        CustomerGroupName: this.customerGroupName
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      const createdId = Number(res?.customerPersonID || 0);
      if (forCP === 'CB') {
        this.InitBooker(customerID, createdId);
      } else {
        this.InitPassenger(customerID, createdId);
      }
    });
  }

  private tryMatchBooker(): void {
    const match = this.matchPerson(
      this.BookerList,
      this.captured.bookerEmail || this.advanceTableForm.value.bookerEmail,
      this.captured.bookerName || this.advanceTableForm.value.bookerName,
      this.captured.bookerMobile || this.advanceTableForm.value.bookerMobile
    );
    if (match) {
      this.applyBooker(match);
    }
  }

  private tryMatchPassenger(): void {
    const match = this.matchPerson(
      this.PassengerList,
      this.captured.passengerEmail || this.advanceTableForm.value.passengerEmail,
      this.captured.passengerName || this.advanceTableForm.value.passengerName,
      this.captured.passengerMobile || this.advanceTableForm.value.passengerMobile
    );
    if (match) {
      this.applyPassenger(match);
    }
  }

  private applyBooker(row: CustomerPersonDropDown): void {
    this.selectedBooker = row;
    const email = this.personEmail(row) || this.advanceTableForm.value.bookerEmail || this.captured.bookerEmail || '';
    this.advanceTableForm.patchValue({
      bookerName: this.personDisplay(row),
      bookerMobile: this.personPhone(row) || this.digitsMobile(this.advanceTableForm.value.bookerMobile),
      bookerEmail: email,
      primaryBookerID: row.customerPersonID
    });
  }

  private applyPassenger(row: CustomerPersonDropDown): void {
    this.selectedPassenger = row;
    const email = this.personEmail(row) || this.advanceTableForm.value.passengerEmail || this.captured.passengerEmail || '';
    this.advanceTableForm.patchValue({
      passengerName: this.personDisplay(row),
      passengerMobile: this.personPhone(row) || this.digitsMobile(this.advanceTableForm.value.passengerMobile),
      passengerEmail: email,
      primaryPassengerID: row.customerPersonID
    });
  }

  private matchPerson(
    list: CustomerPersonDropDown[],
    email?: string,
    name?: string,
    mobile?: string
  ): CustomerPersonDropDown | null {
    const rows = list || [];
    const emailNeedle = String(email || '').trim().toLowerCase();
    if (emailNeedle) {
      const byEmail = rows.find((row) => this.personEmail(row).toLowerCase() === emailNeedle);
      if (byEmail) {
        return byEmail;
      }
    }
    const nameNeedle = this.stripPersonDisplay(name).toLowerCase();
    if (nameNeedle) {
      const byName = rows.find((row) => String(row.customerPersonName || '').trim().toLowerCase() === nameNeedle);
      if (byName) {
        return byName;
      }
    }
    const mobileNeedle = this.digitsMobile(mobile);
    if (mobileNeedle.length === 10) {
      const byMobile = rows.find((row) => this.personPhone(row) === mobileNeedle);
      if (byMobile) {
        return byMobile;
      }
    }
    return null;
  }

  private filterPeople(list: CustomerPersonDropDown[], value: string): CustomerPersonDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    return (list || []).filter((row) => {
      const name = String(row.customerPersonName || '').toLowerCase();
      const phone = this.personPhone(row);
      const email = this.personEmail(row).toLowerCase();
      const display = this.personDisplay(row).toLowerCase();
      return name.includes(filterValue)
        || phone.includes(filterValue)
        || email.includes(filterValue)
        || display.includes(filterValue);
    });
  }

  private findPerson(list: CustomerPersonDropDown[], value: string): CustomerPersonDropDown | null {
    const needle = String(value || '').trim().toLowerCase();
    return (list || []).find((row) => this.personDisplay(row).toLowerCase() === needle) || null;
  }

  private findPersonById(list: CustomerPersonDropDown[], id: number): CustomerPersonDropDown | null {
    return (list || []).find((row) => Number(row.customerPersonID) === id) || null;
  }

  private personListValidator(listFn: () => CustomerPersonDropDown[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value || '').trim().toLowerCase();
      if (!value) {
        return { personInvalid: true };
      }
      const match = (listFn() || []).some((row) => this.personDisplay(row).toLowerCase() === value);
      return match ? null : { personInvalid: true };
    };
  }

  private personPhone(row: CustomerPersonDropDown | null): string {
    return this.digitsMobile(row?.primaryMobile || row?.phone || '');
  }

  private personEmail(row: CustomerPersonDropDown | null): string {
    return String(row?.primaryEmail || '').trim();
  }

  private personNameFromControl(value: string, selected: CustomerPersonDropDown | null): string {
    if (selected?.customerPersonName) {
      return String(selected.customerPersonName).trim();
    }
    return this.sanitizePersonName(this.stripPersonDisplay(value));
  }

  private stripPersonDisplay(value: string): string {
    const text = String(value || '').trim();
    const idx = text.lastIndexOf(' - ');
    return idx > 0 ? text.slice(0, idx).trim() : text;
  }

  private sanitizePersonName(value: string): string {
    return String(value || '')
      .replace(/[^A-Za-z\u00C0-\u024F\u0900-\u097F\s'\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')
      .trim();
  }

  private applyRelativePickupDate(): void {
    if (this.advanceTableForm.value.pickupDateTime) {
      return;
    }
    const text = [
      this.detail?.subject,
      this.detail?.textBody,
      this.leftCapture?.specialRequest
    ].filter((part) => this.hasDisplayValue(part)).join('\n').toLowerCase();
    let offset: number | null = null;
    if (/\bday\s+after(?:\s+tomorrow)?\b/.test(text)) {
      offset = 2;
    } else if (/\btomorrow\b/.test(text)) {
      offset = 1;
    } else if (/\b(?:today|tonight)\b/.test(text)) {
      offset = 0;
    }
    if (offset == null) {
      return;
    }
    const basis = this.asDate(this.detail?.receivedUtc)
      || this.asDate(this.detail?.request?.requestDate)
      || new Date();
    const pickup = new Date(basis.getFullYear(), basis.getMonth(), basis.getDate() + offset);
    const existingTime = this.toTimeInput(this.captured.pickupTime);
    if (existingTime) {
      const [hh, mm] = existingTime.split(':');
      pickup.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
    }
    this.captured.pickupDate = this.toDateInput(pickup);
    this.advanceTableForm.patchValue({
      pickupDateTime: pickup,
      dropOffDateTime: this.advanceTableForm.value.dropOffDateTime || pickup
    });
    if (this.leftCapture && !this.hasDisplayValue(this.leftCapture.pickupDate)) {
      this.leftCapture.pickupDate = this.toDateInput(pickup);
    }
  }

  InitReservationSource(): void {
    this.generalService.GetReservationSource().subscribe((data) => {
      const list = (data || []) as ReservationSourceDropDown[];
      const match = this.exactMatch(list, (row) => row.reservationSource, 'Email Booking AI')
        || list.find((row) => (row.reservationSource || '').toLowerCase().includes('email booking'));
      if (match) {
        this.advanceTableForm.patchValue({
          reservationSourceID: match.reservationSourceID,
          reservationSource: match.reservationSource
        });
      }
    });
  }

  onPickupDateChange(): void {
    const customerID = Number(this.advanceTableForm.value.customerID || 0);
    if (!customerID) {
      return;
    }
    const pickupDate = this.contractDateString();
    this.generalService.GetContractIDBasedOnDate(customerID, pickupDate).subscribe((data) => {
      if (data) {
        this.contractID = data;
        this.InitPackageType();
      }
    });
  }

  private resolveContract(): void {
    this.onPickupDateChange();
  }

  InitPackageType(): void {
    this.generalService.getPackageTypeByContractID(this.contractID).subscribe((data) => {
      this.PackageTypeList = data || [];
      this.filteredPackageTypeOptions = this.advanceTableForm.controls.packageType.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPackageType(value || ''))
      );
      this.tryExactDutyType();
      this.InitPaymentMode();
    });
  }

  InitPaymentMode(): void {
    if (!this.contractID) {
      return;
    }
    this.generalService.GetModeOfPaymentByContract(this.contractID).subscribe((data) => {
      const rows = data || [];
      if (rows.length > 0) {
        this.bindPaymentModes(rows);
        return;
      }
      this.generalService.GetModeOfPayment().subscribe((all) => this.bindPaymentModes(all || []));
    });
  }

  private bindPaymentModes(rows: ModeOfPaymentDropDown[]): void {
    this.PaymentModeList = rows;
    this.filteredPaymentModeOptions = this.advanceTableForm.controls.modeOfPayment.valueChanges.pipe(
      startWith(this.advanceTableForm.value.modeOfPayment || ''),
      map((value) => this.filterByName(this.PaymentModeList, (row) => row.modeOfPayment, value || ''))
    );
    this.tryExactPaymentMode();
  }

  onMopSelected(value: string): void {
    const match = this.PaymentModeList.find(
      (row) => String(row.modeOfPayment || '').toLowerCase() === String(value || '').toLowerCase()
    );
    if (match) {
      this.getPaymentModeID(match.modeOfPaymentID, match.modeOfPayment);
    }
  }

  getPaymentModeID(modeOfPaymentID: any, modeOfPayment: string): void {
    this.advanceTableForm.patchValue({ modeOfPaymentID, modeOfPayment });
  }

  private tryExactPaymentMode(): void {
    const hint = this.hints.paymentMode || this.advanceTableForm.value.modeOfPayment;
    const match = this.exactMatch(this.PaymentModeList, (row) => row.modeOfPayment, hint);
    if (match) {
      this.getPaymentModeID(match.modeOfPaymentID, match.modeOfPayment);
    }
  }

  onMoreThanOneChange(): void {
    if (!this.advanceTableForm.value.moreThanOneReservation) {
      this.advanceTableForm.patchValue({ expectedReservationCount: null, sameGuest: false });
    }
  }

  private applyMultiSuggestion(): void {
    const created = Number(this.pick(this.detail, 'createdReservationCount') || 0);
    const expected = Number(this.pick(this.detail, 'expectedReservationCount') || 0);
    const savedMore = this.pick(this.detail, 'moreThanOneReservation');
    const savedSame = this.pick(this.detail, 'sameGuest');
    this.createdReservationCount = created;
    this.expectedReservationCount = expected;
    const more = savedMore === true || savedMore === 'true' || this.pick(this.detail, 'suggestedMoreThanOneReservation');
    const same = savedSame === true || savedSame === 'true' || this.pick(this.detail, 'suggestedSameGuest');
    const count = expected || Number(this.pick(this.detail, 'suggestedExpectedReservationCount') || 0);
    if (more) {
      this.advanceTableForm.patchValue({
        moreThanOneReservation: true,
        expectedReservationCount: count > 1 ? count : null,
        sameGuest: !!same
      });
    }
    const reason = this.pick(this.detail, 'suggestedMultiReason');
    this.multiHint = reason
      ? 'Suggested: ' + (more ? 'More than one' : 'Single') + (count > 1 ? ' (' + count + ')' : '')
        + (same ? ', same guest' : '') + ' — ' + reason
      : '';
  }

  private prepareNextReservation(created: number, expected: number, reservationId: number): void {
    this.createdReservationCount = created;
    this.expectedReservationCount = expected;
    this.saving = false;
    const sameGuest = !!this.advanceTableForm.value.sameGuest;
    this.advanceTableForm.patchValue({
      pickupDateTime: null,
      dropOffDateTime: null
    });
    if (!sameGuest) {
      this.selectedPassenger = null;
      this.advanceTableForm.patchValue({
        passengerName: '',
        passengerMobile: '',
        passengerEmail: '',
        primaryPassengerID: 0
      });
    }
    Swal.fire({
      title: '',
      text: 'Reservation ' + reservationId + ' created. Enter the next booking ('
        + created + ' of ' + expected + '). Left email stays the same.',
      icon: 'success'
    });
  }

  onDTSelected(selectedDTName: string): void {
    const selectedDT = this.PackageTypeList.find((data) => data.packageType === selectedDTName);
    if (selectedDT) {
      this.getPackageTypeID(selectedDT.packageTypeID, selectedDT.packageType);
    }
  }

  getPackageTypeID(packageTypeID: any, packageType: any): void {
    this.packageTypeID = packageTypeID;
    this.packageType = packageType;
    this.advanceTableForm.patchValue({
      packageTypeID,
      packageType,
      packageID: null,
      package: '',
      vehicleID: null,
      vehicle: '',
      vehicleCategoryID: null,
      vehicleCategory: '',
      carType: '',
      pickupCityID: null,
      pickupCity: ''
    });
    this.InitPackage();
  }

  onPackageTypeChanges(_event: any): void {}

  onTicketNumberInput(event: any): void {
    const input = String(event?.target?.value || '').replace(/[^0-9]/g, '');
    this.advanceTableForm.get('ticketNumber')?.setValue(input, { emitEvent: false });
  }

  private _filterPackageType(value: string): PackageTypeDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    return (this.PackageTypeList || []).filter((row) =>
      (row.packageType || '').toLowerCase().includes(filterValue)
    );
  }

  InitPackage(): void {
    this.generalService.GetPackagesForReservation(
      this.advanceTableForm.value.packageTypeID as any,
      this.advanceTableForm.value.packageType,
      this.contractID
    ).subscribe((data) => {
      this.PackageList = data || [];
      this.filteredPackageOptions = this.advanceTableForm.controls.package.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterPackage(value || ''))
      );
      this.tryExactPackage();
    });
  }

  private _filterPackage(value: string): PackageDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    return (this.PackageList || []).filter((row) =>
      (row.package || '').toLowerCase().includes(filterValue)
    );
  }

  onPackageSelected(selectedPackageName: string): void {
    const selectedPackage = this.PackageList.find((data) => data.package === selectedPackageName);
    if (selectedPackage) {
      this.getPackageID(selectedPackage.packageID);
    }
  }

  getPackageID(packageID: any): void {
    this.packageID = packageID;
    this.advanceTableForm.patchValue({
      packageID,
      vehicleID: null,
      vehicle: '',
      vehicleCategoryID: null,
      vehicleCategory: '',
      carType: '',
      pickupCityID: null,
      pickupCity: ''
    });
    this.InitCity(this.packageType);
    this.InitVehicle(this.packageType);
  }

  onPackageChanges(_event: any): void {}

  InitCity(packageType: string): void {
    const loader = this.cityLoader(packageType);
    if (!loader || !this.contractID) {
      return;
    }
    loader.subscribe((data) => {
      this.CityList = (data || []) as CitiesDropDown[];
      this.filteredCityOptions = this.advanceTableForm.controls.pickupCity.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCity(value || ''))
      );
      this.tryExactCity();
    });
  }

  private cityLoader(packageType: string) {
    const packageID = this.packageID || this.advanceTableForm.value.packageID;
    const loaders: Record<string, () => Observable<any>> = {
      'Local Rate': () => this.generalService.GetPickupAndDropOffCities(this.contractID, packageID),
      'Local Lumpsum Rate': () => this.generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID, packageID),
      'Local On Demand Rate': () => this.generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID, packageID),
      'Local Transfer Rate': () => this.generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID, packageID),
      'Long Term Rental Rate': () => this.generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID, packageID),
      'Outstation Lumpsum Rate': () => this.generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID, packageID),
      'Outstation OneWay Trip Rate': () => this.generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID, packageID),
      'Outstation Round Trip Rate': () => this.generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID, packageID)
    };
    return loaders[packageType]?.();
  }

  private _filterCity(value: string): CitiesDropDown[] {
    return this.filterByName(this.CityList, (row) => row.geoPointName, value);
  }

  onCitySelected(selectedCityName: string): void {
    const selectedCity = this.CityList.find((data) => data.geoPointName === selectedCityName);
    if (selectedCity) {
      this.getCityID(selectedCity.geoPointID);
    }
  }

  getCityID(cityID: any): void {
    this.pickupCityID = cityID;
    this.advanceTableForm.patchValue({ pickupCityID: cityID });
  }

  onPickupCityKeyUp(_event: any): void {}

  InitVehicle(packageType: string): void {
    const loader = this.vehicleLoader(packageType);
    if (!loader) {
      return;
    }
    loader.subscribe((data) => this.bindVehicles(data));
  }

  private vehicleLoader(packageType: string) {
    const packageID = this.packageID || this.advanceTableForm.value.packageID;
    if (!this.contractID) {
      return null;
    }
    const loaders: Record<string, () => Observable<VehicleVehicleCategoryDropDown[]>> = {
      'Local Rate': () => this.generalService.GetVehicleBasedOnContractID(this.contractID, packageID),
      'Local Lumpsum Rate': () => this.generalService.GetVehicleBasedOnContractIDForLocalLumpsum(this.contractID, packageID),
      'Local On Demand Rate': () => this.generalService.GetVehicleBasedOnContractIDForLocalOnDemand(this.contractID, packageID),
      'Local Transfer Rate': () => this.generalService.GetVehicleBasedOnContractIDForLocalTransfer(this.contractID, packageID),
      'Long Term Rental Rate': () => this.generalService.GetVehicleBasedOnContractIDForLongTermRental(this.contractID, packageID),
      'Outstation Lumpsum Rate': () => this.generalService.GetVehicleBasedOnContractIDForOutStationLumpsum(this.contractID, packageID),
      'Outstation OneWay Trip Rate': () => this.generalService.GetVehicleBasedOnContractIDForOutStationOneWayTrip(this.contractID, packageID),
      'Outstation Round Trip Rate': () => this.generalService.GetVehicleBasedOnContractIDForOutStationRoundTrip(this.contractID, packageID)
    };
    return loaders[packageType]?.();
  }

  private bindVehicles(data: VehicleVehicleCategoryDropDown[]): void {
    this.VehicleList = data || [];
    this.filteredVehicleOptions = this.advanceTableForm.controls.vehicle.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterVehicle(value || ''))
    );
    this.tryExactVehicle();
  }

  private _filterVehicle(value: string): VehicleVehicleCategoryDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    return (this.VehicleList || []).filter((row) =>
      (row.vehicle || '').toLowerCase().includes(filterValue)
    );
  }

  onCarSelected(selectedCarName: string): void {
    const selectedCar = this.VehicleList.find((data) => data.vehicle === selectedCarName);
    if (selectedCar) {
      this.getVehicleID(selectedCar.vehicleID, selectedCar.vehicleCategoryID, selectedCar.vehicleCategory);
    }
  }

  getVehicleID(vehicleID: any, vehicleCategoryID: any, vehicleCategory?: string): void {
    this.vehicleID = vehicleID;
    this.vehicleCategoryID = vehicleCategoryID;
    this.advanceTableForm.patchValue({ vehicleID, vehicleCategoryID });
    if (vehicleCategory) {
      this.advanceTableForm.patchValue({ carType: vehicleCategory, vehicleCategory });
    }
  }

  InitGoogleAddress(): void {
    this.generalService.getGoogleAddress().subscribe((data) => {
      this.GoogleAddressList = data || [];
      this.filteredGoogleAddressOptions = this.advanceTableForm.controls.pickupAddress.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterGoogle(this.GoogleAddressList, value || ''))
      );
      this.tryExactPickupAddress();
    });
  }

  InitDropOffGoogleAddress(): void {
    this.generalService.getGoogleAddress().subscribe((data) => {
      this.DropOffGoogleAddressList = data || [];
      this.filteredDropOffGoogleAddressOptions = this.advanceTableForm.controls.dropOffAddress.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterGoogle(this.DropOffGoogleAddressList, value || ''))
      );
      this.tryExactDropoffAddress();
    });
  }

  onPGLSelected(selectedPGLName: string): void {
    const selectedPGL = this.GoogleAddressList.find((data) => data.geoSearchString === selectedPGLName);
    if (selectedPGL) {
      this.OnPickupGeoLocationClick(selectedPGL);
    }
  }

  OnPickupGeoLocationClick(option: any): void {
    const coords = this.parseGeo(option?.geoLocation);
    if (!coords) {
      return;
    }
    this.advanceTableForm.patchValue({
      pickupAddressLatitude: coords.lat,
      pickupAddressLongitude: coords.lng
    });
  }

  onDropGLSelected(selectedDGLName: string): void {
    const selectedDGL = this.DropOffGoogleAddressList.find((data) => data.geoSearchString === selectedDGLName);
    if (selectedDGL) {
      this.OnDropOffGeoLocationClick(selectedDGL);
    }
  }

  OnDropOffGeoLocationClick(option: any): void {
    const coords = this.parseGeo(option?.geoLocation);
    if (!coords) {
      return;
    }
    this.advanceTableForm.patchValue({
      dropOffAddressLatitude: coords.lat,
      dropOffAddressLongitude: coords.lng
    });
  }

  valueSwitch(): void {
    const checked = this.advanceTableForm.value.googleAddresses === true;
    this.ifBlock = !checked;
    this.advanceTableForm.controls.pickupAddress.setValue('');
  }

  dropOffControlSwitch(): void {
    const checked = this.advanceTableForm.value.googleAdressesDropOff === true;
    this.dropOffifBlock = !checked;
    this.advanceTableForm.controls.dropOffAddress.setValue('');
  }

  handleAddressChange(address: any): void {
    const formatted = address?.formatted_address;
    this.advanceTableForm.patchValue({ pickupAddress: formatted });
    this.googlePlacesForm.patchValue({
      geoPointID: -1,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
      geoSearchString: formatted,
      geoPointName: 'Google Address',
      googlePlacesID: address.place_id,
      activationStatus: true,
      geoLocation: address.geometry.location.lat() + ',' + address.geometry.location.lng()
    });
    this.reservationService.addGoogleAddress(this.googlePlacesForm.value as any).subscribe();
  }

  handleAddressChangeDropOff(address: any): void {
    this.advanceTableForm.patchValue({ dropOffAddress: address?.formatted_address });
  }

  InitServiceLocation(): void {
    this.generalService.GetLocation().subscribe((data) => {
      this.ServiceLocationList = data || [];
      this.filteredServiceLocationOptions = this.advanceTableForm.controls.serviceLocation.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterServiceLocation(value || ''))
      );
      this.tryExactServiceLocation();
    });
  }

  private _filterServiceLocation(value: string): OrganizationalEntityDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    return (this.ServiceLocationList || []).filter((row) =>
      (row.organizationalEntityName || '').toLowerCase().includes(filterValue)
    );
  }

  onSLSelected(selectedSLName: string): void {
    const selectedSL = this.ServiceLocationList.find((data) => data.organizationalEntityName === selectedSLName);
    if (selectedSL) {
      this.getServiceLocationID(selectedSL.organizationalEntityID);
    }
  }

  getServiceLocationID(serviceLocationID: any): void {
    this.serviceLocationID = serviceLocationID;
    this.advanceTableForm.patchValue({ serviceLocationID });
  }

  displayOrDash(value: any): string {
    return this.hasDisplayValue(value) ? String(value) : '--';
  }

  hasDisplayValue(value: any): boolean {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  formatDateTime(dateValue: any, timeValue: any): string {
    const datePart = this.toDisplayDate(dateValue);
    const timePart = this.toTimeInput(timeValue);
    if (!datePart && !timePart) {
      return '--';
    }
    return [datePart, timePart].filter(Boolean).join(', ');
  }

  get hasSourceEmail(): boolean {
    return !!(this.detail?.textBody || this.formattedSourceHtml || this.sourceAttachments.length);
  }

  get sourceAttachments(): EmailBookingAttachmentItem[] {
    return this.detail?.attachments || [];
  }

  get hasFormattedSourceEmail(): boolean {
    return !!this.formattedSourceHtml;
  }

  get formattedSourceHtml(): string {
    const html = String(this.detail?.htmlBody || '').trim();
    if (this.looksLikeHtml(html)) {
      return html;
    }
    return '';
  }

  get sourceEmailPlain(): string {
    const text = String(this.detail?.textBody || '').trim();
    if (text) {
      return text;
    }
    return this.stripHtmlToText(this.formattedSourceHtml);
  }

  setSourceEmailView(view: 'formatted' | 'plain'): void {
    this.sourceEmailView = view;
  }

  downloadSourceAttachment(item: EmailBookingAttachmentItem): void {
    const attachmentId = Number(item?.emailBookingAttachmentId || 0);
    if (!this.bookingId || !attachmentId) {
      return;
    }
    this.service.downloadAttachment(this.bookingId, attachmentId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.fileName || 'attachment';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      () => this.snackBar.open('Could not download the attachment.', '', { duration: 3000 })
    );
  }

  formatByteLength(bytes: number): string {
    const size = Number(bytes || 0);
    if (size <= 0) {
      return '';
    }
    if (size < 1024) {
      return size + ' B';
    }
    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    }
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  private plainEmailBody(value: any): string {
    const text = String(value || '').trim();
    if (!text || this.looksLikeHtml(text)) {
      return '';
    }
    return text;
  }

  private looksLikeHtml(value: string): boolean {
    if (!value || value.indexOf('<') < 0 || value.indexOf('>') < 0) {
      return false;
    }
    return /<(?:html|body|table|thead|tbody|tr|td|th|div|p|br|span)\b/i.test(value);
  }

  private stripHtmlToText(html: string): string {
    if (!html) {
      return '';
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body?.textContent || '').replace(/\u00a0/g, ' ').trim();
  }

  private sanitizeEmailHtml(html: string): string {
    const cidMap = this.inlineCidDataUrls();
    const doc = new DOMParser().parseFromString(html || '', 'text/html');
    doc.querySelectorAll('img').forEach((img) => {
      const raw = String(img.getAttribute('src') || '').trim();
      const cid = this.cidFromSrc(raw);
      const dataUrl = cid ? cidMap[cid] : '';
      if (dataUrl) {
        img.setAttribute('src', dataUrl);
        return;
      }
      if (!/^data:image\//i.test(raw)) {
        img.remove();
      }
    });
    const banned = ['script', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base', 'svg', 'video', 'audio', 'source', 'style'];
    banned.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => el.remove());
    });
    doc.querySelectorAll('*').forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '');
        if (name.startsWith('on') || name === 'srcset' || name === 'xlink:href') {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === 'src' && el.tagName !== 'IMG') {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === 'src' && el.tagName === 'IMG' && !/^data:image\//i.test(value)) {
          el.removeAttribute(attr.name);
          return;
        }
        if ((name === 'href' || name === 'action') && /^\s*javascript:/i.test(value)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body?.innerHTML || '';
  }

  private inlineCidDataUrls(): { [cid: string]: string } {
    const map: { [cid: string]: string } = {};
    for (const item of this.sourceAttachments) {
      const cid = String(item?.contentId || '').trim().replace(/^<|>$/g, '').toLowerCase();
      const type = String(item?.contentType || '');
      const data = String(item?.contentBase64 || '');
      if (!cid || !data || !/^image\//i.test(type)) {
        continue;
      }
      map[cid] = 'data:' + type + ';base64,' + data;
    }
    return map;
  }

  private cidFromSrc(src: string): string {
    const value = String(src || '').trim();
    const match = value.match(/^cid:(.+)$/i);
    return match ? String(match[1] || '').replace(/^<|>$/g, '').trim().toLowerCase() : '';
  }

  private buildSourceEmailSrcdoc(html: string): string {
    const body = this.sanitizeEmailHtml(html);
    const styles = [
      'body{margin:8px;font:12px/1.45 system-ui,Segoe UI,sans-serif;color:#37474f;user-select:text;background:#fff}',
      'table{border-collapse:collapse;max-width:100%;margin:8px 0}',
      'td,th{border:1px solid #cfd8dc;padding:4px 8px;text-align:left;vertical-align:top}',
      'th{font-weight:600;background:#f5f7f9}',
      'a{color:#1565c0}'
    ].join('');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${styles}</style></head><body>${body}</body></html>`;
  }

  private normalizeDetail(raw: any): EmailBookingRequestDetail {
    const request = raw?.request ?? raw?.Request ?? {};
    const ai = raw?.aiCapture ?? raw?.AiCapture ?? {};
    const rows = raw?.compareRows ?? raw?.CompareRows ?? [];
    return {
      request: {
        emailBookingRequestId: Number(
          this.pick(request, 'emailBookingRequestId', 'EmailBookingRequestID') || this.bookingId
        ),
        emailBookingRequestGroupId: Number(this.pick(request, 'emailBookingRequestGroupId') || 0),
        customerTravelRequestNumber: this.pick(request, 'customerTravelRequestNumber'),
        customerName: this.pick(request, 'customerName'),
        requestDate: this.pick(request, 'requestDate'),
        requestTime: this.pick(request, 'requestTime'),
        pickupDate: this.pick(request, 'pickupDate'),
        pickupTime: this.pick(request, 'pickupTime'),
        requestStatus: this.pick(request, 'requestStatus'),
        reservationEmailAiId: this.pick(request, 'reservationEmailAiId', 'ReservationEmailAIID'),
        reservationId: this.pick(request, 'reservationId', 'ReservationID'),
        integrationRequestId: this.pick(request, 'integrationRequestId', 'IntegrationRequestID'),
        confidence: this.pick(request, 'confidence'),
        bookerName: this.pick(request, 'bookerName'),
        bookerMobile: this.pick(request, 'bookerMobile'),
        subject: this.pick(request, 'subject') || this.pick(raw, 'subject'),
        emailCategory: this.pick(request, 'emailCategory', 'EmailCategory')
      },
      aiCapture: {
        customerName: this.pick(ai, 'customerName'),
        customerTravelRequestNumber: this.pick(ai, 'customerTravelRequestNumber'),
        bookerName: this.pick(ai, 'bookerName'),
        bookerMobile: this.pick(ai, 'bookerMobile'),
        bookerEmail: this.pick(ai, 'bookerEmail'),
        passengerName: this.pick(ai, 'passengerName'),
        passengerMobile: this.pick(ai, 'passengerMobile'),
        passengerEmail: this.pick(ai, 'passengerEmail'),
        packageType: this.pick(ai, 'packageType'),
        package: this.pick(ai, 'package'),
        vehicleCategory: this.pick(ai, 'vehicleCategory'),
        vehicle: this.pick(ai, 'vehicle'),
        pickupCity: this.pick(ai, 'pickupCity'),
        pickupAddress: this.pick(ai, 'pickupAddress'),
        pickupDate: this.pick(ai, 'pickupDate'),
        pickupTime: this.pick(ai, 'pickupTime'),
        dropoffCity: this.pick(ai, 'dropoffCity'),
        dropoffAddress: this.pick(ai, 'dropoffAddress'),
        dropoffDate: this.pick(ai, 'dropoffDate'),
        dropoffTime: this.pick(ai, 'dropoffTime'),
        ticketNumber: this.pick(ai, 'ticketNumber'),
        specialRequest: this.pick(ai, 'specialRequest'),
        confidence: this.pick(ai, 'confidence')
      },
      aiCapturedJson: this.pick(raw, 'aiCapturedJson'),
      confirmedJson: this.pick(raw, 'confirmedJson'),
      subject: this.pick(raw, 'subject'),
      fromAddress: this.pick(raw, 'fromAddress'),
      textBody: this.plainEmailBody(this.pick(raw, 'textBody')),
      htmlBody: this.pick(raw, 'htmlBody')
        || (this.looksLikeHtml(String(this.pick(raw, 'textBody') || '')) ? this.pick(raw, 'textBody') : undefined),
      receivedUtc: this.pick(raw, 'receivedUtc', 'ReceivedUtc'),
      emailCategory: this.pick(raw, 'emailCategory', 'EmailCategory')
        || this.pick(request, 'emailCategory', 'EmailCategory'),
      suggestedEmailCategory: this.pick(raw, 'suggestedEmailCategory', 'SuggestedEmailCategory'),
      suggestedEmailCategoryReason: this.pick(raw, 'suggestedEmailCategoryReason', 'SuggestedEmailCategoryReason'),
      compareRows: (Array.isArray(rows) ? rows : []).map((row: any) => ({
        field: this.pick(row, 'field'),
        aiValue: this.pick(row, 'aiValue'),
        historicalValue: this.pick(row, 'historicalValue'),
        confirmedValue: this.pick(row, 'confirmedValue')
      })),
      matchedHistoricalReservationId: this.pick(raw, 'matchedHistoricalReservationId'),
      reservationEmailAiId: this.pick(raw, 'reservationEmailAiId', 'ReservationEmailAIID'),
      reservationId: this.pick(raw, 'reservationId', 'ReservationID'),
      requestDetailsEmailEnabled: !!(this.pick(raw, 'requestDetailsEmailEnabled') ?? raw?.RequestDetailsEmailEnabled),
      correspondence: this.normalizeCorrespondence(raw?.correspondence ?? raw?.Correspondence),
      attachments: this.normalizeAttachments(raw?.attachments ?? raw?.Attachments)
    };
  }

  private normalizeAttachments(rows: any): EmailBookingAttachmentItem[] {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((row) => ({
      emailBookingAttachmentId: Number(this.pick(row, 'emailBookingAttachmentId') || 0),
      fileName: this.pick(row, 'fileName') || 'attachment',
      contentType: this.pick(row, 'contentType'),
      contentId: this.pick(row, 'contentId'),
      isInline: !!(this.pick(row, 'isInline') ?? row?.IsInline),
      byteLength: Number(this.pick(row, 'byteLength') || 0),
      contentBase64: this.pick(row, 'contentBase64')
    }));
  }

  private normalizeCorrespondence(rows: any): EmailBookingCorrespondenceItem[] {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((row) => ({
      emailBookingCorrespondenceId: Number(this.pick(row, 'emailBookingCorrespondenceId') || 0),
      direction: this.pick(row, 'direction'),
      fromAddress: this.pick(row, 'fromAddress'),
      toAddress: this.pick(row, 'toAddress'),
      subject: this.pick(row, 'subject'),
      sentUtc: this.pick(row, 'sentUtc'),
      textBody: this.pick(row, 'textBody'),
      sentByUserID: this.pick(row, 'sentByUserID')
    }));
  }

  private pick(obj: any, ...keys: string[]): any {
    if (!obj) {
      return undefined;
    }
    const expanded: string[] = [];
    for (const key of keys) {
      expanded.push(key);
      if (key && key.charAt(0) === key.charAt(0).toLowerCase()) {
        expanded.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }
    for (const key of expanded) {
      const value = obj[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return undefined;
  }

  private contractDateString(): string {
    if (this.captured.pickupDate) {
      return this.captured.pickupDate;
    }
    const pickup = this.asDate(this.advanceTableForm.value.pickupDateTime);
    if (pickup) {
      return this.toDateInput(pickup);
    }
    return this.toDateInput(new Date());
  }

  private combineDateTime(dateValue: any, timeValue: any): Date | null {
    const datePart = this.toDateInput(dateValue);
    const timePart = this.toTimeInput(timeValue) || '00:00';
    if (!datePart) {
      return null;
    }
    const combined = new Date(`${datePart}T${timePart}`);
    return Number.isNaN(combined.getTime()) ? null : combined;
  }

  private asDate(value: any): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private toDisplayDate(value: any): string {
    const iso = this.toDateInput(value);
    if (!iso) {
      return '';
    }
    const [y, m, d] = iso.split('-');
    return y && m && d ? `${d}/${m}/${y}` : iso;
  }

  private toDateInput(value: any): string {
    if (!value) {
      return '';
    }
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
      return String(value).substring(0, 10);
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private digitsMobile(value: any): string {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.substring(2);
    }
    return digits.length > 10 ? digits.slice(-10) : digits;
  }

  private emailDomain(email: string): string {
    const at = String(email || '').lastIndexOf('@');
    return at < 0 ? '' : String(email).slice(at + 1).trim().toLowerCase();
  }

  private companyTokenFromDomain(domain: string): string {
    const parts = domain.split('.').filter(Boolean);
    if (parts.length < 2) {
      return '';
    }
    const slds = ['co', 'com', 'net', 'org', 'gov', 'ac'];
    if (parts.length >= 3 && slds.includes(parts[parts.length - 2])) {
      return parts[parts.length - 3];
    }
    return parts[parts.length - 2];
  }

  private isPublicMailDomain(domain: string): boolean {
    return [
      'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com',
      'outlook.com', 'live.com', 'msn.com', 'rediffmail.com', 'icloud.com',
      'aol.com', 'proton.me', 'protonmail.com'
    ].includes(domain);
  }

  private emailSearchText(): string {
    return [
      this.detail?.textBody,
      this.detail?.subject,
      this.leftCapture?.customerName
    ].filter((part) => this.hasDisplayValue(part)).join('\n').toLowerCase();
  }

  private isPersonNameInEmail(name: string): boolean {
    const needle = String(name || '').trim().toLowerCase();
    if (!needle) {
      return false;
    }
    const people = [
      this.leftCapture?.passengerName,
      this.leftCapture?.bookerName,
      this.captured?.passengerName,
      this.captured?.bookerName
    ];
    return people.some((person) => String(person || '').trim().toLowerCase() === needle);
  }

  private matchCustomerFromBody(): CustomerDropDown | null {
    const body = this.emailSearchText();
    if (!body || !this.CustomerList?.length) {
      return null;
    }

    let best: CustomerDropDown | null = null;
    let bestScore = 0;
    for (const row of this.CustomerList) {
      const name = String(row.customerName || '').trim();
      if (name.length < 6 || this.isPersonNameInEmail(name)) {
        continue;
      }
      const needle = name.toLowerCase();
      if (body.includes(needle) && name.length > bestScore) {
        best = row;
        bestScore = name.length;
      }
    }
    return best;
  }

  private matchCustomerByFromDomain(): CustomerDropDown | null {
    const sender = this.parseSender(this.detail?.fromAddress);
    const domain = this.emailDomain(sender.email);
    if (!domain || this.isPublicMailDomain(domain)) {
      return null;
    }
    const token = this.companyTokenFromDomain(domain);
    if (!token || token.length < 2) {
      return null;
    }
    const matches = (this.CustomerList || []).filter((row) => {
      const name = String(row.customerName || '').toLowerCase();
      const compact = name.replace(/[^a-z0-9]/g, '');
      return name.includes(token) || compact.includes(token);
    });
    if (!matches.length) {
      return null;
    }
    return matches.find((row) => String(row.customerName || '').toLowerCase().startsWith(token))
      || matches[0];
  }

  private parseSender(fromAddress: any): { name: string; email: string } {
    const text = String(fromAddress || '').trim();
    if (!text) {
      return { name: '', email: '' };
    }
    const emailMatch = text.match(/<([^>]+)>/);
    const email = emailMatch
      ? emailMatch[1].trim()
      : (text.includes('@') ? text.replace(/"/g, '').trim() : '');
    let name = emailMatch ? text.slice(0, text.indexOf('<')).trim() : (email ? '' : text);
    name = name.replace(/^"|"$/g, '').trim();
    if (name.includes(',')) {
      const parts = name.split(',').map((part) => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        name = `${parts[1]} ${parts[0]}`.trim();
      }
    }
    return { name, email };
  }

  private phoneFromText(value: any): string {
    const match = String(value || '').match(/(?:\+91[\s-]*)?([6-9]\d{9})/);
    return match ? match[1] : '';
  }

  private toTimeInput(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
    }
    if (typeof value === 'object') {
      const hours = value.hours ?? value.Hours;
      const minutes = value.minutes ?? value.Minutes;
      if (hours != null) {
        return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
      }
    }
    const text = String(value);
    const match = text.match(/(\d{1,2}:\d{2})/);
    return match ? match[1] : text.substring(0, 5);
  }

  private filterByName<T>(list: T[], getter: (row: T) => string, value: string): T[] {
    const filterValue = String(value || '').toLowerCase();
    return (list || []).filter((row) => (getter(row) || '').toLowerCase().includes(filterValue));
  }

  private filterGoogle(list: GoogleAddressDropDown[], value: string): GoogleAddressDropDown[] {
    const filterValue = String(value || '').toLowerCase();
    if (!filterValue) {
      return [];
    }
    return (list || []).filter((row) => (row.geoSearchString || '').toLowerCase().includes(filterValue));
  }

  private exactMatch<T>(list: T[], getter: (row: T) => string, hint?: string): T | null {
    const needle = String(hint || '').trim().toLowerCase();
    if (!needle || !list?.length) {
      return null;
    }
    return list.find((row) => String(getter(row) || '').trim().toLowerCase() === needle) || null;
  }

  private tryExactDutyType(): void {
    const match = this.exactMatch(this.PackageTypeList, (row) => row.packageType, this.hints.packageType);
    if (match && !this.advanceTableForm.value.packageTypeID) {
      this.getPackageTypeID(match.packageTypeID, match.packageType);
    }
  }

  private tryExactPackage(): void {
    const match = this.exactMatch(this.PackageList, (row) => row.package, this.hints.package);
    if (match && !this.advanceTableForm.value.packageID) {
      this.advanceTableForm.patchValue({ package: match.package });
      this.getPackageID(match.packageID);
    }
  }

  private tryExactCity(): void {
    const match = this.exactMatch(this.CityList, (row) => row.geoPointName, this.hints.city);
    if (match && !this.advanceTableForm.value.pickupCityID) {
      this.advanceTableForm.patchValue({ pickupCity: match.geoPointName });
      this.getCityID(match.geoPointID);
    }
  }

  private tryExactVehicle(): void {
    const match = this.exactMatch(this.VehicleList, (row) => row.vehicle, this.hints.vehicle);
    if (match && !this.advanceTableForm.value.vehicleID) {
      this.advanceTableForm.patchValue({ vehicle: match.vehicle });
      this.getVehicleID(match.vehicleID, match.vehicleCategoryID, match.vehicleCategory);
    }
  }

  private tryExactServiceLocation(): void {
    const match = this.exactMatch(
      this.ServiceLocationList,
      (row) => row.organizationalEntityName,
      this.hints.serviceLocation
    );
    if (match && !this.advanceTableForm.value.serviceLocationID) {
      this.advanceTableForm.patchValue({ serviceLocation: match.organizationalEntityName });
      this.getServiceLocationID(match.organizationalEntityID);
    }
  }

  private tryExactRequestType(): void {
    const match = this.requestTypes.find(
      (row) => row.toLowerCase() === String(this.hints.requestType || '').trim().toLowerCase()
    );
    if (match && !this.advanceTableForm.value.requestType) {
      this.advanceTableForm.patchValue({ requestType: match });
    }
  }

  private tryExactPickupAddress(): void {
    const match = this.exactMatch(this.GoogleAddressList, (row) => row.geoSearchString, this.hints.pickupAddress);
    if (match) {
      this.advanceTableForm.patchValue({ pickupAddress: match.geoSearchString });
      this.OnPickupGeoLocationClick(match);
    }
  }

  private tryExactDropoffAddress(): void {
    const match = this.exactMatch(
      this.DropOffGoogleAddressList,
      (row) => row.geoSearchString,
      this.hints.dropoffAddress
    );
    if (match) {
      this.advanceTableForm.patchValue({ dropOffAddress: match.geoSearchString });
      this.OnDropOffGeoLocationClick(match);
    }
  }

  private filterCustomers(value: string): CustomerDropDown[] {
    const raw = String(value || '').toLowerCase();
    const filterValue = getCustomerNameFromAutocomplete(value).toLowerCase();
    return (this.CustomerList || []).filter((data) => {
      const name = (data.customerName || '').toLowerCase();
      const tally = getCustomerTallyId(data).toLowerCase();
      const customerId = getCustomerIdValue(data).toLowerCase();
      const label = getCustomerDisplayLabel(data).toLowerCase();
      return name.includes(filterValue)
        || name.includes(raw)
        || tally.includes(raw)
        || customerId.includes(raw)
        || label.includes(raw);
    });
  }

  private formatBookingDateString(value: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[value.getMonth()]} ${String(value.getDate()).padStart(2, '0')} ${value.getFullYear()}`;
  }

  navigateToControlPanel(reservationID?: number): void {
    const queryParams = reservationID
      ? { reservationID: this.generalService.encrypt(String(reservationID)) }
      : undefined;
    this.router.navigate(['/controlPanelDesign'], { queryParams });
    Swal.close();
  }

  private parseGeo(geoLocation: string): { lat: string; lng: string } | null {
    if (!geoLocation) {
      return null;
    }
    const value = geoLocation.replace('(', '').replace(')', '');
    const parts = value.trim().split(/\s+/);
    if (parts.length < 2) {
      const comma = value.split(',');
      if (comma.length >= 2) {
        return { lat: comma[0].trim(), lng: comma[1].trim() };
      }
      return null;
    }
    return { lat: parts[2] || parts[0], lng: parts[1] || parts[0] };
  }

  private readContractId(data: any): any {
    if (data == null) {
      return 0;
    }
    if (typeof data === 'number' || typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      return this.readContractId(data[0]);
    }
    return data.contractID ?? data.customerContractID ?? data.ContractID ?? 0;
  }
}
