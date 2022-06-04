import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from "ngx-spinner";

const config: SocketIoConfig = { url: environment.socketURL, options: {} };

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { DashboardComponent } from './public/dashboard/dashboard.component';
import { CompetitorsListComponent } from './public/dashboard/competitors-list/competitors-list.component';
import { AdsListComponent } from './public/dashboard/ads-list/ads-list.component';
import { ActiveTradeComponent } from './public/dashboard/active-trade/active-trade.component';
import { ChatBoxComponent } from './public/dashboard/chat-box/chat-box.component';
import { BankInfoComponent } from './public/dashboard/bank-info/bank-info.component';
import { NavbarComponent } from './public/dashboard/navbar/navbar.component';
import { AuthInterceptorService } from './services/auth.interceptor.service';
import { PortalsComponent } from './public/dashboard/portals/portals.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CompetitorsListComponent,
    AdsListComponent,
    ActiveTradeComponent,
    ChatBoxComponent,
    BankInfoComponent,
    NavbarComponent,
    PortalsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,    
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    SocketIoModule.forRoot(config),
    NgxSpinnerModule,
    NgbPaginationModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
