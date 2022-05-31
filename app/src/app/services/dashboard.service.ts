import { Injectable } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private generalService : GeneralService) { }

  getAdsData(){
    return this.generalService.getService("/api/localbitcoin/getAds",  "btc")
  }
  // getWazirxData(){
  //   return this.generalService.getService('/binance/wazirxData',"binance")
  // }
  recentMessages(){
    return this.generalService.getService("/chat/recent_messages", "binance")
  }

  openTradesMessages(){
    return this.generalService.postService("/api/binance/getUserOrderListWithPagination", {"page": 1,"rows": 5}, "binance")
  }

  getOrderDetails(advNo: string){
    return this.generalService.postService("/api/binance/getUserOrderDetail", {"adOrderNo":advNo}, "binance")
  }

  getDetailsById(id:number){
    return this.generalService.getService("/binance/ads/"+id, "binance")
  }

  addCompetitorByID(id:number ){
    return this.generalService.postService(`/api/competitor/addCompetitor`, {"competitorId":id}, "btc")
  }

  initiatePayouts(data:any ){
    return this.generalService.postService(`/payment/initiate-payouts/`, data, "binance")
  }

  contactMessageSend(id:any,data:any ){
    return this.generalService.postService(`/chat/contact_message/${id}`, data, "binance")
  }


  contactMessageSendFile(id:any,data:any ){
    return this.generalService.fileUpladService(`/chat/contact_message/${id}`, data)
  }


  contactMessageGet(id:any){
    return this.generalService.getService(`/chat/contact_message/${id}`, "binance", 'spin')
  }

  onRemoveCompById(comp_id:any){
    return this.generalService.deleteService(`/api/competitor/removeCompetitor/` + comp_id, "btc")
  }

  sendOTP(){
    return this.generalService.getService(`/payment/send_otp`, "binance")
  }

  sendLimit(data:any){
    return this.generalService.putService(`/api/setting/updateMarginByCurrency/BTCINR` ,{"margin": data.margin},"btc")
  }
  SaveStartFeed(feedback:any)
  {
    return this.generalService.putService(`/api/trade_messages/updateTradeMessages/start_message`,{"messages" : feedback.start_message},"btc")
  }

  SaveEndFeed(feedback:any)
  {
    return this.generalService.putService(`/api/trade_messages/updateTradeMessages/end_message`,{"messages" : feedback.end_message},"btc")
  }


  getLimitValue()
  {
    return this.generalService.getService(`/binance/getlimitval`, "binance")
  }

  getFeedBack()
  {
    return this.generalService.getService('/binance/getFeedback',"binance")
  }

  getMargin() {
    return this.generalService.getService('/api/setting/getMargin', 'btc')
  }

  getAdDetailsByNo(advNo: string) {
    return this.generalService.getService('/api/binance/getAdsDetailsByNo/' + advNo, 'binance')
  }
  getWazirxPrice() {
    return this.generalService.getService('/sapi/v1/tickers/24hr');
  }
  getStartEndMessages() {
    return this.generalService.getService('/api/trade_messages/getTradeMessages', 'btc')
  }

  getChatDetails(url: string) {
    return this.generalService.getService('/api/binance/getChatMessagesWithPagination?' + url, 'binance')
  }

  getCompetitor() {
    return this.generalService.getService('/api/competitor/getCompetitor', 'btc')
    
  }

  getCompDetails(id:any) {
    return this.generalService.getService('/api/localbitcoin/getAdsByNo/' + id, 'btc')
    
  }
}
