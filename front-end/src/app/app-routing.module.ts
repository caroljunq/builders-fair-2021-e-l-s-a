import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricDashComponent } from './historic-dash/historic-dash.component';
import { TempComponent } from "./temp/temp.component"
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: '', component:  TempComponent},
  { path: 'historic', component:  HistoricDashComponent},
  { path: 'about', component:  AboutComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }