import { Injectable } from '@angular/core';
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private generalService : GeneralService) { }
    getLoginData(data: any){
        return this.generalService.postService("/api/user/login", data, "binance")
    }

}