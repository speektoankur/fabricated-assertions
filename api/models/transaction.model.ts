/**
 * Transaction Data Models
 * Defines the structure for transaction API responses
 */

export interface Transaction {
  id: number;
  accountId: number;
  type: 'Credit' | 'Debit';
  date: number;
  amount: number;
  description: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  statusCode: number;
}

