import { EnrollmentTemplate } from "./customer-enrollmentTemplate.model";
import { CustomerSubscriptionsDTO } from "./customer-persona-response.model";

export class CustomerSubscriptionsCompositeDTO {
  constructor(
    public responses?: CustomerSubscriptionsDTO,
    public requiredContributionAmount?: number,
    public enrollmentTmplateDTO?: EnrollmentTemplate
  ) {}
}
