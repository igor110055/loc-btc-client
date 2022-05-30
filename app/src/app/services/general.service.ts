import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  url: any;
  wazirx_URL: any;
  Binanace_URL: any;
  token: string = "";
  constructor(private http: HttpClient, private router: Router, private _spin:SpinnerService) {
    this.wazirx_URL = environment.wazirx_URL;
    this.Binanace_URL = environment.Binanace_URL;
  }


  getService(apiUrl: string, server_name?:string, spin?:any): Observable<any> {
    this.url = this.wazirx_URL + apiUrl;
    if(server_name == 'btc')
      this.url = this.Binanace_URL + apiUrl;
    if(!!!spin)
    this._spin.show()
    return this.http.get(this.url, httpOptions)
    .pipe(map(this.extractData),
      tap(_ => this._spin.hide()),
      catchError(this.handleError));
  }

  postService(apiUrl: string, data: any, server_name?:string): Observable<any> {
    this.url = this.wazirx_URL + apiUrl;
    if(server_name == 'btc')
    this.url = this.Binanace_URL + apiUrl;
    this._spin.show()
    return this.http.post(this.url, data, httpOptions)
      .pipe(
        map(this.extractData),
        tap(_ => this._spin.hide()),
        catchError(this.handleError)
      );
  }


  fileUpladService(apiUrl: string, data: any): Observable<any> {
    this.url = this.Binanace_URL + apiUrl;
    return this.http.post<any>(this.url, data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  deleteService(apiUrl: string, server_name?:string): Observable<any> {
    this.url = this.wazirx_URL + apiUrl;
    if(server_name == 'btc')
    this.url = this.Binanace_URL + apiUrl;
    return this.http.delete(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));;
  }

  putService(apiUrl: string, data: any, server_name?:string): Observable<any> {
    this.url = this.wazirx_URL + apiUrl;
    if(server_name == 'btc')
    this.url = this.Binanace_URL + apiUrl;
    return this.http.put(this.url, data, httpOptions).pipe(
      catchError(this.handleError)
    );;
  }


  private extractData(res: any) {
    let body: any = res;
    if (body.code) {
      if (body.code == 402 || body.code == 403) {
        localStorage.clear();
        // this._notify.success(body.error, body.message);        // this._token.setMessage("true");
      }
    }
    return body || {};
  }

  private handleError(req: HttpErrorResponse) {
    if (req.error instanceof ErrorEvent) {
      console.error('An error occurred:', req.error.message);
    } else {
      // if (req.status != 0)
        console.error(`Backend returned code ${req.status}, ` + `body was: ${!!req.error.error ? req.error.error : req}`);
    }
    return throwError(req.error);
  };

  public setToken(token:string) {
    this.token = token;
  }

  public getToken() {
    return this.token;
  }

}
