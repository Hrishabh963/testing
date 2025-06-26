import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
  ViewChild
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import ImageEditor from "tui-image-editor";

// import ImageEditor from "tui-image-editor";
// import * as ImageEditor from "tui-image-editor";
// import * as ImageEditor from "tui-image-editor";
declare let require: any

// import icona from 'tui-image-editor/dist/svg/icon-a.svg';
// const icona = require("tui-image-editor/dist/svg/icon-a.svg");
// const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
// const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
// const icond = require("tui-image-editor/dist/svg/icon-d.svg");
// const bg = require('tui-image-editor/examples/img/bg.png')

const blackTheme = {
  // or white
  // // main icons
  // "menu.normalIcon.path": icond,
  // "menu.activeIcon.path": iconb,
  // "menu.disabledIcon.path": icona,
  // "menu.hoverIcon.path": iconc,
  // "submenu.normalIcon.path": icond,
  // "submenu.activeIcon.path": iconc,
};

enum editorEvents {
  addText = "addText",
  mousedown = "mousedown",
  objectActivated = "objectActivated",
  objectMoved = "objectMoved",
  objectScaled = "objectScaled",
  redoStackChanged = "redoStackChanged",
  textEditing = "textEditing",
  undoStackChanged = "undoStackChanged",
}

const editorDefaultOptions = {
  cssMaxWidth: 700,
  cssMaxHeight: 500,
};

interface IImageEditor extends ImageEditor {
  off(eventName: string): void;
}

@Component({
  selector: "jhi-image-editor",
  templateUrl: "./image-editor.component.html",
  styleUrls: ["./image-editor.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ImageEditorComponent implements AfterViewInit, OnDestroy {
  @Input() includeUI = true;
  @Input() options: tuiImageEditor.IOptions;
  @Output() addText = new EventEmitter<any>();
  @Output() mousedown = new EventEmitter<any>();
  @Output() objectActivated = new EventEmitter<any>();
  @Output() objectMoved = new EventEmitter<any>();
  @Output() objectScaled = new EventEmitter<any>();
  @Output() redoStackChanged = new EventEmitter<number>();
  @Output() textEditing = new EventEmitter<void>();
  @Output() undoStackChanged = new EventEmitter<number>();
  @ViewChild("imageEditor") editorRef: ElementRef;
  imageEditor: ImageEditor;
  imageData: any;
  feature: string;
  includeUIOptions: any = {};
  imageName: any;

  constructor(
    public readonly activeModal: NgbActiveModal
  ) {}

  ngAfterViewInit() {
    let options = editorDefaultOptions;
    this.includeUIOptions = {
      includeUI: {
        loadImage: {
          path: this.imageData,
          name: "Blank",
        },
        initMenu: "crop",
        menu: ["crop", "rotate", "filter", "shape", "mask"],
        theme: blackTheme,
        menuBarPosition: "bottom",
      },
      selectionStyle: {
        cornerSize: 5,
        rotatingPointOffset: 10,
        borderColor: "blue",
        cornerColor: "blue",
      },
    };
    
    if (this.includeUI) {
       options = {
        ...this.includeUIOptions,
        ...this.options
      };
    }

    this.imageEditor = new ImageEditor(this.editorRef.nativeElement, options);

    this.imageEditor.changeShape(1, {
      fill: "red",
      stroke: "blue",
      strokeWidth: 3,
      width: 100,
      height: 200,
      left: 10,
      top: 10,
      isRegular: true,
    });

    this.imageEditor.resizeCanvasDimension({ width: 400, height: 300 });
    this.addEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
    this.imageEditor.destroy();
  }

  private addEventListeners() {
    this.imageEditor.on(editorEvents.addText, (event) =>
      this.addText.emit(event)
    );
    this.imageEditor.on(editorEvents.mousedown, (event, originPointer) =>
      this.mousedown.emit({ event, originPointer })
    );
    this.imageEditor.on(editorEvents.objectActivated, (event) =>
      this.objectActivated.emit(event)
    );
    this.imageEditor.on(editorEvents.objectMoved, (event) =>
      this.objectMoved.emit(event)
    );
    this.imageEditor.on(editorEvents.objectScaled, (event) =>
      this.objectScaled.emit(event)
    );
    this.imageEditor.on(editorEvents.redoStackChanged, (event) =>
      this.redoStackChanged.emit(event)
    );
    this.imageEditor.on(editorEvents.textEditing, () =>
      this.textEditing.emit()
    );
    this.imageEditor.on(editorEvents.undoStackChanged, (event) =>
      this.undoStackChanged.emit(event)
    );
  }

  private removeEventListeners() {
    (<IImageEditor>this.imageEditor).off(editorEvents.addText);
    (<IImageEditor>this.imageEditor).off(editorEvents.mousedown);
    (<IImageEditor>this.imageEditor).off(editorEvents.objectActivated);
    (<IImageEditor>this.imageEditor).off(editorEvents.objectMoved);
    (<IImageEditor>this.imageEditor).off(editorEvents.objectScaled);
    (<IImageEditor>this.imageEditor).off(editorEvents.redoStackChanged);
    (<IImageEditor>this.imageEditor).off(editorEvents.textEditing);
    (<IImageEditor>this.imageEditor).off(editorEvents.undoStackChanged);
  }

  confirmImage() {
    this.imageData = this.imageEditor.toDataURL();
    const a = this.imageData.substring(
      this.imageData.lastIndexOf(",") + 1,
      this.imageData.length
    );
    this.activeModal.close(a);
  }

  close() {
    this.activeModal.dismiss();
  }
}
