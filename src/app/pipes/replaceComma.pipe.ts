import { Pipe, PipeTransform } from '@angular/core';
  
@Pipe({
    name: 'replaceComma'
})
export class ReplaceCommaPipe implements PipeTransform {
  transform(value: number): string {  
    return value.toString().replace(",", ".");
  }
}