import {components} from "./payments-api";

export type PaymentRequest = components["schemas"]["PaymentRequest"];
export type PaymentsResponse201 = components["schemas"]["PaymentsResponse201"];
export type PaymentsCardOnFileCustomerAgreement =
  components["schemas"]["PaymentsCardOnFileCustomerAgreement"];
export type TokenCreation = components["schemas"]["TokenCreation"];
export type CardPaymentsInstruction = components["schemas"]["CardPaymentsInstruction"];
export type SessionPaymentInstrument =
  components["schemas"]["SessionPaymentInstrument"];
export type TokenPaymentInstrument = components["schemas"]["TokenPaymentInstrument"];
export type BillingAddress = components["schemas"]["BillingAddress"];
export type Payment = {
  timestamp: string;
  transactionReference: string;
  transactionType: string;
  authorizationType: string;
  entity: string;
  value: {
    currency: string;
    amount: number;
  };
};
export type QueryResponse = {
  _embedded: {
    payments: any[];
  };
};
