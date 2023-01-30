import { ActionHandler } from './action-handler.js'
import { RollHandler as Core } from './roll-handler.js'
import * as systemSettings from './settings.js'

import { CoreSystemManager, CoreCategoryManager, CoreUtils } from './config.js'
import { DEFAULTS } from './defaults.js'

export class SystemManager extends CoreSystemManager {
    /** @override */
    doGetCategoryManager () {
        return new CoreCategoryManager();
    }

    /** @override */
    doGetActionHandler(categoryManager) {
        let actionHandler = new ActionHandler(categoryManager);
        return actionHandler;
    }

    /** @override */
    getAvailableRollHandlers() {
        let choices = { core: "Core Lancer" };
        return choices;
    }

    /** @override */
    doGetRollHandler(handlerId) {
        return new Core();
    }

    /** @override */
    doRegisterSettings(updateFunc) {
        systemSettings.register(updateFunc);
    }

    /** @override */
    async doRegisterDefaultFlags() {
        const defaults = DEFAULTS;
        await CoreUtils.setUserFlag('default', defaults);
    }
}
