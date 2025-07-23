import  RootState  from '../redux/store';

export type PaymentState = {
  shiftFees: any[]; // Replace 'any' with your fee type
  payments: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
};