import axios, { AxiosRequestConfig } from 'axios';
import type { RequestHandler } from 'express';
import * as line from '@line/bot-sdk';
import type { Logger as WinstonLogger } from 'winston';
import { logger } from './libs/logger';
import { getLineChannel } from './configs';
import { UserId } from './domain/entities';
import {
  IHttpClient,
  ILineMessenger,
  ILogger,
} from './domain/interfaces';
import { LineChannelAccessToken } from './types';
import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';

export class AxiosHttpClientAdapter implements IHttpClient {
  async get<T>(url: string, configs?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get<T>(url, configs);

    return response.data;
  }

  async post<T>(url: string, data: unknown, configs?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post<T>(url, data, configs);

    return response.data;
  }
}

class LineMessageAdapter implements ILineMessenger {
  private readonly api: string = 'https://api.line.me/v2/bot';
  private readonly headers: Record<string, string>;

  constructor(
    private readonly accessToken: LineChannelAccessToken,
    private readonly httpClient: IHttpClient
  ) {
    this.headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getProfile<T>(userId: UserId): Promise<T>  {
    const userProfile = await this.httpClient.get<T>(
        `${this.api}/profile/${userId}`,
        {
          headers: this.headers,
        }
      );

    return userProfile;
  }

  async sendMessage(userId: UserId, message: string): Promise<void>  {
    await this.httpClient.post(
        `${this.api}/message/push`,
        {
          to: userId,
          messages: [{ type: 'text', text: message }],
        },
        {
          headers: this.headers,
        }
      );
  }
}

const lineChannel = getLineChannel();

export function createLineMessageAdapter(): LineMessageAdapter {
  return new LineMessageAdapter(
    lineChannel.accessToken,
    new AxiosHttpClientAdapter()
  );
}

const lineMiddlewareConfig: line.MiddlewareConfig = {
  channelSecret: lineChannel.secret,
};
const lineClientConfig: line.ClientConfig = {
  channelAccessToken: lineChannel.accessToken,
};

export function createLineMiddleware(): RequestHandler {
  return line.middleware(lineMiddlewareConfig);
}

export function createLineClient(): MessagingApiClient {
  return new line.messagingApi.MessagingApiClient(lineClientConfig);
}

class WinstonLoggerAdapter implements ILogger {
  constructor(private readonly logger: WinstonLogger) {}

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(message, meta);
  }
}

export function createLogger(): ILogger {
  return new WinstonLoggerAdapter(logger);
}
