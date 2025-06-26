import { Injectable } from '@angular/core';
declare const gtag: Function;

@Injectable()
export class GoogleEventService {
  uploadGoogleAnalytics(options: any) {
    // gtag(options?.event, options?.type);
    // console.log(options, (<any>window).dataLayer);
    // if (options && options.event && options.type)
    //   (<any>window).dataLayer.push({
    //     event: options.event,
    //     type: options.type,

    // subscription_id: options.subscription_id,
    //   });
    // (<any>window).dataLayer.push(() => {
    //   this.reset();
    // });
  }
}
