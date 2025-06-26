export class NachChartDTO {
  constructor(
    public label?: string,
    public total?: number,
    public approved?: number,
    public processing?: number,
    public rejected?: number
  ) {}
}

export class NachChartDataDTO {
  constructor(
    public labels?: string[],
    public totalReceived?: number[],
    public totalApproved?: number[],
    public totalRejected?: number[],
    public totalProcessing?: number[]
  ) {}
}

export class NachMetricsDTO {
  constructor(
    public total?: number,
    public approved?: number,
    public processing?: number,
    public kaledofinProcessing?: number,
    public thirdPartyProcessing?: number,
    public rejected?: number,
    public tatDays?: number,
    public tatHours?: number,
    public tatNachCount?: number,
    public overallTatDays?: number,
    public overallTatHours?: number,
    public overallTatNachCount?: number,
    public approvalRate?: number,
    public overallApprovalRate?: number,
    public nachChart?: NachChartDTO[],
    public nachChartData?: NachChartDataDTO,
    public yesterdayData?: NachMetricsDTO
  ) {}
}

export class PaymentChartDTO {
  constructor(
    public label?: string,
    public total?: number,
    public successful?: number,
    public failure?: number,
    public scheduled?: number,
    public totalAmountCollected?: number
  ) {}
}

export class PaymentsMetricsDTO {
  constructor(
    public total?: number,
    public successful?: number,
    public failure?: number,
    public scheduled?: number,
    public totalAmountCollected?: number,
    public yesterdayData?: PaymentsMetricsDTO
  ) {}
}

export class DashboardDTO {
  constructor(
    public nachMandatesData?: NachMetricsDTO,
    public paymentsData?: PaymentsMetricsDTO,
    public showYesterday?: boolean
  ) {}
}
