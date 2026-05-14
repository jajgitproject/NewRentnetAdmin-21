// @ts-nocheck
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'filterData'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, requireAccess?: boolean): any[] {
    if (!items) return [];
    let list = items;
    if (requireAccess) {
      list = items.filter(
        (item) => item.groupTitle === true || item.isAccess === true
      );
    }
    if (!searchText) return list;

    return list.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}


