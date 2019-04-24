import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domainUrl'
})
export class DomainUrlPipe implements PipeTransform {

  transform(url: any, args?: any): any {
    if (url && (url.indexOf("https") !== -1 || url.indexOf("http") !== -1)) {
      return url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    }
    return url;
  }

}
