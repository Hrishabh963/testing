import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ASSIGN_TO_USER } from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class AssignToUserService {
  constructor(private readonly http: HttpClient) {}

  assignToUser(loanId: number = null, userId: string = ""): Observable<any> {
    const params = new HttpParams()
      .append("userId", userId)
      .append("loanApplicationId", loanId);
    return this.http.post(ASSIGN_TO_USER, "", {
      params,
      observe: "body",
      responseType: "text",
    });
  }
}
