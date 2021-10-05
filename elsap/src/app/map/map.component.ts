import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../marker.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

function getLatLong() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', "https://4p9d4ru3bd.execute-api.us-east-1.amazonaws.com/prod/getLatLong");
    xhr.addEventListener('loadend', () => {
      if (xhr.status == 200) {
        console.log("got the response")
        resolve(JSON.parse(xhr.responseText)
        );
        const obj = JSON.parse(xhr.responseText)
        //console.log(obj.body)
        var latlong = obj.body
        console.log("result lat long" + latlong)
        //return String(obj.body)
      } else {
        console.log(xhr.responseText);
        reject("Não foi possível obter as negociações do servidor.");
      }
    });
    xhr.send();
  })
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {
  
  private map: any;
  private initMap(): void {

    var resp = getLatLong()

    console.log("resp lat long inside map coponet" + resp)
    var respLat = -23.592013
    var respLong = -46.689212

    this.map = L.map('map', {
      center: [-23.592013, -46.689212],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    L.marker([respLat, respLong]).addTo(this.map)


    tiles.addTo(this.map);
  }
 
  constructor(private markerService: MarkerService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);
  }
}