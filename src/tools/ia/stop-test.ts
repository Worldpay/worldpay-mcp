import {z} from 'zod';
import {BaseTool} from "./base-tool.js";


export class StopTestTool extends BaseTool {
  static name = "stopTest";
  static description = "Stop a test window";
  static inputSchema = {
    testId: z.string().describe('id of test to stop'),
    token: z.string().describe('token to authenticate with'),
  };

  static async handle(params: { testId: string; token: string }) {
    try {
      const {testId, token} = params;
      const headers = {
        accept: 'application/vnd.worldpay.integration-v1.hal+json',
        'content-type': 'application/vnd.worldpay.integration-v1.hal+json',
        Cookie: `integration-accelerator-id-token=${token}`,
      };
      const payload = {status: 'Finished'};
      const url = `https://integration.try.access.worldpay.com/tests/${testId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.status !== 200) {
        throw new Error('Failed to stop test');
      }

      const responseBody:any = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Test ${testId} has been stopped successfully. data: ${JSON.stringify(responseBody)}`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `An error occurred: ${(error as Error).message}`,
          },
        ],
      };
    }
  }
}
