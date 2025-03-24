import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly requestCounter: Counter;
  private readonly authCounter: Counter;
  private readonly statusCounter: Counter;
  private readonly responseTimeHistogram: Histogram;
  private readonly endpointCounter: Counter;
  private readonly activeUsersGauge: Gauge;
  private activeUsers = new Set<string>();

  constructor() {
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
    });
    this.authCounter = new Counter({
      name: 'auth_requests_total',
      help: 'Total number of auth requests',
    });
    this.statusCounter = new Counter({
      name: 'http_status_codes_total',
      help: 'Total number of HTTP responses by status code',
      labelNames: ['status_code'],
    });
    this.responseTimeHistogram = new Histogram({
      name: 'http_response_time_seconds',
      help: 'Response time in seconds',
      labelNames: ['method', 'path', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });
    this.endpointCounter = new Counter({
      name: 'http_requests_per_endpoint_total',
      help: 'Total number of HTTP requests per endpoint',
      labelNames: ['method', 'path'],
    });
    this.activeUsersGauge = new Gauge({
      name: 'active_users_total',
      help: 'Number of active users in the last 5 minutes',
    });

    setInterval(
      () => {
        this.activeUsersGauge.set(this.activeUsers.size);
        this.activeUsers.clear();
      },
      5 * 60 * 1000
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();
    res.on('finish', () => {
      this.countRequest();
      this.countAuthRequest(req, res);
      this.countStatusCode(res);
      this.metricResponseTime(req, res, start);
      this.countEndpoint(req);
      this.trackActiveUser(req);
    });

    next();
  }

  private countRequest() {
    this.requestCounter.inc();
  }

  private countAuthRequest(req: Request, res: Response) {
    if (
      !req.path.includes('/auth') ||
      (res.statusCode !== 200 && res.statusCode !== 201)
    ) {
      return;
    }

    this.authCounter.inc();
  }

  private countStatusCode(res: Response) {
    this.statusCounter.labels(res.statusCode.toString()).inc();
  }

  private metricResponseTime(
    req: Request,
    res: Response,
    start: [number, number]
  ) {
    const end = process.hrtime(start);
    const responseTimeInMs = end[0] * 1000 + end[1] / 1000000;
    this.responseTimeHistogram
      .labels(req.method, req.path, res.statusCode.toString())
      .observe(responseTimeInMs / 1000);
  }

  private countEndpoint(req: Request) {
    this.endpointCounter.labels(req.method, req.path).inc();
  }

  private trackActiveUser(req: Request) {
    if (req.headers.authorization) {
      const user = req['user'] as any;
      if (user) {
        this.activeUsers.add(user.id);
      }
    }
  }
}
