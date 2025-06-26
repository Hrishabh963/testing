import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './quick-info.component.html',
  styleUrls: ['./quick-info.component.css'],
  standalone: false
})
export class InfoTooltipComponent implements OnChanges {
  @Input() tooltipText: string[] = [];
  text: string = ""
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltipText']?.currentValue) {
        this.text = changes['tooltipText'].currentValue.join('\n');
    }
  }
}