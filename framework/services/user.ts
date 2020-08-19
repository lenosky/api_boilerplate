import { decorateService, ServiceBase } from '../../lib'
import { urls } from '../config';

class User extends ServiceBase {
    constructor(token?: string) {
        super(urls.userService, token);
    }

    getInfo() {
        return this.request.get({ path: '/api/v1/user' })
    }

    getRegistrationInfo(email, username) {
        return this.request.get({ path: '/api/v1/user/registration/info', queries: { email, username } })
    }
}

decorateService(User);

export {
    User
}