import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricDashComponent } from './historic-dash/historic-dash.component';
import { TempComponent } from "./temp/temp.component"

const routes: Routes = [
  { path: '', component:  TempComponent},
  { path: 'historic', component:  HistoricDashComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }