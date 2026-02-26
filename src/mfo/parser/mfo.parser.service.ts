import { Injectable } from '@nestjs/common';
import { chromium, Browser } from 'playwright';

@Injectable()
export class MfoParserService {
    private browser: Browser | null = null;

    async parseCompanyPage(slug: string) {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }

        const page = await this.browser.newPage();

        try {
            const url = `https://vsezaimyonline.ru/${slug}`;
            console.log(`🔍 Парсим: ${url}`);

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Раскрываем все аккордеоны
            await page.evaluate(() => {
                document.querySelectorAll('details, .accordion-item').forEach(el => {
                    const summary = el.querySelector('summary, .accordion-title');
                    if (summary instanceof HTMLElement) {
                        summary.click();
                    }
                });
            });

            await page.waitForTimeout(1000);

            const data = await page.evaluate(() => {
                const getText = (selector: string, context: Document | Element = document) =>
                    context.querySelector(selector)?.textContent?.trim() ?? null;

                const getAllTexts = (selector: string, context: Document | Element = document) =>
                    Array.from(context.querySelectorAll(selector))
                        .map(el => el.textContent?.trim())
                        .filter(Boolean) as string[];

                // Main
                const main = {
                    title: getText('h1'),
                    description: getText('.lead-text, .lead-main p'),
                };

                // О компании
                const headings = Array.from(document.querySelectorAll('h2'));
                const aboutIndex = headings.findIndex(h => h.textContent?.toLowerCase().includes('о компании'));
                let aboutCompany = { title: null as string | null, text: '' };

                if (aboutIndex !== -1) {
                    const h2 = headings[aboutIndex];
                    aboutCompany.title = h2.textContent?.trim() ?? null;

                    let current = h2.nextElementSibling as Element | null;
                    while (current && !headings.includes(current as any)) {
                        if (current.tagName === 'P') {
                            const txt = current.textContent?.trim();
                            if (txt) aboutCompany.text += (aboutCompany.text ? '\n\n' : '') + txt;
                        }
                        current = current.nextElementSibling;
                    }
                }

                // Преимущества и недостатки
                const advantages: string[] = [];
                const disadvantages: string[] = [];

                document.querySelectorAll('details, .accordion-item').forEach(el => {
                    const titleEl = el.querySelector('summary, .accordion-title');
                    const title = titleEl?.textContent?.trim().toLowerCase() ?? '';
                    const panel = el.querySelector('.panel, details > div') || el;

                    const items = getAllTexts('li', panel);

                    if (title.includes('преимущества')) advantages.push(...items);
                    if (title.includes('недостатки')) disadvantages.push(...items);
                });

                // Как получить займ
                const howToGetIndex = headings.findIndex(h => h.textContent?.toLowerCase().includes('как получить'));
                let howToGet = { title: null as string | null, steps: [] as string[] };

                if (howToGetIndex !== -1) {
                    const h2 = headings[howToGetIndex];
                    howToGet.title = h2.textContent?.trim() ?? null;
                    const list = h2.parentElement?.querySelector('ol, ul');
                    if (list) howToGet.steps = getAllTexts('li', list);
                }

                // FAQ
                const faq: Array<{ title: string; description: string | null; items: string[] }> = [];
                document.querySelectorAll('details, .accordion-item').forEach(el => {
                    const titleEl = el.querySelector('summary, .accordion-title');
                    const title = titleEl?.textContent?.trim() ?? '';
                    if (!title || title.toLowerCase().includes('преимущества') || title.toLowerCase().includes('недостатки')) return;

                    const panel = el.querySelector('.panel, details > div') || el;
                    const description = getText('p', panel);
                    const items = getAllTexts('li', panel);

                    faq.push({ title, description, items });
                });

                return {
                    main,
                    aboutCompany,
                    advantagesDisadvantages: { advantages, disadvantages },
                    howToGet,
                    faq,
                };
            });

            return data;
        } finally {
            await page.close();
        }
    }
}