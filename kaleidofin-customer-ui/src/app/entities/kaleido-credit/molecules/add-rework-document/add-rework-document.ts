import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'add-rework-document',
  templateUrl: './add-rework-document.html',
  styleUrls: ["./add-rework-document.scss"],
})
export class AddReworkDocumentComponent  {

  @Input() docId: number;
  @Input() rework: boolean;
  @Input() ownersList: [];
  @Output() documentUpdate = new EventEmitter<{ id: number; entityType: string; documentType: string; entityId: number; loanStage: string; proofType: string, remarks: string }>();

  currentOwner: any;
  currentDocument: any
  entityId: number;
  remarks: string = "";
  @Input() type: string = "";

  documents = [];

  updateDocs(owner: any) {
    console.log(this.type)
    const { entityId } = owner;
    this.documents = owner.docs;
    this.currentOwner = owner;
    this.entityId = entityId;
  }

  recordDoc(document: string) {
    this.currentDocument = document;
    this.emitUpdate();
  }

  recordRemarks(remark: string) {
    this.remarks = remark;
    this.emitUpdate();
  }

  emitUpdate() {
    if (this.currentDocument.document!==null && this.currentOwner.value !== null) {
      this.documentUpdate.emit({
        id: this.docId,
        entityType: this.currentOwner.value,
        documentType: this.currentDocument.document,
        entityId: this.entityId,
        loanStage: this.currentDocument.stage,
        proofType: this.currentDocument.proofType,
        remarks: this.remarks
      });
    }
  }
}
