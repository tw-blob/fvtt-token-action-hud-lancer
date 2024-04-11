import { ID_DELIMITER } from "./constants"

export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const [actionTypeId, actionId] = encodedValue.split(this.delimiter)

            const renderable = ['weapon']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = ['pilot', 'npc', 'mech', 'deployable']

            // If single actor is selected
            if (this.actor) {
                await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId)
                return
            }

            const controlledTokens = canvas.tokens.controlled
                .filter((token) => knownCharacters.includes(token.actor?.type))

            // If multiple actors are selected
            for (const token of controlledTokens) {
                const actor = token.actor
                await this.#handleAction(event, actor, token, actionTypeId, actionId)
            }
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId) {
            switch (actionTypeId) {
                case 'activation':
                case 'talent':
                    this.#handleActivation(actor, actionId)
                    break
                case 'basic-attack':
                    this.#handleBasicAttack(actor)
                    break
                case 'basic-tech':
                    this.#handleBasicTech(actor)
                    break
                case 'bond':
                    this.#handleBondAction(actor, actionId)
                    break
                case 'combat':
                    this.#handleCombatAction(token, actionId)
                    break
                case 'core':
                    this.#handleCoreAction(actor, actionId)
                    break
                case 'full-repair':
                    this.#handleFullRepair(actor)
                    break
                case 'overcharge':
                    this.#handleOvercharge(actor)
                    break
                case 'overheat':
                    this.#handleOverheat(actor)
                    break
                case 'skill':
                    this.#handleSkillAction(actor, actionId)
                    break
                case 'stat':
                    this.#handleStatAction(actor, actionId)
                    break
                case 'structure':
                    this.#handleStructure(actor)
                    break
                case 'system':
                    this.#handleSystemAction(actor, actionId)
                    break
                case 'tech':
                    this.#handleTechAction(actor, actionId)
                    break
                case 'weapon':
                    this.#handleWeaponAction(actor, actionId)
                    break
            }
        }

        /**
         * Handle item activation
         * @private
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleActivation (actor, actionId) {
            const activationParts = actionId.split(ID_DELIMITER)
            const itemId = activationParts[0]
            const dataPath = activationParts[1]
            const item = actor.items.get(itemId)
            item.beginActivationFlow(dataPath)
        }

        /**
         * Handle basic attack
         * @private
         * @param {object} actor    The actor
         */
        #handleBasicAttack (actor) {
            actor.beginBasicAttackFlow()
        }

        /**
         * Handle basic tech
         * @private
         * @param {object} actor    The actor
         */
        #handleBasicTech (actor) {
            actor.beginBasicTechFlow()
        }

        /**
         * Handle bond action
         * @private
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleBondAction (actor, actionId) {
            const bondParts = actionId.split(ID_DELIMITER)
            const itemId = bondParts[0]
            const powerIndex = bondParts[1]
            const item = actor.items.get(itemId)
            item.beginBondPowerFlow(powerIndex)
        }
        
        /**
         * Handle combat action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleCombatAction (token, actionId) {
            if (!game.combat) return

            const combatant = game.combat?.combatants.find(c => c.token === token)
            if (!combatant) return

            switch (actionId) {
                case 'activate':
                    await game.combat?.activateCombatant(combatant.id)
                    break
                case 'deactivate':
                    await game.combat?.deactivateCombatant(combatant.id)
                    break
            }
        }

        /**
         * Handle core activation
         * @private
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleCoreAction (actor, actionId) {
            const coreParts = actionId.split(ID_DELIMITER)
            const itemId = coreParts[0]
            const dataPath = coreParts[1]
            const item = actor.items.get(itemId)
            item.beginCoreActiveFlow(dataPath)
        }

        /**
         * Handle item action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleItemAction (event, actor, actionId) {
            const item = actor.items.get(actionId)
            item.toChat(event)
        }

        /**
         * Handle full repair
         * @private
         * @param {object} actor    The actor
         */
        #handleFullRepair (actor) {
            actor.beginFullRepairFlow()
        }

        /**
         * Handle overcharge action
         * @private
         * @param {object} actor    The actor
         */
        #handleOvercharge (actor) {
            actor.beginOverchargeFlow()
        }

        /**
         * Handle overcharge action
         * @private
         * @param {object} actor    The actor
         */
        #handleOverheat (actor) {
            actor.beginOverheatFlow()
        }

        /**
         * Handle stat action
         * @private
         * @param {object} actor    The actor
         * @param {string} statPath The stat path
         */
        #handleStatAction(actor, statPath) {
            actor.beginStatFlow(statPath);
        }

        /**
         * Handle skill action
         * @private
         * @param {object} actor    The actor
         * @param {string} itemId   The item id
         */
        #handleSkillAction(actor, itemId) {
            const skill = actor.items.get(itemId)
            skill.beginSkillFlow()
        }

        /**
         * Handle structure
         * @private
         * @param {object} actor    The actor
         */
        #handleStructure (actor) {
            actor.beginStructureFlow()
        }

        /**
         * Handle system action
         * @private
         * @param {object} actor    The actor
         * @param {string} itemId   The item id
         */
        #handleSystemAction(actor, itemId) {
            const system = actor.items.get(itemId)
            system.beginSystemFlow();
        }

        /**
         * Handle tech action
         * @private
         * @param {object} actor    The actor
         * @param {string} itemId   The item id
         */
        #handleTechAction(actor, itemId) {
            const tech = actor.items.get(itemId)
            tech.beginTechAttackFlow();
        }
        
        /**
         * Handle weapon action
         * @private
         * @param {object} actor    The actor
         * @param {string} itemId   The item id
         */
        #handleWeaponAction(actor, itemId) {
            const weapon = actor.items.get(itemId)
            weapon.beginWeaponAttackFlow();
        }
    }
})