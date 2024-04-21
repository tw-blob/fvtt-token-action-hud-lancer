import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} updateFunc Token Action HUD Core update function
 */
export function register (updateFunc) {
    game.settings.register(MODULE.ID, 'showDestroyedItems', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showDestroyedItems.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showDestroyedItems.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(MODULE.ID, 'showItemsWithoutActivations', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showItemsWithoutActivations.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showItemsWithoutActivations.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(MODULE.ID, 'showItemsWithoutUses', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showItemsWithoutUses.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showItemsWithoutUses.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(MODULE.ID, 'showUnequippedItems', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnequippedItems.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnequippedItems.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(MODULE.ID, 'showUnchargedNpcFeatures', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnchargedNpcFeatures.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnchargedNpcFeatures.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(MODULE.ID, 'showUnloadedWeapons', {
        name: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnloadedWeapons.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.lancer.settings.showUnloadedWeapons.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })
}