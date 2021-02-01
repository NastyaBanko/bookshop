import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() inputTitle: string;
  @Input() currentValue: string = "";
  @Output() onChangeInput = new EventEmitter<string>();

  someText: string = "";

  changeInput(newItem:string) {
    console.log(newItem)
    this.onChangeInput.emit(newItem);
  }

  constructor() { }

  ngOnInit(): void {
    if(this.currentValue) this.someText = this.currentValue;
  }

}
