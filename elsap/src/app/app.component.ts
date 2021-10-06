import { Component,OnInit } from '@angular/core';
import { GetInfosService} from "./get-infos.service"
import * as ApexCharts from 'apexcharts';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'elsap';

  locations: Array<Number> = [];

  temperature:any;
  altitude: any;
  speed: any;

  currentRegisters: Array<any> = [];

  get10minuteInfo(){
    // this.getInfoService.setInfos('fake_clinic_1','device_1','2021-10-06');
    this.getInfoService.get10MinuteInfo().subscribe(
      (response: any) => {                           //next() callback
        this.temperature = response.body.at(-1)["temp"];
        this.altitude = response.body.at(-1)["altitude"];
        this.speed = response.body.at(-1)["speed"];

        this.currentRegisters = response.body;
        this.plotGraphLineChart()
        
      },
      (error) => {                              //error() callback
        console.error(error)
      },
      () => {                                   //complete() callback
        console.error('Request completed')      //This is actually not needed 
      })
  }

  plotGraphLineChart(){
    let tempMax = Number(this.currentRegisters[0]["temp"]);
    let tempMin = Number(this.currentRegisters[0]["temp"]);
    
    let datapoints = [];
    for(let i= 0; i < this.currentRegisters.length; i++){
      let brt_time = moment(new Date(this.currentRegisters[i]["timestamp"]).getTime()).add(-3, 'h').toDate();
      
       tempMax = tempMax > this.currentRegisters[i]["temp"] ? tempMax:this.currentRegisters[i]["temp"]
       tempMin = tempMin < this.currentRegisters[i]["temp"] ? tempMin : this.currentRegisters[i]["temp"]

      datapoints.push({
        x: brt_time,
        y: this.currentRegisters[i]["temp"]
      })
    }



    var options = {
      chart: {
        type: 'line'
      },
      series: [{
        data: datapoints,
        name: "fake_clinic_1"
      }], 
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontSize: '15px',
          },
          title: {
            text: 'Time'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Temperature °C',
          style: {
            fontSize: '15px',
          }
      },
      labels: {
        style: {
          fontSize: '15px',
        }
      }
    },
      title: {
        text: 'Temperature last 10 minutes',
        align: 'left',
        style: {
          fontSize: '20px',
        },
      }, 
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.2
        },
      },
      legend: {
        fontSize: "32px"
      },

      annotations: {
        yaxis: [
          {
            y: tempMax,
            borderColor: '#fd710d',
            label: {
              borderColor: '#fd710d',
              style: {
                color: '#fff',
                background: '#fd710d',
                fontSize: "15px"
              },
              text: 'Max temperature allowed'
            }
          },
        ],
        
      },
      tooltip: {
      custom: (value: any) => {
        
        let temp = Number(value.series[value.seriesIndex][value.dataPointIndex]);
        let tempIdeal = (Number(tempMax)+Number(tempMin))/2;
        let diffTemp = temp - tempIdeal;
        let rottenIndex = (temp * 100 / tempIdeal) - 100;
            if (diffTemp == 0) {
              return '<div>Temp: '+temp+'</div><div class="arrow_box">' +
                '<span>' + 'The vaccine is currently under the expected temperature (in Celcius)' + '</span>' +
                '</div>'
            } else if (diffTemp > 0) {
              return '<div>Temp: '+temp+'</div><div class="arrow_box">' +
                '<span>' + 'The vaccine is currently ' + String(diffTemp) + ' Celcius above expected <br> and the rotten index is ' + rottenIndex + '</span>' +
                '</div>'
            } else {
              return '<div>Temp: '+temp+'</div><div class="arrow_box">' +
                '<span>' + 'The vaccine is currently ' + String(diffTemp) + ' Celcius below expected <br> and the rotten index is ' + rottenIndex + '</span>' +
                '</div>'
            }
      
      }
      }
      
    }
    
    var chart = new ApexCharts(document.querySelector("#myChart"), options);
    
    chart.render();
  }

  constructor(private getInfoService: GetInfosService){
    setInterval(() => {
      this.get10minuteInfo()
    }, 15000);
  }



    ngOnInit(){
      this.get10minuteInfo();
    }
}



