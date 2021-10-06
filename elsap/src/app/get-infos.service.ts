import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})


export class GetInfosService {
  infos_10min = [];
  total_infos = [];
  getInfoURL = ''
  
  getInfo10Minutes(){
    return this.infos_10min;
  }

  getInfos(){
    return this.total_infos;
  }

  

  constructor(private http: HttpClient) {
   
  }


  get10MinuteInfo(client_name: any,device_name:any,selected_date: any){
    return this.http.get(`https://4p9d4ru3bd.execute-api.us-east-1.amazonaws.com/prod/get-sensor-info?client_name=${client_name}&device_name=${device_name}&date=${selected_date}`) 
  }

}
