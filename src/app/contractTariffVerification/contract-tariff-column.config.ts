// @ts-nocheck
export interface ColumnDef {
  field: string;
  header: string;
  tooltip?: string;
}

export interface DutyTypeTableConfig {
  packageTypeLabels: string[];
  rateColumns: ColumnDef[];
  fixedColumns?: ColumnDef[];
}

const utilitySuffix = [
  'auditorVerificationStatus',
  'verifierVerificationStatus',
  'remarks',
  'updatedBy',
  'updatedDate',
  'history',
];

export const LOCAL_RATE_VARIABLE_COLUMNS: ColumnDef[] = [
  { field: 'package', header: 'Package' },
  { field: 'customerContractCityTier', header: 'City Tier', tooltip: 'Hover for cities in tier' },
  { field: 'customerContractCarCategory', header: 'Car Category' },
  { field: 'minimumHours', header: 'Min HRs' },
  { field: 'minimumKM', header: 'Min KM' },
  { field: 'baseRate', header: 'Rate' },
  { field: 'extraHRRate', header: 'Extra HR Rate' },
  { field: 'nightCharge', header: 'Night Charge' },
  { field: 'extraKMRate', header: 'Extra KM Rate' },
  { field: 'driverAllowance', header: 'Driver Allowance' },
  { field: 'fgr', header: 'FGR' },
  { field: 'fgrCharges', header: 'FGR Charges' },
  { field: 'billFromTo', header: 'Bill From To' },
];

export const LOCAL_FIXED_COLUMNS: ColumnDef[] = [
  { field: 'billFromTo', header: 'Bill From To' },
  { field: 'packageGraceKms', header: 'Package Grace Kms' },
  { field: 'packageGraceMinutes', header: 'Package Grace Minutes' },
  { field: 'packageJumpCriteria', header: 'Package Jump' },
  { field: 'nextPackageSelectionCriteria', header: 'Next Package' },
  { field: 'addtionalKms', header: 'Additional Kms' },
  { field: 'addtionalMinutes', header: 'Additional Minutes' },
  { field: 'showAddtionKMAndHours', header: 'Show Additional KM And Hours' },
];

export const DUTY_TYPE_CONFIGS: DutyTypeTableConfig[] = [
  {
    packageTypeLabels: ['Local', 'Local Rate'],
    rateColumns: LOCAL_RATE_VARIABLE_COLUMNS,
    fixedColumns: LOCAL_FIXED_COLUMNS,
  },
  {
    packageTypeLabels: ['Local Lumpsum', 'Local Lumpsum Rate'],
    rateColumns: LOCAL_RATE_VARIABLE_COLUMNS,
  },
  {
    packageTypeLabels: ['Local Transfer', 'Local Transfer Rate'],
    rateColumns: [
      { field: 'package', header: 'Package' },
      { field: 'city', header: 'City' },
      { field: 'customerContractCarCategory', header: 'Car Category' },
      ...LOCAL_RATE_VARIABLE_COLUMNS.filter((c) =>
        ['minimumHours', 'minimumKM', 'baseRate', 'extraHRRate', 'nightCharge', 'extraKMRate', 'driverAllowance', 'fgr', 'fgrCharges', 'billFromTo'].includes(c.field)
      ),
    ],
  },
  {
    packageTypeLabels: ['Local On Demand', 'Local On Demand Rate'],
    rateColumns: LOCAL_RATE_VARIABLE_COLUMNS,
  },
  {
    packageTypeLabels: ['Long Term Rental', 'Long Term Rental Rate'],
    rateColumns: [
      { field: 'package', header: 'Package' },
      { field: 'customerContractCityTier', header: 'City Tier', tooltip: 'Hover for cities in tier' },
      { field: 'customerContractCarCategory', header: 'Car Category' },
      { field: 'monthlyHours', header: 'Monthly HRs' },
      { field: 'monthlyKMs', header: 'Monthly KMs' },
      { field: 'totalDaysBaseRate', header: 'Total Days Base Rate' },
      { field: 'extraHRRate', header: 'Extra HR Rate' },
      { field: 'extraKMRate', header: 'Extra KM Rate' },
      { field: 'nightCharge', header: 'Night Charge' },
      { field: 'driverAllowance', header: 'Driver Allowance' },
      { field: 'fgr', header: 'FGR' },
      { field: 'fgrCharges', header: 'FGR Charges' },
      { field: 'billFromTo', header: 'Bill From To' },
    ],
  },
  {
    packageTypeLabels: ['Outstation Lumpsum', 'Outstation Lumpsum Rate', 'Out Station Lumpsum Rate'],
    rateColumns: [
      { field: 'package', header: 'Package' },
      { field: 'customerContractCityTier', header: 'City Tier', tooltip: 'Hover for cities in tier' },
      { field: 'customerContractCarCategory', header: 'Car Category' },
      { field: 'minimumHours', header: 'Min HRs' },
      { field: 'minimumKM', header: 'Min KM' },
      { field: 'baseRate', header: 'Rate' },
      { field: 'extraKMRate', header: 'Extra KM Rate' },
      { field: 'nightCharge', header: 'Night Charge' },
      { field: 'driverAllowance', header: 'Driver Allowance' },
      { field: 'billFromTo', header: 'Bill From To' },
    ],
  },
  {
    packageTypeLabels: ['Outstation Round Trip', 'Outstation Round Trip Rate', 'Out Station Round Trip Rate'],
    rateColumns: [
      { field: 'package', header: 'Package' },
      { field: 'customerContractCityTier', header: 'City Tier', tooltip: 'Hover for cities in tier' },
      { field: 'customerContractCarCategory', header: 'Car Category' },
      { field: 'ratePerDay', header: 'Rate Per Day' },
      { field: 'minimumKmsPerDay', header: 'Min KMs/Day' },
      { field: 'extraKMRate', header: 'Extra KM Rate' },
      { field: 'nextDayCharging', header: 'Next Day Charging' },
      { field: 'nightCharge', header: 'Night Charge' },
      { field: 'driverAllowance', header: 'Driver Allowance' },
      { field: 'billFromTo', header: 'Bill From To' },
    ],
  },
  {
    packageTypeLabels: ['Outstation OneWay Trip', 'Outstation OneWay Trip Rate', 'Outstation One Way Trip Rate'],
    rateColumns: [
      { field: 'package', header: 'Package' },
      { field: 'customerContractCityTier', header: 'City Tier', tooltip: 'Hover for cities in tier' },
      { field: 'customerContractCarCategory', header: 'Car Category' },
      { field: 'additionalKM', header: 'Additional KM' },
      { field: 'minimumKM', header: 'Min KM' },
      { field: 'packageRate', header: 'Package Rate' },
      { field: 'baseRate', header: 'Base Rate' },
      { field: 'extraKMRate', header: 'Extra KM Rate' },
      { field: 'additionalMinutes', header: 'Additional Minutes' },
      { field: 'nightCharge', header: 'Night Charge' },
      { field: 'driverAllowance', header: 'Driver Allowance' },
      { field: 'billFromTo', header: 'Bill From To' },
    ],
  },
];

export function getConfigForPackageType(packageTypeName: string): DutyTypeTableConfig | null {
  if (!packageTypeName) return null;
  return (
    DUTY_TYPE_CONFIGS.find((c) =>
      c.packageTypeLabels.some((l) => l.toLowerCase() === packageTypeName.toLowerCase())
    ) || null
  );
}

export function buildDisplayedColumns(dynamicCols: ColumnDef[]): string[] {
  return ['select', ...dynamicCols.map((c) => c.field), ...utilitySuffix];
}
