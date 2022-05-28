import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeneralService } from "./general.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    token: string = "";
    constructor(private _gservice: GeneralService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!req.url.includes("open_trades_messages") || !req.url.includes("api.wazirx.com")) {
            this.token = this._gservice.getToken();
            const modifiedReq = req.clone({headers: new HttpHeaders().set('auth', this.token)});
            return next.handle(modifiedReq);
        }
        return next.handle(req)
        
    }
}