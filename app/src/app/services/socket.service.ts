import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const SERVER_URL = 'wss://streamer.cryptocompare.com';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  baseSocketUrl: string = "";
  constructor(private socket: Socket) { 
    this.baseSocketUrl =  environment.socketURL;
  }
  
  setAdsDetails(advNo: string) {
    this.socket.emit("adsDetails", advNo)
  }

  getWazirxDetails() {
    return this.socket.fromEvent("WazirxPricesArray").pipe(map((data) => data));
  }

  getPriceUpdate() {
    return this.socket.fromEvent("PriceUpdate").pipe(map((data) => data));
  }

  setUserOrder() {
    return this.socket.emit("getTrades")
  }
  
  getUserOrderDetails() {
    return this.socket.fromEvent("getTradeDetails").pipe(map((data) => data));
  }
  setMerchantAd() {
    return this.socket.emit("getMerchantAd",  {merchantNo: "s1b112d51539a3712bc212bce8089512c" })
  }
  
  getMerchantAdDetails() {
    return this.socket.fromEvent("getMerchantAdDetails").pipe(map((data) =>  data));
  }

} 