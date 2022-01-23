// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { PublicKeyEnum } from 'src/enum/key.enum';
// import { JwtService } from 'src/utils/jwt.utils';

// @Injectable()
// export class DescrializeUserMiddleware implements NestMiddleware {
//   constructor(private readonly jwtService: JwtService) {}
//   use(req: Request, res: Response, next: NextFunction) {
//     const accessToken = (req.headers.authorization || '').replace(
//       /^Bearer\s/,
//       '',
//     );
//     if (!accessToken) return next();

//     const decoded = this.jwtService.verifyJwt(
//       accessToken,
//       PublicKeyEnum.ACCESS_PUBLIC_TOKEN,
//     );

//     if (decoded) res.locals.user = decoded;

//     return next();
//   }
// }
