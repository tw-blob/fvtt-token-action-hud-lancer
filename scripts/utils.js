import { MODULE } from './constants.js'

export let Utils = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    Utils = class Utils {
    /**
     * Get setting value
     * @param {string} key The key
     * @param {string=null} defaultValue The default value
     * @returns The setting value
     */
        static getSetting (key, defaultValue = null) {
            let value = defaultValue ?? null
            try {
                value = game.settings.get(MODULE.ID, key)
            } catch {
                coreModule.api.Logger.debug(`Setting '${key}' not found`)
            }
            return value
        }

        /**
     * Set setting value
     * @param {string} key The key
     * @param {string} value The value
     */
        static async setSetting (key, value) {
            try {
                value = await game.settings.set(MODULE.ID, key, value)
                coreModule.api.Logger.debug(`Setting '${key}' set to '${value}'`)
            } catch {
                coreModule.api.Logger.debug(`Setting '${key}' not found`)
            }
        }
    }
})

/**
 * Logs invalid/null items with actor name and uuid if available.
 * @param {object|null} item - The item to check and log if invalid.
 * @param {object} [actor] - The actor object, if available.
 * @param {string} [context] - Optional context string for log clarity.
 */
export function logInvalidItem(item, actor = null, context = "") {
    if (!item) {
        const actorName = actor?.name || "Unknown Actor";
        const actorUuid = actor?.uuid || "Unknown UUID";
        const ctx = context ? `[${context}] ` : "";
        console.warn(`${ctx}Invalid or null item encountered. Actor: ${actorName}, UUID: ${actorUuid}`, item);
    }
}