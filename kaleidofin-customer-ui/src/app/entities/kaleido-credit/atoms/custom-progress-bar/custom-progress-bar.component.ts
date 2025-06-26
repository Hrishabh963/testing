import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-progress-bar',
  templateUrl: './custom-progress-bar.component.html',
  styleUrls: ['./custom-progress-bar.component.scss']
})
export class CustomProgressBarComponent implements OnInit {

  @Input() progressValue: number = 0;
  @Input() accentHex: string = '#FF7B52';

  containerBackground: string;

  ngOnInit(): void {
    this.containerBackground = this.hexToRgba(this.accentHex)
  }

  /* 
  Dynamically getting accentColor for default background color
  */
  hexToRgba(hex: string): string {
    let r = 0, g = 0, b = 0;

    if (hex.length == 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    else if (hex.length == 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${0.5})`;
  }

}
