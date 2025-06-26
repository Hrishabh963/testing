import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GET_EMI_AMOUNTS } from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class EmiAmountService {
  constructor(private readonly http: HttpClient) {}

  getEmiAmounts(loanId: number): Observable<any> {
    return this.http.get(`${GET_EMI_AMOUNTS}${loanId}`);
  }
}
