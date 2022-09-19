import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export function headers(additional?: AxiosRequestConfig, additionalHeaders?: AxiosRequestHeaders): AxiosRequestConfig {
    return {
        headers: {
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/99.0.1150.30',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
            dnt: '1',
            ...additionalHeaders,
        },
        ...additional,
    };
}

export function parseRegex(text: string): string {
    return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

String.prototype.normalizeJid = function (): string {
    return this.replace(/\:[0-9]{1,2}/, '');
};