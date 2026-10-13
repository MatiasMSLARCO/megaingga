export interface CardDetails {
  cardholderName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export interface PaymentResult {
  orderId: string
  amount: number
  last4: string
}
