import { Injectable } from '@angular/core';

@Injectable()
export class CustomResource {
  model: any;
  constructor() {}
  IsJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  trimWhiteSpaces(model: any) {
    for (let value in model) {
      if (
        model[value] != null &&
        model[value] != undefined &&
        typeof model[value] == 'string'
      ) {
        model[value] = model[value].trim();
      }
    }
    return model;
  }
}
