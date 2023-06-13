import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(value: any[], key: string): any[] {
    const groups: { [key: string]: any[] } = {};
    for (const item of value) {
      const groupKey: string = item[key];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    }


      return Object.keys(groups).map(groupKey => ({
      key: groupKey,
      values: groups[groupKey]
    }));
  }
}
