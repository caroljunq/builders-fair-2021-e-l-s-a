import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './marker.service';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TempComponent } from './temp/temp.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { HistoricDashComponent } from './historic-dash/historic-dash.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TempComponent,
    HistoricDashComponent
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
