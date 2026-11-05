import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  isEmployeeExited,
  isEmployeeDropdownSelection,
} from './customer-employee-autocomplete';
import { filterEmployeesForAutocomplete } from './employee-dropdown-display.util';

/** Employee autocomplete for list-page search modals (min 3 chars, prefix API). */
export class EmployeePrefixSearchField {
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayEmployeeFn = createDisplayEmployeeFn();

  control = new FormControl<string | EmployeeDropDown>('');
  filteredOptions: Observable<EmployeeDropDown[]> = of([]);
  private employeeList: EmployeeDropDown[] = [];

  /** Passed to grid APIs as employee name filter. */
  apiSearchName = '';

  constructor(private readonly generalService: GeneralService) {}

  onKeyup(): void {
    const raw = this.control.value;
    const prefix =
      typeof raw === 'string'
        ? raw
        : isEmployeeDropdownSelection(raw)
          ? formatEmployeeDropdownLabel(raw)
          : '';
    if (prefix.length < 3) {
      this.employeeList = [];
      this.filteredOptions = of([]);
      if (!prefix.trim()) {
        this.apiSearchName = '';
      }
      return;
    }
    if (isEmployeeDropdownSelection(raw)) {
      return;
    }
    this.generalService.searchEmployeesByPrefix(prefix).subscribe((data) => {
      const current = this.control.value;
      const currentPrefix =
        typeof current === 'string'
          ? current
          : isEmployeeDropdownSelection(current)
            ? formatEmployeeDropdownLabel(current)
            : '';
      if (currentPrefix !== prefix) {
        return;
      }
      this.employeeList = data || [];
      this.filteredOptions = of(filterEmployeesForAutocomplete(this.employeeList, prefix));
    });
  }

  onSelected(employee: EmployeeDropDown): void {
    if (!isEmployeeDropdownSelection(employee)) {
      return;
    }
    this.control.setValue(employee, { emitEvent: false });
    this.apiSearchName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  }

  reset(): void {
    this.control.setValue('');
    this.apiSearchName = '';
    this.employeeList = [];
    this.filteredOptions = of([]);
  }
}
