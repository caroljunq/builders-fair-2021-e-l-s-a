import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GetInfosService } from "../get-infos.service";


// const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/red-dot.png';
// const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconUrl,
  iconSize: [20, 20]
});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {

  currentRegisters: any;
  private map: any;
  markersLayer = new L.LayerGroup();

  private initMap(): void {

    this.getLatLong();


    this.map = L.map('map', {
      center: [-22.0154, -47.8911],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });


    tiles.addTo(this.map);
  }

  getLatLong(){
    this.getInfoService.get10MinuteInfo().subscribe(
      (response: any) => {                           //next() callback
        this.currentRegisters = response.body;
        this.plotMap()
      },
      (error) => {                              //error() callback
        console.error(error)
      },
      () => {                                   //complete() callback
        console.error('Request completed')      //This is actually not needed 
      })
  }

  plotMap(){
    this.markersLayer.clearLayers();
    for(let i=0;i<this.currentRegisters.length; i++){
      const lon = this.currentRegisters[i]["long"];
      const lat = this.currentRegisters[i]["lat"];
      const marker = L.marker([lat, lon]).addTo(this.map);
      marker.addTo(this.map);
    }
  }
  
  

  constructor(private getInfoService: GetInfosService) {
    setInterval(() => {
      this.getLatLong()
    }, 15000);

  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}