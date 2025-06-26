import { UiField } from "src/app/constants/ui-config"

export interface FieldValidationDTO {
    [field: string]: FieldDetails
}



interface FieldDetails {
    fieldValue? : UiField,
    sectionScrollKey?: string
}