export const REPAYMENT_SCHEUDLE_MAP = [
    {
        propertyKey: "dueDate",
        label: "Due Date",
        displayFormat: "date",
        format: "dd-MM-yyyy",
    },
    {
        propertyKey: "openingPrinciple",
        displayFormat: "currency",
        label: "Opening Balance"
    },
    {
        propertyKey: "emiAmount",
        displayFormat: "currency",
        label: "EMI"
    },
    {
        propertyKey: "principalAmount",
        displayFormat: "currency",
        label: "Principal",
        showError: true 
    },
    {
        propertyKey: "interestAmount",
        displayFormat: "currency",
        label: "Interest"
    },
]

export const STAGGERED_SCHEDULE_MAP = [
    {
        propertyKey: "demandNumber",
        label: "Installment Number",
    },
    {
        propertyKey: "dueDate",
        label: "Due Date",
        type: "dateEdit",
        displayFormat: "date",
        format: "dd-MM-yyyy",
    },
    {
        propertyKey: "openingPrinciple",
        displayFormat: "currency",
        label: "Opening Balance"
    },
    {
        propertyKey: "emiAmount",
        displayFormat: "currency",
        label: "EMI",
        type: "emiEdit",
    },
    {
        propertyKey: "principalAmount",
        displayFormat: "currency",
        label: "Principal",
        showError: true
    },
    {
        propertyKey: "interestAmount",
        displayFormat: "currency",
        label: "Interest"
    },
]