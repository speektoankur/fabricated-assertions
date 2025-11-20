/**
 * Transaction API Client
 * Handles API calls for transaction-related operations
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../config/env.config';
import { Transaction, TransactionResponse } from './models/transaction.model';

export class TransactionAPI {
  private requestContext: APIRequestContext;
  private sessionId: string | null = null;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  /**
   * Sets the JSESSIONID for authentication
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Fetches transactions for a given account
   * @param accountId - The account ID to fetch transactions for
   * @returns Promise<TransactionResponse>
   */
  async getAccountTransactions(accountId: number): Promise<TransactionResponse> {
    const url = `${config.baseUrl}/parabank/services_proxy/bank/accounts/${accountId}/transactions/month/All/type/All`;
    
    const headers: Record<string, string> = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'referer': `${config.baseUrl}/parabank/activity.htm?id=${accountId}`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
    };

    if (this.sessionId) {
      headers['Cookie'] = `JSESSIONID=${this.sessionId}`;
    }

    const response: APIResponse = await this.requestContext.get(url, {
      headers,
    });

    const transactions: Transaction[] = await response.json();
    const statusCode = response.status();

    return {
      transactions,
      statusCode,
    };
  }

  /**
   * Verifies that transactions contain expected transaction types
   * @param transactions - Array of transactions to verify
   * @param expectedTypes - Array of expected transaction types
   * @returns boolean
   */
  verifyTransactionTypes(transactions: Transaction[], expectedTypes: string[]): boolean {
    const transactionTypes = transactions.map(t => t.type);
    return expectedTypes.every(type => transactionTypes.includes(type as 'Credit' | 'Debit'));
  }

  /**
   * Verifies that transactions contain expected descriptions
   * @param transactions - Array of transactions to verify
   * @param expectedDescriptions - Array of expected descriptions (partial matches allowed)
   * @returns boolean
   */
  verifyTransactionDescriptions(transactions: Transaction[], expectedDescriptions: string[]): boolean {
    const transactionDescriptions = transactions.map(t => t.description);
    return expectedDescriptions.every(desc => 
      transactionDescriptions.some(td => td.includes(desc))
    );
  }
}

