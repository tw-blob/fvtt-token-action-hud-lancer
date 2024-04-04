// System Module Imports
import { ACTION_TYPE, ENTRY_TYPE, NPC_FEATURE_TYPE, STAT_TYPE, WEAPON_TYPE } from './constants.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
    * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
    */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        // Initialize actor and token variables
        actors = null
        tokens = null
        actorType = null

        // Initialize items variable
        items = null

        // Initialize setting variables
        showDestroyedItems = null
        showItemsWithoutActivations = null
        showItemsWithoutUses = null
        showNpcFeaturesWithoutActivations = null
        showUnchargedNpcFeatures = null
        showUnequippedItems = null
        showUnloadedWeapons = null
        showUsedCorePower = null

        // Initialize groupIds variables
        groupIds = null
        activationgroupIds = null
        systemGroupIds = null
        statGroupIds = null
        npcFeatureIds = null

        // Initialize action variables
        featureActions = null

        /**
         * Build System Actions
         * @override
         * @param {array} groupIds
         * @returns {object}
         */
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this.#getActors() : [this.actor]
            this.tokens = (!this.token) ? this.#getTokens() : [this.token]
            this.actorType = this.actor?.type
            
            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            // Set settings variables TODO
            //this.showDestroyedItems = Utils.getSetting('showDestroyedItems')
            //this.showItemsWithoutActivations = Utils.getSetting('showItemsWithoutActivations')
            //this.showItemsWithoutUses = Utils.getSetting('showItemsWithoutUses')
            //this.showNpcFeaturesWithoutActivations = Utils.getSetting('showNpcFeaturesWithoutActivations')
            //this.showUnequippedItems = Utils.getSetting('showUnequippedItems')
            //this.showUnchargedNpcFeatures = Utils.getSetting('showUnchargedNpcFeatures')
            //this.showUnloadedWeapons = Utils.getSetting('showUnloadedWeapons')
            //this.showUsedCorePower = Utils.getSetting('showUsedCorePower')

            this.groupIds = groupIds

            this.activationgroupIds = [
                'quick-actions',
                'full-actions',
                'reactions',
                'protocols',
                'free-actions',
                'quick-tech',
                'full-tech',
            ]

            this.systemGroupIds = [
                'actions',
                'deployables',
                'techs'
            ]

            this.npcFeatureIds = [
                'techs',
                'systems',
                'weapons',
                'traits',
            ]

            switch (this.actorType) {
                case ENTRY_TYPE.MECH:
                    this.#buildMechActions()
                    this.#buildPilotActions(this.actor.pilot)
                    break
                case ENTRY_TYPE.PILOT:
                    this.#buildPilotActions(this.actor)
                    break
                case ENTRY_TYPE.NPC:
                    this.#buildNpcActions()
                    break
                default:
                    break
            }

            if (!this.actor) {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Build mech actions
         * @private
         */
        #buildMechActions () {
            this.#buildStats()
            this.#buildStatuses()
            this.#buildWeaponMounts()
        }

        /**
         * Build multiple token actions TODO
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build npc actions TODO
         * @private
         */
        #buildNpcActions() {
            this.#buildNpcFeatures()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build pilot actions
         * @private
         * @param {object} pilot the pilot
         */
        #buildPilotActions (pilot) {
            //this.#buildPilotInventory()
            //this.#buildPilotStats()
            this.#buildStats()
            this.#buildStatuses()
        }

        #buildStats () {
            const actionType = 'stat'

            const stats = {
                hull: 'system.hull',
                agi: 'system.agi',
                sys: 'system.sys',
                eng: 'system.eng',
                grit: 'system.grit',
                tier: 'system.tier',
            }

            const actions = Object.entries(stats).map(([key, path]) => {
                if (!this.actor.system[key]) return

                const name = coreModule.api.Utils.i18n(STAT_TYPE[key])
                const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? ''
                const listName = `${actionTypeName}${name}`
                const encodedValue = [actionType, path].join(this.delimiter)

                return {
                    id,
                    name,
                    listName,
                    encodedValue,
                }
            })

            const groupData = { id: 'stats', type: 'system' }
            this.addActions(actions, groupData)
        }

        /**
         * Build npc features
         * @private
         */
        #buildNpcFeatures () {
            if (this.items.size === 0) return

            const featuresMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.system.type
                
                if (this.#isUsableItem(itemData)) {
                    const typeMap = featuresMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    featuresMap.set(type, typeMap)
                }
            }
            
            for (const [type, typeMap] of featuresMap) {
                const groupId = NPC_FEATURE_TYPE[type]?.groupId

                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([id, data]) => {
                    const name = data.name
                    const actionType = NPC_FEATURE_TYPE[type]?.actionType
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionType, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue,
                    }
                })
                
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build statuses and conditions
         * @private
         */
        #buildStatuses () {
            if (this.tokens?.length === 0) return

            const actionType = 'status'

            // Get statuses
            const statuses = CONFIG.statusEffects.filter((status) => status.id !== '')

            // Exit if no statuses exist
            if (statuses.length === 0) return

            // Get actions
            const actions = statuses.map((status) => {
                const id = status.id
                const name = coreModule.api.Utils.i18n(status.label) ?? status.name
                const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? ''
                const listName = `${actionTypeName}${name}`
                const encodedValue = [actionType, id].join(this.delimiter)
                const active = this.actors.every((actor) => {
                    if (game.version.startsWith('11')) {
                        return actor.effects.some(effect => effect.statuses.some(status => status === id) && !effect?.disabled)
                    } else {
                        // V10
                        return actor.effects.some(effect => effect.flags?.core?.statusId === id && !effect?.disabled)
                    }
                })
                    ? ' active'
                    : ''
                const cssClass = `toggle${active}`
                const img = coreModule.api.Utils.getImage(status)
                return {
                    id,
                    name,
                    encodedValue,
                    img,
                    cssClass,
                    listName,
                }
            })

             // Create group data
             const groupData = { id: 'statuses', type: 'system' }

             // Add actions to HUD
             this.addActions(actions, groupData)
        }

        /**
         * Build weapon mounts
         * @private
         */
        #buildWeaponMounts () {
            const weaponsMap = new Map()
            const weaponModsMap = new Map()

            // Iterate through loadout rather than items
            const mounts = this.actor.system.loadout.weapon_mounts

            for (const mount of mounts) {
                if (mount.slots.length === 0) continue

                mount.slots.map(({weapon, mod}) => {
                    if (weapon) {
                        weaponsMap.set(weapon._id, weapon)
                    }
                    if (mod) {
                        weaponModsMap.set(mod._id, mod)
                    }
                })
            }

            this.#buildWeapons(weaponsMap, ENTRY_TYPE.MECH_WEAPON)
            this.#buildWeaponMods(weaponModsMap)
        }

        /**
         * Build weapons
         * @private
         * @param {object} items Map of weapons
         * @param {string} type Type of weapon
         */
        #buildWeapons (items, type) {
            if (items.size === 0) return

            const actionTypeId = 'weapon'
            const groupId = ITEM_TYPE[type]?.groupId

            if (!groupId) return

            const groupData = { id: groupId, type: 'system' }
            const weapons = coreModule.api.Utils.sortItemsByName(items)

            // Get actions
            const actions = [...weapons].map(([weaponId, weaponData]) => {
                const id = weaponId
                const name = weaponData.name
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = [actionTypeId, id].join(this.delimiter)

                return {
                    id,
                    name,
                    listName,
                    encodedValue,
                }
            })
            
            this.addActions(actions, groupData)
        }

        /**
         * Build weapons
         * @private
         */
        #buildWeapons1 () {
            if (this.items.size === 0) return

            const actionTypeId = 'weapon'
            const weaponsMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                
                if (this.#isUsableItem(itemData)) {
                    if (itemData.is_weapon()) {
                        const typeMap = weaponsMap.get(type) ?? new Map()
                        typeMap.set(itemId, itemData)
                        weaponsMap.set(type, typeMap)
                    }
                }
            }
            
            for (const [type, typeMap] of weaponsMap) {
                const groupId = WEAPON_TYPE[type]?.groupId

                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([weaponId, weaponData]) => {
                    const id = weaponId
                    const name = weaponData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue,
                    }
                })
                
                this.addActions(actions, groupData)
            }
        }

        /**
         * Get actors
         * @private
         * @returns {object}
         */
        #getActors () {
            const allowedTypes = ['deployable', 'mech', 'npc', 'pilot']
            const tokens = coreModule.api.Utils.getControlledTokens()
            const actors = tokens?.filter(token => token.actor).map((token) => token.actor)
            if (actors.every((actor) => allowedTypes.includes(actor.type))) {
                return actors
            } else {
                return []
            }
        }

        /**
         * Get tokens
         * @private
         * @returns {object}
         */
        #getTokens () {
            const allowedTypes = ['deployable', 'mech', 'npc', 'pilot']
            const tokens = coreModule.api.Utils.getControlledTokens()
            const actors = tokens?.filter(token => token.actor).map((token) => token.actor)
            if (actors.every((actor) => allowedTypes.includes(actor.type))) {
                return tokens
            } else {
                return []
            }
        }

        /**
         * Is usable item
         * @private
         * @param {object} item The item
         * @returns {boolean}
         */
        #isUsableItem (item) {
            switch (item.type) {
                case ENTRY_TYPE.NPC_FEATURE:
                    if (!this.showUnchargedNpcFeatures && item.isRecharge() && !item.system.charged) return false
                case ENTRY_TYPE.MECH_SYSTEM:
                case ENTRY_TYPE.MECH_WEAPON:
                    if (!this.showUnloadedWeapons && item.isLoading() && !item.system.loaded) return false
                    if (!this.showItemsWithoutUses && item.isLimited() && !item.system.uses.value) return false
                    if (!this.showDestroyedItems && item.system.destroyed) return false
                default:
                    break
            }
            
            return true
        }
    }
})