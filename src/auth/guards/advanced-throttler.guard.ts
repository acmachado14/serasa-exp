import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class AdvancedThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    return Promise.resolve(`${ip}-${userAgent}`);
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    { limit, ttl }: { limit: number; ttl: number },
  ): Promise<void> {
    const segundosRestantes = Math.ceil(ttl / 1000);
    throw new ThrottlerException(
      `Limite de ${limit} requisições excedido. Por favor, aguarde ${segundosRestantes} segundos antes de tentar novamente.`,
    );
  }
}
