import { Injectable } from '@angular/core';
import { LENDER_CONFIGURATIONS } from 'src/app/constants/lender.config';

export function initializeSubdomain(subdomainService: SubdomainService) {
  return () => {
    return subdomainService.getSubdomain();
  };
}
@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  private currentSubdomain: string;
  private lenderConfig: any;
  private lenderCode: string = 'KCPL'; 

  constructor() {
    this.detectSubdomain();
  }

  private detectSubdomain(): void {
    const hostname = window.location.hostname;
    const hostnameLower = hostname.toLowerCase();
    
    if (hostnameLower.includes('dcb') || hostnameLower.includes('dcbsetu')) {
      this.lenderCode = 'DCB';
    } else if (hostnameLower.startsWith('admin.')) {
      this.lenderCode = 'KCPL';
    } else {
      const parts = hostname.split('.');
      
      if (parts.length > 1) {
        const firstPart = parts[0].toLowerCase();
        
        if (firstPart.includes('dcb')) {
          this.lenderCode = 'DCB';
        } else if (firstPart.includes('kcpl')) {
          this.lenderCode = 'KCPL';
        }
      }
    }
    
    this.currentSubdomain = this.lenderCode.toLowerCase();
    
    this.lenderConfig = LENDER_CONFIGURATIONS[this.lenderCode] || LENDER_CONFIGURATIONS.KCPL;
  }

  public getSubdomain(): string {
    return this.currentSubdomain;
  }

  public getLenderCode(): string {
    return this.lenderCode;
  }

  public getLenderConfig(): any {
    return this.lenderConfig;
  }
}