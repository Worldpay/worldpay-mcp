import {describe, it, expect, afterEach, vi} from 'vitest';
import {fetchMarkdownSpec} from '../src/resources.js';

describe('fetchMarkdownSpec', () => {
    const testUrl = new URL('https://developer.worldpay.com/products/access/payments/openapi/payment/payment.md');

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns markdown content on successful fetch', async () => {
        const markdownText = '# Payment request';
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue(markdownText),
        } as any);

        const result = await fetchMarkdownSpec(testUrl);

        result.contents.forEach(content => {
            expect(content.mimeType).toEqual('text/markdown')
            expect(content.uri).toEqual(testUrl.href)
            expect(content.text.substring(0, 17)).toEqual("# Payment request")
        })
    });

    it('returns error content when fetch response is not ok', async () => {

        const nonExistentPage = new URL("https://developer.worldpay.com/madeUpUrl.")

        const result = await fetchMarkdownSpec(nonExistentPage);
        expect(result).toEqual({
            contents: [{
                uri: nonExistentPage.href,
                text: 'Error downloading Worldpay markdown spec: Failed to fetch markdown spec: 404 Not Found',
                mimeType: 'text/plain',
            }],
            isError: true,
        });
    });
});