// field.interface.ts
export interface Field {
    label: string;
    value: any;
    propertyKey: string;
    isEditable: boolean;
    inputType: string;
    metadata?: {
      enableMasking?: boolean;
      displayFormat?: string;
    };
  }
  