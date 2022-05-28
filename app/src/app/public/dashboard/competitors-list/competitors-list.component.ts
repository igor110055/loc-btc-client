import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-competitors-list',
  templateUrl: './competitors-list.component.html',
  styleUrls: ['./competitors-list.component.css']
})
export class CompetitorsListComponent implements OnInit {

  @Output() postMarginBack = new EventEmitter<any>();
  
  public comp_list: any[] = [];
  public val: any = {};
  public  feedback:any={};
  public selectedAds: any = '';
  public competitor_ID = "";
  public asset: string = "";
  constructor(private _service: DashboardService, private _notify: ToastrsService, private formBuilder: FormBuilder){ }

  ngOnInit(): void {
 }
  setLimitForm = new FormGroup({
    upLimit: new FormControl(''),

  });

  @Input() set fetchMarginData(data: any) {
    if(data) {
      this.asset = data.asset;
      this.setLimitForm.patchValue({upLimit: data.margin})
    }
  }

  onSubmit() {
    this._service.sendLimit({"margin":this.setLimitForm.value.upLimit, "asset": this.asset}).subscribe((res: any) => {
      if (res && res.message == "Success") {
        this._notify.success("Success", "Margin Updated Successfully");
        this.getMarginValue();
      } else
        this._notify.error('error', 'Not Updated');
    })
  }

  getMarginValue() {
    this._service.getMargin(this.asset).subscribe((res: any) => {
      if (!!res) {
        this.postMarginBack.emit(res.data.margin);
        this._notify.success("Success", "Margin Updated");
      } else {
        this._notify.error('Error', res.message);
      }
    })
     this._service.getFeedBack().subscribe((res:any)=>{
         if(!!res) {
            // this.feedback=res.data.feedback;
            this.feedback.firstmsg=res.data.firstmsg;
            this.feedback.lastmsg=res.data.lastmsg
         } else {
          this._notify.error('Error', res.message);
         }
         

     })
  };

  onRemoveCompById(comp_id: any, ad_id: any) {
    this._service.onRemoveCompById(comp_id, ad_id).subscribe((res) => {
      if (!!res && res.status) {
        this._notify.success('Success', res.message);
        this.getCompListById(this.selectedAds.ad_id);
      } else
        this._notify.error('Error', res.message);
    })
  }

  getCompListById(id: any) {
    this._service.getDetailsById(id).subscribe((res) => {
      if (!!res && res.status) {
        if (res.comp_ids.length > 0) {
          this.comp_list = res.comp_ids;
        } else {
          this._notify.error('Error', res.message);
          this.comp_list = [];
        }
      }
    });
  }

  onAddComp(id: any) {
    // if (!!id && id.length == 7 && this.selectedAds.ad_id) {
    id = BigInt(id);
    id = id.toString();
      this._service.addCompetitorByID(id).subscribe((res) => {
        if (!!res && res.message == "Success") {
          this._notify.success('Success', res.message);
          if (res.data) {
            var addedComp = Object.values(res.data)
            this.comp_list.push(addedComp[0])
          }
        } else {
            this._notify.error('Error', res.message);
        }
      });
  }




}
