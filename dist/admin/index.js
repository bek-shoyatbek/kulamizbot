import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { Voice } from '../models/voice.model.js';
AdminJS.registerAdapter(AdminJSMongoose);
const adminJs = new AdminJS({
    resources: [Voice],
    rootPath: '/admin',
});
const router = AdminJSExpress.buildRouter(adminJs);
export { adminJs, router };
