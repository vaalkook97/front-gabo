import { HttpInterceptorFn } from '@angular/common/http';

const credentials = btoa('admin:admin123');

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${credentials}`
    }
  });

  return next(authReq);
};
