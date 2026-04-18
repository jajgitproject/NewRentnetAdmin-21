// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreditNoteHistoryComponent } from './creditnotehistory.component';
import { CreditNoteHistoryService } from './creditnotehistory.service';
import { GeneralService } from '../general/general.service';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';

describe('CreditNoteHistoryComponent', () => {
  let component: CreditNoteHistoryComponent;
  let fixture: ComponentFixture<CreditNoteHistoryComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CreditNoteHistoryComponent>>;
  let mockCreditNoteHistoryService: jasmine.SpyObj<CreditNoteHistoryService>;

  const mockData = {
    creditNoteID: 123
  };

  const mockHistoryData = [
    {
      creditNoteHistoryID: 1,
      creditNoteID: 123,
      lifeCycleStatus: 'DRAFT',
      action: 'Created',
      actionDate: '2025-09-01T10:00:00',
      userID: 1,
      userName: 'John Doe',
      comments: 'Initial creation',
      previousStatus: '',
      newStatus: 'DRAFT'
    },
    {
      creditNoteHistoryID: 2,
      creditNoteID: 123,
      lifeCycleStatus: 'APPROVED',
      action: 'Status Changed',
      actionDate: '2025-09-01T14:00:00',
      userID: 2,
      userName: 'Jane Smith',
      comments: 'Approved after review',
      previousStatus: 'PENDING_APPROVAL',
      newStatus: 'APPROVED'
    }
  ];

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const creditNoteHistoryServiceSpy = jasmine.createSpyObj('CreditNoteHistoryService', [
      'getCreditNoteHistory',
      'getCreditNoteHistoryByLifeCycleStatus',
      'getLifeCycleStatuses'
    ]);
    const generalServiceSpy = jasmine.createSpyObj('GeneralService', [], {
      BaseURL: 'http://localhost:3000/api/'
    });

    await TestBed.configureTestingModule({
      declarations: [CreditNoteHistoryComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSortModule
      ],
      providers: [...matDialogTestProviders(), 
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: CreditNoteHistoryService, useValue: creditNoteHistoryServiceSpy },
        { provide: GeneralService, useValue: generalServiceSpy }
      ]
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreditNoteHistoryComponent>>;
    mockCreditNoteHistoryService = TestBed.inject(CreditNoteHistoryService) as jasmine.SpyObj<CreditNoteHistoryService>;

    // Setup service mocks
    mockCreditNoteHistoryService.getCreditNoteHistory.and.returnValue(of(mockHistoryData));
    mockCreditNoteHistoryService.getLifeCycleStatuses.and.returnValue(of(['DRAFT', 'APPROVED', 'REJECTED']));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct creditNoteID', () => {
    expect(component.creditNoteID).toBe(123);
  });

  it('should load credit note history on init', () => {
    expect(mockCreditNoteHistoryService.getCreditNoteHistory).toHaveBeenCalledWith(123);
    expect(component.creditNoteHistoryDataSource.length).toBe(2);
  });

  it('should filter by lifecycle status', () => {
    component.selectedLifeCycleStatus = 'APPROVED';
    mockCreditNoteHistoryService.getCreditNoteHistoryByLifeCycleStatus.and.returnValue(
      of([mockHistoryData[1]])
    );
    
    component.onLifeCycleStatusChange();
    
    expect(mockCreditNoteHistoryService.getCreditNoteHistoryByLifeCycleStatus)
      .toHaveBeenCalledWith(123, 'APPROVED');
  });

  it('should return correct status badge class', () => {
    expect(component.getStatusBadgeClass('APPROVED')).toBe('badge-success');
    expect(component.getStatusBadgeClass('REJECTED')).toBe('badge-danger');
    expect(component.getStatusBadgeClass('DRAFT')).toBe('badge-secondary');
  });

  it('should close dialog when onNoClick is called', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});

