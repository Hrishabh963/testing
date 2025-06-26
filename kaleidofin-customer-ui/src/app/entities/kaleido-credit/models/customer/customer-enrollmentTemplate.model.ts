import { Question } from "./customer-question.model";

export class EnrollmentTemplate {
  constructor(
    public id?: number,
    public version?: number,
    public templateCode?: string,
    public templateName?: string,
    public languageKey?: string,
    public startDate?: Date,
    public endDate?: Date,
    public partnerId?: number,
    public jsonTemplate?: string,
    public questions?: Question[],
    public branchsetId?: number,
    public url?: string,
    public majorVersion?: number,
    public minorVersion?: number,
    public headerMajorVersion?: number,
    public headerMinorVersion?: number
  ) {}
}
