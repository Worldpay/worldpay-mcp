import * as queryPayments from '../../../src/tools/payments/query-payments';

describe('query-payments tool', () => {
  it('should be defined', () => {
    expect(queryPayments).toBeDefined();
  });
  it('should handle mocked fetch response in queryPaymentsWithWorldpayHandler', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ _embedded: { payments: [{ transactionReference: 'TR123', status: 'SUCCESS' }] } })
    })) as jest.Mock;
    const dummyParams = { startDate: '2025-09-09T00:00:00Z', endDate: '2025-09-09T23:59:59Z', pageSize: 1 };
    const result = await queryPayments.queryPaymentsWithWorldpayHandler(dummyParams);
    expect(result).not.toHaveProperty('isError');
    (global.fetch as jest.Mock).mockClear();
  });
});
