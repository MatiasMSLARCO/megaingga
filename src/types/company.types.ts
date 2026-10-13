export interface CompanyStat {
  value: string
  label: string
  suffix?: string
}

export interface CompanyInfo {
  legalName: string
  brandName: string
  country: string
  officialPhone: string
  whatsappNumber: string
  contactEmail: string
  stats: CompanyStat[]
  mission: string
  vision: string
  qualityPolicy: string
  values: string[]
}
