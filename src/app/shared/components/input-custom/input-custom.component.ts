import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-custom',
  templateUrl: './input-custom.component.html',
  styleUrls: ['./input-custom.component.css']
})
export class InputCustomComponent implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() nameFormControl!:string;
  @Input() validatorsKeyValue: {key: string, value: string}[]=[];
  @Input() readonly:boolean=true; 
  @Input() label:string = 'WYPEŁNIJ'; 
  @Input() type:string = 'text'; 
  public edit=false;
  public errorsList:any=[];
  public errorsList2:string[]=[];
  constructor() {
   }

  ngOnInit(): void {
    this.formGroup.get(this.nameFormControl)?.valueChanges.subscribe(x=>{
      // console.log(this.formGroup.get(this.nameFormControl)?.errors);
      // let sdfgds=this.formGroup.get(this.nameFormControl)?.errors
      // if(sdfgds){
      //   console.log(Object.keys(sdfgds))
      //   this.errorsList=Object.keys(sdfgds);
      //   //this.errorsList
      //   for(let item of this.errorsList)
      //   {
      //     let c = this.validatorsKeyValue.find(x=>x.key == item)?.value
      //     if( c)    
      //     {
      //       this.errorsList2.push(c)
      //     }
      //   }
      // }
      
    })
  }
  testf(object:object):string[]{

    console.log("testtttt")

    return Object.keys(object)
  }

}
