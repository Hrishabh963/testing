import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-notify-message',
  templateUrl: './notify-message.component.html',
  styleUrls: ['./notify-message.component.scss']
})
export class NotifyMessageComponent  {

  
  @Input()
  imageSrc :string ='';

  @Input()
  title :string ="Password Changed!";
  
  @Input()
  content :string ="Your password has been changed successfully";

  @Input()
  widthOfImage :string; 

}
