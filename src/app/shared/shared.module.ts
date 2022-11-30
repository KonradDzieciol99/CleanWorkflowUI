import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { MapErrorsPipe } from './pipes/map-errors.pipe';


@NgModule({
  declarations: [
    InputCustomComponent,
    MapErrorsPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
  ,exports:[
    ReactiveFormsModule,
    FontAwesomeModule,
    InputCustomComponent
  ]
})
export class SharedModule { }
