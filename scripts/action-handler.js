// System Module Imports
import { ACTION_TYPE, ACTIVATION_TYPE, DEFAULT_ACTION_NAME, ENTRY_TYPE, ID_DELIMITER, ITEM_TYPE, MACRO_TYPE, NO_ACTION_NAME, NPC_FEATURE_TYPE, NPC_TAG_TYPE, STAT_TYPE } from './constants.js'
import { Utils } from './utils.js'

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
        showUnchargedNpcFeatures = null
        showUnequippedItems = null
        showUnloadedWeapons = null

        // Initialize groupIds variables
        groupIds = null
        nonActivations = null

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
                this.pilot = this.actor.system.pilot ? this.actor.system.pilot.value : null
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            // Set settings variables
            this.showDestroyedItems = Utils.getSetting('showDestroyedItems')
            this.showItemsWithoutActivations = Utils.getSetting('showItemsWithoutActivations')
            this.showItemsWithoutUses = Utils.getSetting('showItemsWithoutUses')
            this.showUnequippedItems = Utils.getSetting('showUnequippedItems')
            this.showUnchargedNpcFeatures = Utils.getSetting('showUnchargedNpcFeatures')
            this.showUnloadedWeapons = Utils.getSetting('showUnloadedWeapons')

            this.groupIds = groupIds

            this.nonActivations = [
                'None',
                'Passive',
                'Other',
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

            // TODO: Find a way to handle multiple token actions at once
            //if (!this.actor) {
            //    this.#buildMultipleTokenActions()
            //}
        }

        /**
         * Build mech actions
         * @private
         */
        #buildMechActions () {
            this.#buildBasics()
            this.#buildCombat()
            this.#buildMacros()
            this.#buildStats()
            this.#buildStatuses()
            if (this.showUnequippedItems) {
                this.#buildInventory()
                const pilotItems = coreModule.api.Utils.sortItemsByName(this.pilot.items)
                this.#buildInventory(pilotItems)
            } else {
                this.#buildMechLoadout()
                this.#buildPilotLoadout()
            }
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
            this.#buildBasics()
            this.#buildCombat()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build npc actions
         * @private
         */
        #buildNpcActions() {
            this.#buildBasics()
            this.#buildCombat()
            this.#buildMacros()
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

            // Following actions already built by #buildMechActions if true
            if (this.pilot) return

            if (this.showUnequippedItems) {
                this.#buildInventory()
            } else {
                this.#buildPilotLoadout()
            }
            
            this.#buildBasics()
            this.#buildCombat()
            this.#buildStats()
            this.#buildStatuses()
        }

        /**
         * Build sub activations
         * @private
         * @param {object} actions The actions
         * @param {string} itemId The item id
         * @param {string} [itemType=''] The list type of item
         * @param {string} [dataPath='system.actions'] The path for the activation flow
         */
        #buildSubActions (actions, itemId, itemType = '', dataPath = 'system.actions') {
            if (actions.length === 0) return

            const activationsMap = new Map()

            for (const index of actions.keys()) {
                const activationType = actions[index].activation
                if (!this.showItemsWithoutActivations && this.nonActivations.includes(activationType)) continue

                if (!activationsMap.has(activationType)) activationsMap.set(activationType, new Map())

                const activationId = `${dataPath}.${index}`
                const id = [itemId, activationId].join(ID_DELIMITER)
                const name = actions[index].name === DEFAULT_ACTION_NAME || actions[index].name === NO_ACTION_NAME ? this.items.get(itemId).name : actions[index].name
                const activation = {...actions[index], name}
                activationsMap.get(activationType).set(id, activation)
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
         * Build item activations
         * @private
         * @param {object} items the items
         * @param {string} [itemType=''] The list type of item
         */
        #buildItemActions (items, itemType = '') {
            if (items.size === 0) return

            const activationsMap = new Map()

            for (const [key, value] of items) {
                const activations = value.system.actions
                for (const index of activations.keys()) {
                    const activationType = activations[index].activation
                    if (!this.showItemsWithoutActivations && this.nonActivations.includes(activationType)) continue

                    if (!activationsMap.has(activationType)) activationsMap.set(activationType, new Map())

                    const activationId = `system.actions.${index}`
                    const id = [key, activationId].join(ID_DELIMITER)
                    const name = activations[index].name === DEFAULT_ACTION_NAME || activations[index].name === NO_ACTION_NAME ? value.name : activations[index].name
                    const activation = {...activations[index], name}
                    activationsMap.get(activationType).set(id, activation)
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
         * Build basic actions
         * @private
         */
        #buildBasics () {
            if (this.tokens?.length === 0) return

            const actionType = 'basic'

            const basics = [
                { key: 'basic-attack', type: 'weapon' },
                { key: 'basic-tech', type: 'tech' },
            ]

            basics.map(b => {
                const id = b.key
                const name = coreModule.api.Utils.i18n(ACTION_TYPE[b.key])
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[b.type])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = [b.key, actionType].join(this.delimiter)

                const actions = [{
                    id,
                    name,
                    listName,
                    encodedValue,
                }]
                const groupData = { id, type: 'system' }
                this.addActions(actions, groupData)
            })
        }

        /**
         * Build bonds
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
                    const name =  power.name
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

                const id = bondId
                const name = `Refresh ${bondData.name}`
                const listName = `Refresh: ${bondData.name}`
                const encodedValue = ['refresh-powers', bondId].join(this.delimiter)

                actions.push({
                    id,
                    name,
                    listName,
                    encodedValue,
                })
            }

            actions.sort(this.#sortActionsByName)
            
            this.addActions(actions, groupData)
        }

        /**
         * Build combat
         * @private
         */
        #buildCombat () {
            if (this.tokens?.length === 0) return

            const groupId = 'combat'

            const combat = [
                'activate',
                'deactivate',
            ]

            combat.map(c => {
                const id = c
                const name = coreModule.api.Utils.i18n(ACTION_TYPE[c])
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[groupId])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = [groupId, id].join(this.delimiter)

                const actions = [{
                    id,
                    name,
                    listName,
                    encodedValue,
                }]
                const groupData = { id: groupId, type: 'system' }
                this.addActions(actions, groupData)
            })
        }

        /**
         * Build frame traits and core active
         * @private
         * @param {object} items The items
         */
        #buildFrame (items) {
            if (items.size === 0) return

            const actionTypeId = 'frame'

            for (const [key, value] of items) {
                const activeActions = value.system.core_system.active_actions
                const passiveActions = value.system.core_system.passive_actions
                const traits = value.system.traits                                          
                this.#buildSubActions(activeActions, key, actionTypeId, 'system.core_system.active_actions')
                this.#buildSubActions(passiveActions, key, actionTypeId, 'system.core_system.passive_actions')
                this.#buildSubActions(traits, key, '', 'system.traits')
            
                const id = [key, 'system.core_system'].join(ID_DELIMITER)
                const name = value.system.core_system.active_name
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[ENTRY_TYPE.FRAME])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = ['core', id].join(this.delimiter)

                const actions = [{
                    id,
                    name,
                    listName,
                    encodedValue,
                }]
                const groupData = { id: 'core-power', type: 'system' }
                this.addActions(actions, groupData)
                
            }
        }

        /**
         * Build inventory
         * @private
         * @param {null} [items=null] The items
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
                    case ENTRY_TYPE.FRAME:
                        this.#buildFrame(typeMap)
                        break
                    case ENTRY_TYPE.MECH_WEAPON:
                    case ENTRY_TYPE.PILOT_WEAPON:
                    case ENTRY_TYPE.WEAPON_MOD:
                        this.#buildWeapons(typeMap, type)
                    case ENTRY_TYPE.MECH_SYSTEM:
                        this.#buildItemActions(typeMap, type)
                        break
                    case ENTRY_TYPE.SKILL:
                        this.#buildSkills(typeMap)
                        break
                    case ENTRY_TYPE.TALENT:
                        this.#buildTalents(typeMap)
                        break
                    default:
                        break
                }
            }

        }

        /**
         * Build macros
         * @private
         */
        #buildMacros () {
            if (this.actors?.length === 0) return

            const actionType = 'macro'
            const groupId = 'macros'

            const macros = [
                'stabilize',
                'full-repair',
                'structure',
                'overheat',
            ]

            if (this.actors.every(a => a.type === ENTRY_TYPE.MECH)) {
                macros.push('overcharge')
            }

            if (this.actors.every(a => a.type === ENTRY_TYPE.NPC)) {
                macros.push('recharge')
            }

            macros.map(m => {
                const id = m
                const name = coreModule.api.Utils.i18n(MACRO_TYPE[m])
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                const encodedValue = [m, 'none'].join(this.delimiter)

                const actions = [{
                    id,
                    name,
                    listName,
                    encodedValue,
                }]
                const groupData = { id: groupId, type: 'system' }
                this.addActions(actions, groupData)
            })
        }

        /**
         * Build mech loadout
         * @private
         */
        #buildMechLoadout () {
            const loadout = this.actor?.system?.loadout
            if (!loadout) return
            
            const weaponsMap = new Map()
            const weaponModsMap = new Map()

            // Iterate through loadout rather than items
            const systems = loadout.systems
            const systemsMap = new Map(systems.map(s => [s.id, s.value]))
            const frame = loadout.frame
            const frameMap = new Map([[frame.id, frame.value]])

            const mounts = loadout.weapon_mounts

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
            this.#buildItemActions(weaponsMap, ENTRY_TYPE.MECH_WEAPON)
            this.#buildWeapons(weaponModsMap, ENTRY_TYPE.WEAPON_MOD)
            this.#buildItemActions(weaponModsMap, ENTRY_TYPE.WEAPON_MOD)
            this.#buildItemActions(systemsMap, ENTRY_TYPE.MECH_SYSTEM)
            this.#buildFrame(frameMap)
        }

/**
 * Build npc features
 * @private
 */
#buildNpcFeatures () {
    if (this.items.size === 0) return

    const featuresMap = new Map()

    for (const [itemId, itemData] of this.items) {
        const tags = Array.isArray(itemData.system.tags) ? itemData.system.tags : []
        let matched = false

        // Generate a feature for each matching tag
        for (const tag of tags) {
            const tagData = NPC_TAG_TYPE[tag.lid]
            if (tagData) {
                matched = true
                const { groupId, actionType } = tagData
                const list = featuresMap.get(groupId) ?? []
                list.push({ id: itemId, data: itemData, actionType })
                featuresMap.set(groupId, list)
            }
        }

        // Fallback to type logic if no tags matched
        if (!matched) {
            const type = itemData.system.type
            const typeGroup = NPC_FEATURE_TYPE[type]
            if (!typeGroup) continue
            const { groupId, actionType } = typeGroup
            const list = featuresMap.get(groupId) ?? []
            list.push({ id: itemId, data: itemData, actionType })
            featuresMap.set(groupId, list)
        }
    }

    for (const [groupId, entries] of featuresMap) {
        const groupData = { id: groupId, type: 'system' }

        const actions = entries.map(({ id, data, actionType }) => {
            const name = data.name
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
         * Build skills
         * @private
         * @param {object} items The items
         */
        #buildSkills (items) {
            if (items.size === 0) return

            const actionTypeId = ITEM_TYPE[ENTRY_TYPE.SKILL]?.actionType
            const groupId = ITEM_TYPE[ENTRY_TYPE.SKILL]?.groupId

            if (!groupId || !actionTypeId) return

            const groupData = { id: groupId, type: 'system' }
            const skills = coreModule.api.Utils.sortItemsByName(items)

            // Get actions
            const actions = [...skills].map(([skillId, skillData]) => {
                const id = skillId
                const name = skillData.name
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
         * Build stats
         * @private
         */
        #buildStats () {
            const actionType = ITEM_TYPE['stat']?.actionType
            const groupId = ITEM_TYPE['stat']?.groupId

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

            const groupData = { id: groupId, type: 'system' }
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
                const name = coreModule.api.Utils.i18n(status.name) ?? status.name
                const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? ''
                const listName = `${actionTypeName}${name}`
                const encodedValue = [actionType, id].join(this.delimiter)
                const active = this.actors.every((actor) => {
                    if (game.version.startsWith('12')) {
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

            for (const [key, value] of items) {
                const curr_rank = value.system.curr_rank
                for (let rank = 0; rank < curr_rank; rank++) {
                    const talent = value.system.ranks[rank]
                    talent.actions.map((action, index) => {
                        const activationType = action.activation
                        if (!this.showItemsWithoutActivations && this.nonActivations.includes(activationType)) return

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
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

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
                case ENTRY_TYPE.BOND:
                case ENTRY_TYPE.TALENT:
                case ENTRY_TYPE.SKILL:
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