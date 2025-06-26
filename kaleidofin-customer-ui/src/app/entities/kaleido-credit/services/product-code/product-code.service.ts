import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  GET_ALL_LOAN_PRODUCT_CODES,
  VALIDATE_PRODUCT_CODES,
} from "src/app/shared/constants/Api.constants";
import { LoanApplication } from "../../models/krediline/loan-application.model";

@Injectable({
  providedIn: "root",
})
export class ProductCodeService {
  constructor(private readonly http: HttpClient) {}

  getAllLoanProductCodes(loanId: any): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}${GET_ALL_LOAN_PRODUCT_CODES}/${loanId}`,
      { observe: "body" }
    );
  }

  validateProductCode(loanApplication: LoanApplication): Observable<any> {
    return this.http.post(
      `${KREDILINE_SERVER_URL}${VALIDATE_PRODUCT_CODES}`,
      loanApplication,
      { observe:'body' }
    );
  }
}
