import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapErrors',
  pure: true
})
export class MapErrorsPipe implements PipeTransform {

  transform(value: object,validatorsKeyValue: {key: string, value: string}[]): string[] {
    let descriptions :string[]=[];
    let keys=Object.keys(value);
    for(let item of keys){
      let des =validatorsKeyValue.find(x=>x.key == item)?.value
      if(des){
        descriptions.push(des)
      }
    }
    return descriptions;
  }

}
