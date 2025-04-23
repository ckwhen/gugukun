import axios, { AxiosRequestConfig } from 'axios';
import { UserId } from './domain/entities';
import { IHttpClient, ILineMessenger } from './domain/interfaces';
import { LineChannelAccessToken } from './types';

export class AxiosHttpClientAdapter implements IHttpClient {
  async post<T>(url: string, data: unknown, configs?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post<T>(url, data, configs);

    return response.data;
  }
}

export class LineMessageAdapter implements ILineMessenger {
  private readonly api: string = 'https://api.line.me/v2/bot/message/push';

  constructor(
    private readonly accessToken: LineChannelAccessToken,
    private readonly httpClient: IHttpClient
  ) {}

  async sendMessage(userId: UserId, message: string): Promise<void>  {
    await this.httpClient.post(
        this.api,
        {
          to: userId,
          messages: [{ type: 'text', text: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  }
}
