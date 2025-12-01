import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class DeviceFingerprintMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${userAgent}-${ip}-${acceptLanguage}`)
      .digest('hex');

    req['deviceFingerprint'] = fingerprint;
    req['ipAddress'] = ip;
    next();
  }
}

