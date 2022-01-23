// import {
//   BadGatewayException,
//   Injectable,
//   NestMiddleware,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class ValidateUserMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     try {
//       if (res?.locals?.user) return next();
//     } catch (error) {
//       throw new BadGatewayException(error);
//     }
//   }
// }
