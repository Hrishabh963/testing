import { NgModule } from '@angular/core';
import {ImageEditorComponent} from './image-editor.component';
import {ImageEditorPopupService} from './image-editor-popup.service';

@NgModule({
  declarations: [ImageEditorComponent],
  providers: [
    ImageEditorPopupService
  ],
  entryComponents: [ImageEditorComponent],
})
export class ImageEditorModule {}
