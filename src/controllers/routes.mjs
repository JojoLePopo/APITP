import Users from './users.mjs';
import Albums from './Albums.mjs';
import Photos from './Photos.mjs';
import authMiddleware from '../middleware/auth.mjs';
import limiter from '../middleware/limiter.mjs';
import authRoutes from '../routes/auth.mjs';

class Routes {
  constructor(app, db) {
    app.use(limiter);
    authRoutes(app, db);

    new Albums(app, db, authMiddleware);
    new Photos(app, db, authMiddleware);
    new Users(app, db, authMiddleware);
  }
}

export default Routes;