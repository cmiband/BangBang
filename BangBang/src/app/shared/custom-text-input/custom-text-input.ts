import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-text-input',
  imports: [],
  templateUrl: './custom-text-input.html',
  styleUrl: './custom-text-input.css',
})
export class CustomTextInput implements OnInit {
  @Input() label: String = "";
  @Input() inputValue: String = "";

  value: String = "";

  ngOnInit() {
    this.value = this.inputValue;
  }

  handleChange(event: Event) {
    const eventNode = event.target as HTMLTextAreaElement;

    console.log('abc', eventNode.value);
  }
}
