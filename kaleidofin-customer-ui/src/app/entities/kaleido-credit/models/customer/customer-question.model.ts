export class Question {
  constructor(
    public id?: number,
    public version?: number,
    public questionId?: number,
    public title?: string,
    public type?: any,
    public listOfValues?: any[],
    public mandatory?: string,
    public enrollmentResp?: any,
    public verificationResp?: string,
    public listValueMessage?: boolean,
    public questionHierarchy?: any,
    public isRequired?: boolean,
    public questionText?: string,
    public questionCode?: string,
    public categories?: string
  ) {}
}
