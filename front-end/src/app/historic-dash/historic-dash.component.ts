import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QuicksightEmbedding from 'amazon-quicksight-embedding-sdk';

@Component({
  selector: 'app-historic-dash',
  templateUrl: './historic-dash.component.html',
  styleUrls: ['./historic-dash.component.css']
})
export class HistoricDashComponent implements OnInit {

  dashboard: any;
  url: any;
  constructor(private http: HttpClient) { }

  plotQuicksight(){
      var containerDiv = document.getElementById("dashboardContainer");
      var options = {
      url: this.url,
      container: containerDiv,
      scrolling: "yes",
      // loadingHeight: "300px",
      height: "1200px",
      width: "100%"
      };

      this.dashboard = QuicksightEmbedding.embedDashboard(options);
  }

  ngOnInit(): void {

    this.http.get('https://4p9d4ru3bd.execute-api.us-east-1.amazonaws.com/prod/testeteste')
    .subscribe(
      (response: any) => {                           //next() callback
        this.url = response["EmbedUrl"];
        this.plotQuicksight();
      },
      (error) => {                              //error() callback
        console.error(error)
        console.log("maoe")
      },
      () => {                                   //complete() callback
        console.error('Request completed')      //This is actually not needed 
      })
  }

}
