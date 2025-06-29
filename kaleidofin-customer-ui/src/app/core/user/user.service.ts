import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SERVER_API_URL } from 'src/app/app.constants';
import { createRequestOption } from 'src/app/shared';
import { IUser } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly resourceUrl = SERVER_API_URL + "api/backoffice/users";

  constructor(private readonly http: HttpClient) {}

  create(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.resourceUrl, user, {
      observe: "response"
    });
  }

  update(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(this.resourceUrl, user, {
      observe: "response"
    });
  }

  find(login: string): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`, {
      observe: "response"
    });
  }

  query(req?: any): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, {
      params: options,
      observe: "response"
    });
  }

  delete(login: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${login}`, {
      observe: "response"
    });
  }

  authorities(): Observable<string[]> {
    return of(["ROLE_USER", "ROLE_ADMIN"]);
  }
}
