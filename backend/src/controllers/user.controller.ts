import Koa from 'koa';
import Router from 'koa-router';
import jsonwebtoken from 'jsonwebtoken';

import User from '../models/User';

export interface LoginDetails {
  username: string;
  password: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/public',
};

const router: Router = new Router(routerOpts);

router.post('/login', async (ctx: Koa.Context) => {
  let b: LoginDetails = ctx.request.body;
  if (b.username && b.password) {
    console.log(b);
    ctx.body = {
      token: jsonwebtoken.sign(
        {
          data: ctx.request.body,
          exp: Math.floor(Date.now() / 1000) - 60 * 60, // 60 seconds * 60 minutes = 1 hour
        },
        'secret',
      ),
    };
  }
});

export default router;
