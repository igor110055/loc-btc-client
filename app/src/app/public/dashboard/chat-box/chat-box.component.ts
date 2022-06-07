import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';

import * as htmlToImage from 'html-to-image';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  chatLists: any = [];
  url: string = "";
  showChatBox: boolean = false;
  public accountNo: any = {};
  public ifsc: any = {};
  public name: any = {};
  public welcomeMsg: any = "";
  public postedMessage: any = "";
  public orderNo: number = 0;
  public username: string = "";
  public paidAmt: string = "";
  public btcqty: string = "";
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<any> | any;

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef<any> | any;
  @Output() public postBankDetails = new EventEmitter<any>();
  @Input() set fetchPostStatus(data:any) {
    if(data) {
      console.log(data)
      this.showChatBox = data.status;
      this.orderNo = data.orderNo;
      this.username = data.userName;
      this.paidAmt = data.amount;
      this.btcqty = data.amount_btc;
      this.setChatMessages();
      
    }
  }

  @Input() set fetchRefreshChatMessage(data: boolean) {
    if(data) {
      this.chatLists = [];
      this.setChatMessages();
    }
  }

  public res_data: any = '';
  public recent_messages: any = '';
  public  review:any="";
  public open_trades_messages: any = '';
  public add_list = [];
  public comp_list: any = [];
  public selectedAds: any = '';
  public competitor_ID = "";
  public val: any = {};
  public  feedback:any={};
  public Review:any={};
  public inputForm: FormGroup;
  public CopyMsg:any=[];

  setLimitForm = new FormGroup({
    upLimit: new FormControl(''),

  });



  public wazirxUPPrice: any = '';
  public priceUpdate = false;
  public showAdKeys = ['ad_id', 'max_amount', 'min_amount', 'price_equation', 'trade_type', 'online_provider']
  clipboard: any;
  currentChartUser: any;
  currentChartRoom: any = [];
  isChartRoomOpen: boolean = false;

  public input_text: any = '';

  last_sms: any;
  showInvoice: boolean = true;
  wazirxBidPrice: any;
  date: any;


  constructor( private formBuilder: FormBuilder, private _service: DashboardService, private _notify: ToastrsService) {
    this.inputForm = this.formBuilder.group({
      recepient_name: [''],
      email_id: [''],
      mobile_number: [''],
      otp: [''],
      debit_account_number: [''],
      transaction_types_id: [''],
      amount: [''],
      merchant_ref_id: [''],
      purpose: [''],
      vpa: [''],
      bene_account_number: [''],
      ifsc_code: [''],

    });

  }

  ngOnInit(): void {
  }

  setChatMessages() {
    this._service.getOrderDetails(this.orderNo.toString()).subscribe((res: any) => {
      if (res && res.data && res.message == "OK") {
        console.log(res)
        res.data.message_list.map((obj:any) => { obj.acDetails = {}  })
        this.chatLists = res.data.message_list;
        this.chatLists.map((data: any) => {
          console.log(data)
          if(data.msg.includes("IFSC")) {
            var acDetails = data.msg.split("\n");
            console.log(acDetails);
            if(acDetails[2]) {
              data.acDetails.name = acDetails[0].split(":")[1]
              data.acDetails.accNo = acDetails[1].split(":")[1]
              data.acDetails.ifsc = acDetails[2].split(":")[1]
            } 
          };
        })
        this.postBankDetails.emit(false)
      }
    },(error) => this._notify.error("Error", "Something went wrong"))
  } 
  
  copyChat(msg:any)
  {
    this.postBankDetails.emit({"msg":msg, "amt": this.paidAmt, "btcqty": this.btcqty});
  
  }

  

  convetToPDF()
   {
    let data: any = document.getElementById('pdfTable');
    html2canvas(data).then((canvas) => {
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      var _pdf = pdf.output('blob');
      var base64 = pdf.output('datauristring');

      pdf.save('payment-invoice.pdf');
      pdf.close();
    });
  }


  sendMessage() {
    var messageToPost = this.postedMessage;
    console.log(messageToPost);
    this._service.contactMessageSend(this.orderNo, messageToPost).subscribe((res) => {
      this._notify.success("Success", "Message posted successfully");
      this.chatLists = [];
      this.setChatMessages();
    }, (error) => {
      this._notify.error("Error", "Message coudn't be posted plese try again")
    })
  }

  getMessage()
  {
  }

  

}
