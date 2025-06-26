import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KREDILINE_SERVER_URL } from "src/app/app.constants";
import {
  GET_ALL_ACTIVITY,
  POST_COMMENT,
} from "src/app/shared/constants/Api.constants";

@Injectable({
  providedIn: "root",
})
export class LoanActivityService {
  constructor(private readonly http: HttpClient) {}

  getActivityInformation(loanId: number = null, label: string = "") {
    const params = new HttpParams()
      .append("loanApplicationId", loanId)
      .append("label", label);
    return this.http.get(`${KREDILINE_SERVER_URL}${GET_ALL_ACTIVITY}`, {
      params,
    });
  }

  addComment(
    comment: string = "",
    filePreSignedUrlDto: any = null,
    loanId: number = null
  ) {
    const requestPayload = {
      comment,
      filePreSignedUrlDto,
    };
    const params = new HttpParams().append("loanApplicationId", loanId);

    return this.http.post(
      `${KREDILINE_SERVER_URL}${POST_COMMENT}`,
      requestPayload,
      { params }
    );
  }

  editComment(
    comment: string = "",
    commentId: number = null,
    loanId: number = null,
    page: number = null,
    size: number = null
  ) {
    const params = new HttpParams()
      .append("loanApplicationId", loanId)
      .append("loanCommentId", commentId)
      .append("comment", comment)
      .append("page", page)
      .append("size", size);
    return this.http.put(`${KREDILINE_SERVER_URL}${POST_COMMENT}`, "", {
      params,
    });
  }

  deleteComment(
    commentId: number = null,
    loanId: number = null,
    page: number = null,
    size: number = null
  ) {
    const params = new HttpParams()
      .append("loanApplicationId", loanId)
      .append("loanCommentId", commentId)
      .append("page", page)
      .append("size", size);
    return this.http.delete(`${KREDILINE_SERVER_URL}${POST_COMMENT}`,{params});
  }

  getInitials(name: string = ""): string {
    const names = name.split(" ");
    const initials = names.map((name) => name[0]).join("");
    return initials.toUpperCase();
  }
}
