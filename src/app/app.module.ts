import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { DataSvcService } from './data-svc.service';
@NgModule({
  imports:      [ BrowserModule, FormsModule, WjGridModule, WjGridDetailModule, WjInputModule, WjGridFilterModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers: [DataSvcService]
})
export class AppModule { }
