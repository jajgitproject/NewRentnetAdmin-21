// @ts-nocheck
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CityDropDown } from 'src/app/city/cityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-searchable-city-dropdown',
  templateUrl: './searchable-city-dropdown.component.html',
  styleUrls: ['./searchable-city-dropdown.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableCityDropdownComponent),
      multi: true
    }
  ]
})
export class SearchableCityDropdownComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() cities: CityDropDown[] = [];
  @Input() label = 'City';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() multiple = false;
  @Input() remoteSearch = false;
  @Input() minSearchLength = 3;
  @Input() searchPlaceholder = 'Search city';
  /** When true, options appear only after the user types (local filter). */
  @Input() typeToFilter = false;
  @Input() minLocalFilterLength = 1;
  @Input() showAllOption = true;

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() panelOpened = new EventEmitter<void>();

  filterText = '';
  value: number | number[] | null = null;
  disabled = false;

  private onChange: (value: number | number[] | null) => void = () => {};
  private onTouched: () => void = () => {};
  private filterChanges = new Subject<string>();
  private filterSub?: Subscription;

  ngOnInit(): void {
    this.filterSub = this.filterChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      if (this.remoteSearch) {
        this.searchTermChange.emit(term);
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSub?.unsubscribe();
  }

  private normalizeCity(city: any): CityDropDown {
    return {
      geoPointID: Number(city?.geoPointID ?? city?.GeoPointID ?? -1),
      geoPointName: city?.geoPointName ?? city?.GeoPointName ?? ''
    };
  }

  get normalizedCities(): CityDropDown[] {
    return (this.cities || []).map((c) => this.normalizeCity(c)).filter((c) => c.geoPointID > 0 && c.geoPointName);
  }

  private getSelectedIds(): number[] {
    if (this.multiple) {
      const raw = Array.isArray(this.value) ? this.value : [];
      return raw.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
    }
    const single = Number(this.value);
    return Number.isFinite(single) && single > 0 ? [single] : [];
  }

  private mergeWithSelected(filtered: CityDropDown[], fullList: CityDropDown[]): CityDropDown[] {
    const map = new Map<number, CityDropDown>();
    filtered.forEach((city) => map.set(city.geoPointID, city));
    this.getSelectedIds().forEach((id) => {
      if (!map.has(id)) {
        const match = fullList.find((city) => city.geoPointID === id);
        if (match) {
          map.set(id, match);
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => (a.geoPointName || '').localeCompare(b.geoPointName || ''));
  }

  get filteredCities(): CityDropDown[] {
    const list = this.normalizedCities;
    const term = (this.filterText || '').trim().toLowerCase();
    if (this.remoteSearch) {
      return list;
    }
    if (this.typeToFilter && term.length < this.minLocalFilterLength) {
      return this.mergeWithSelected([], list);
    }
    if (!term) {
      return this.typeToFilter ? this.mergeWithSelected([], list) : list;
    }
    const matched = list.filter((c) => (c.geoPointName || '').toLowerCase().includes(term));
    return this.mergeWithSelected(matched, list);
  }

  get showTypeToSearchHint(): boolean {
    if (this.remoteSearch) {
      return (this.filterText || '').trim().length < this.minSearchLength;
    }
    return this.typeToFilter && (this.filterText || '').trim().length < this.minLocalFilterLength;
  }

  get showNoCityFound(): boolean {
    if (this.showTypeToSearchHint) {
      return false;
    }
    const term = (this.filterText || '').trim();
    if (this.typeToFilter && !this.remoteSearch && term.length >= this.minLocalFilterLength) {
      return this.filteredCities.length === 0;
    }
    return false;
  }

  onFilterTextInput(): void {
    if (this.remoteSearch) {
      this.filterChanges.next((this.filterText || '').trim());
    }
  }

  writeValue(value: any): void {
    if (this.multiple) {
      this.value = Array.isArray(value) ? value : value != null && value !== '' ? [Number(value)] : [];
    } else {
      this.value = value != null && value !== '' ? Number(value) : null;
    }
  }

  registerOnChange(fn: (value: number | number[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onPanelOpen(opened: boolean): void {
    if (opened) {
      this.panelOpened.emit();
    } else {
      this.filterText = '';
    }
  }

  onSelectionChange(): void {
    this.onChange(this.value);
    this.onTouched();
  }
}
