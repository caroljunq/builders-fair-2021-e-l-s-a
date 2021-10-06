import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment/moment';



@Injectable({
  providedIn: 'root'
})


export class GetInfosService {
  client_name: string;
  device_name: string;
  date: any;
  
  constructor(private http: HttpClient) {
   this.date = moment(new Date().getTime()).add(-3, 'h').format("YYYY-MM-DD");
   this.client_name = "fake_clinic_1";
   this.device_name = "device_1";
  }

  get10MinuteInfo(){
    return this.http.get(`https://4p9d4ru3bd.execute-api.us-east-1.amazonaws.com/prod/get-sensor-info?client_name=${this.client_name}&device_name=${this.device_name}&date=${this.date}`) 
  }
  

  setInfos(client_name: string,device_name: string,selected_date:string){
    this.client_name = client_name;
    this.device_name = device_name;
    this.date = selected_date;
  }
}
