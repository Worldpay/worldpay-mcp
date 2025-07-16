import { z } from 'zod';
import { server } from '../../server.js';
import fetch from 'node-fetch';

const name = 'startTest';
const description = 'Start a test window';
const inputSchema = {
  token: z.string().describe('token to authenticate with'),
};

export default function addTool_startTest() {
  server.tool(name, description, inputSchema,
    async (params) => {
      try {
        const token = params.token as string
        const useCaseId = '10f527e6-9b01-4f44-be37-5821cdaf7085'
        const testCaseId = '66e6b296-7bd9-4667-8d66-0be599f9489a'

        const headers = {
          accept: 'application/vnd.worldpay.integration-v1.hal+json',
          'content-type': 'application/vnd.worldpay.integration-v1.hal+json',
          Cookie: `integration-accelerator-id-token=${token}`,
        }

        const payload = { useCaseId, testCaseId }
        const url = 'https://integration.try.access.worldpay.com/tests'

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (response.status !== 201) {
          throw new Error('Failed to start test')
        }

        const responseBody:any = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: `Test ${responseBody.id} has been started successfully.`,
            },
          ],
        }
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `An error occurred: ${(error as Error).message}`,
          }],
        };
      }
    },
  );
}
