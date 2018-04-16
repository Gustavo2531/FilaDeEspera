import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.css']
})
export class FlashMessageComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() alertSuccess;
  @Input() flashMessage;

  constructor() { }

  ngOnInit() {
  }

  onDestroyAlert() {
    this.close.emit(null);
  }

}
