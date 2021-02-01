import { Pipe, PipeTransform } from '@angular/core';
  
@Pipe({
    name: 'roundNum'
})
export class RoundNumPipe implements PipeTransform {
  transform(value: any, power: number): string {
    if (isNaN(value) || isNaN(power)) return "0,00";
    const result = (+value).toFixed(power).replace('.', ',');
    const out = result
      .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
      .split(' ')
      .join('.');
    return out;
  }
}