// System Module Imports
import { ACTION_TYPE, ACTIVATION_TYPE, ENTRY_TYPE, ID_DELIMITER, ITEM_TYPE, NPC_FEATURE_TYPE, STAT_TYPE } from './constants.js'

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
        pilot = null

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
                if (this.actor.system.pilot) {
                    this.pilot = this.actor.system.pilot.value
                }
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
                    this.#buildPilotActions()
                    break
                case ENTRY_TYPE.PILOT:
                    this.#buildPilotActions()
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
            //this.#buildBasics()
            //this.#buildCombat()
            //this.#buildFrame()
            //this.#buildMacros()
            this.#buildStats()
            this.#buildStatuses()
            if (this.showUnequippedItems) {
                this.#buildInventory(this.items)
                const pilotItems = coreModule.api.Utils.sortItemsByName(this.pilot.items)
                this.#buildInventory(pilotItems)
            } else {
                this.#buildMechLoadout()
                this.#buildPilotLoadout()
            }
        }

        /**
         * Build multiple token actions TODO
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
            //this.#buildBasics()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build npc actions TODO
         * @private
         */
        #buildNpcActions() {
            //this.#buildBasics()
            //this.#buildCombat()
            //this.#buildMacros()
            this.#buildNpcFeatures()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build pilot actions
         * @private
         */
        #buildPilotActions () {
            // Build pilot-specific actions
            //this.#buildSkillTriggers()

            // Following actions already built by #buildMechActions if true
            if (this.pilot) return

            if (this.showUnequippedItems) {
                this.#buildInventory(this.items)
            } else {
                this.#buildPilotLoadout()
            }
            
            //this.#buildBasics()
            //this.#buildCombat()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build activations
         * @private
         * @param {object} items the items
         */
        #buildActivations (items, itemType = '') {
            if (items.size === 0) return

            const activationsMap = new Map()

            const nonActivations = [
                'None',
                'Passive',
                'Other',
            ]

            for (const [key, value] of items) {
                const activations = value.system.actions
                for (const index of activations.keys()) {
                    const activationType = activations[index].activation
                    if (!this.showItemsWithoutActivations && nonActivations.includes(activationType)) continue

                    if (!activationsMap.has(activationType)) activationsMap.set(activationType, new Map())
                    const activationId = `system.actions.${index}`
                    const id = [key, activationId].join(ID_DELIMITER)
                    activationsMap.get(activationType).set(id, activations[index])

                }
            }

            for (const [type, typeMap] of activationsMap) {
                const groupId = ACTIVATION_TYPE[type]?.groupId
                const actionTypeId = ITEM_TYPE[itemType]?.actionType ?? ACTIVATION_TYPE[type]?.actionType

                if (!groupId || !actionTypeId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([id, data]) => {
                    const name = data.name
                    const actionType = 'activation'
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionType, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue,
                    }
                }).sort(this.#sortActionsByName)
                
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build activations
         * @private
         * @param {object} bonds the map of bonds
         */
        #buildBonds (bonds) {
            if (bonds.size === 0) return

            const actionTypeId = ITEM_TYPE[ENTRY_TYPE.BOND]?.actionType
            const groupId = ITEM_TYPE[ENTRY_TYPE.BOND]?.groupId

            if (!groupId || !actionTypeId) return

            const groupData = { id: groupId, type: 'system' }

            // Get actions
            let actions = []
            for (const [bondId, bondData] of bonds) {
                const powers = bondData.system.powers
                for (const index of powers.keys()) {
                    const power = powers[index]
                    if (!power.unlocked) continue
                    if (!this.showItemsWithoutUses && power.uses && power.uses.value === 0) continue

                    const id = [bondId, index].join(ID_DELIMITER)
                    const name = bondData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    actions.push({
                        id,
                        name,
                        listName,
                        encodedValue,
                    })
                }
            }

            actions.sort(this.#sortActionsByName)
            
            this.addActions(actions, groupData)
        }

        /**
         * Build inventory
         * @private
         */
        #buildInventory (items = null) {
            const inventory = items ?? this.items
            if (inventory.size === 0) return

            const inventoryMap = new Map()

            for (const [itemId, itemData] of inventory) {
                const type = itemData.system.type ?? itemData.type

                if (this.#isUsableItem(itemData)) {
                    const typeMap = inventoryMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    inventoryMap.set(type, typeMap)
                }
            }
            
            for (const [type, typeMap] of inventoryMap) {
                // Systems are pretty much only activations
                switch (type) {
                    case ENTRY_TYPE.BOND:
                        this.#buildBonds(typeMap)
                        break
                    case ENTRY_TYPE.MECH_WEAPON:
                    case ENTRY_TYPE.PILOT_WEAPON:
                    case ENTRY_TYPE.WEAPON_MOD:
                        this.#buildWeapons(typeMap, type)
                        break
                    case ENTRY_TYPE.TALENT:
                        this.#buildTalents(typeMap)
                        break
                    default:
                        break
                }
                this.#buildActivations(typeMap, type)
            }

        }

        /**
         * Build mech loadout
         * @private
         */
        #buildMechLoadout () {
            if (!this.actor?.system?.loadout) return
            
            const weaponsMap = new Map()
            const weaponModsMap = new Map()

            // Iterate through loadout rather than items
            const systems = this.actor.system.loadout.systems
            const systemsMap = new Map(systems.map(s => [s.id, s.value]))

            const mounts = this.actor.system.loadout.weapon_mounts

            for (const mount of mounts) {
                if (mount.slots.length === 0) continue

                mount.slots.map(s => {
                    if (s.weapon && this.#isUsableItem(s.weapon.value)) {
                        weaponsMap.set(s.weapon.id, s.weapon.value)
                    }
                    if (s.mod && this.#isUsableItem(s.mod.value)) {
                        weaponModsMap.set(s.mod.id, s.mod.value)
                    }
                })
            }

            // Systems are pretty much only activations
            this.#buildWeapons(weaponsMap, ENTRY_TYPE.MECH_WEAPON)
            this.#buildActivations(weaponsMap, ENTRY_TYPE.MECH_WEAPON)
            this.#buildWeapons(weaponModsMap, ENTRY_TYPE.WEAPON_MOD)
            this.#buildActivations(weaponModsMap, ENTRY_TYPE.WEAPON_MOD)
            this.#buildActivations(systemsMap, ENTRY_TYPE.MECH_SYSTEM)
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
         * Build pilot loadout
         * @private
         */
        #buildPilotLoadout () {
            const pilot = this.pilot ?? this.actor
            if (pilot.items.size === 0) return

            const loadoutMap = new Map()
            const items = coreModule.api.Utils.sortItemsByName(pilot.items)

            for (const [key, value] of items) {
                if (!value.system.equipped) continue

                loadoutMap.set(key, value)
            }

            

            this.#buildInventory(loadoutMap)
        }

        /**
         * Build stats
         * @private
         */
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
                const hasStat = this.actors.every((actor) => actor.system[key] !== undefined)
                if (!hasStat) return

                const id = path
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
            }).filter(action => action !== undefined)

            const groupData = { id: 'stats', type: 'system' }
            this.addActions(actions, groupData)
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
         * Build talents
         * @private
         * @param {object} items Map of talents
         */
        #buildTalents (items) {
            if (items.size === 0) return

            const actionTypeId = ITEM_TYPE[ENTRY_TYPE.TALENT]?.actionType
            const activationsMap = new Map()

            const nonActivations = [
                'None',
                'Passive',
                'Other',
            ]

            for (const [key, value] of items) {
                const curr_rank = value.system.curr_rank
                for (const rank = 0; rank < curr_rank; rank++) {
                    const talent = value.system.ranks[rank]
                    talent.actions.map((action, index) => {
                        const activationType = action.activation
                        if (!this.showItemsWithoutActivations && nonActivations.includes(activationType)) return

                        if (!activationsMap.has(activationType)) activationsMap.set(activationType, new Map())
                        const activationId = `system.ranks.${rank}.actions.${index}`
                        const id = [key, activationId].join(ID_DELIMITER)
                        activationsMap.get(activationType).set(id, action)
                    })
                }
            }

            for (const [type, typeMap] of activationsMap) {
                const groupId = ACTIVATION_TYPE[type]?.groupId

                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([id, data]) => {
                    const name = data.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionType, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue,
                    }
                }).sort(this.#sortActionsByName)
                
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build weapons
         * @private
         * @param {object} items Map of weapons
         * @param {string} type Type of weapon
         */
        #buildWeapons (items, type) {
            if (items.size === 0) return

            const actionTypeId = ITEM_TYPE[type]?.actionType
            const groupId = ITEM_TYPE[type]?.groupId

            if (!groupId || !actionTypeId) return

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
         * Is usable item (weapons, systems, or npc features)
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
                case ENTRY_TYPE.WEAPON_MOD:
                    if (!this.showDestroyedItems && item.system.destroyed) return false
                case ENTRY_TYPE.PILOT_WEAPON:
                    if (!this.showUnloadedWeapons && item.isLoading() && !item.system.loaded) return false
                    if (!this.showItemsWithoutUses && item.isLimited() && !item.system.uses.value) return false
                    break
                default:
                    return false
            }

            return true
        }

        /**
         * Sort by name callback for actions array
         * @private
         * @param {object} a 
         * @param {object} b
         * @returns {number}
         */
        #sortActionsByName(a, b) {
            if (a.name === b.name) return 0

            return a.name < b.name ? -1 : 1
        }
    }
})