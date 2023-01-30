import { CoreActionHandler, CoreUtils, Logger } from './config.js'

export class ActionHandler extends CoreActionHandler {
    // Initialize actor and token variables
    actor = null;
    actors = null;
    actorId = null;
    actorType = null;
    character = null;
    token = null;
    tokenId = null;

    mm = null

    /**
     * Build System Actions
     * @override
     * @param {object} character
     * @param {array} subcategoryIds
     * @returns {object}
     */
    async buildSystemActions(character, subcategoryIds) {
        // Set actor and token variables
        this.actor = character?.actor;
        this.token = character?.token;
        if (!this.token || !this.actor) return;

        this.actorId = this.actor.id;
        this.actorType = this.actor.type;
        this.tokenId = this.token.id;

        this.mm = await this.actor.system.derived.mm;

        switch (this.actorType) {
            case "pilot":
                this._buildPilotCategory(this.mm);
                // this._combineCategoryWithList(
                //     result,
                //     CoreUtils.i18n("tokenActionHud.lancer.pilot"),
                //     this._pilotCategory(mm, actorId)
                // );
                break;
            case "mech":
                this._buildPilotCategory(this.mm.Pilot);
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.lancer.pilot"),
        //             this._pilotCategory(mm.Pilot, mm.Pilot.RegistryID)
        //         );
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.lancer.mech"),
        //             this._mechCategory(mm, actorId)
        //         );
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.weapons"),
        //             this._weaponsCategory(mm.Loadout.WepMounts, actorId)
        //         );
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.lancer.systems"),
        //             this._systemsCategory(mm.Loadout.SysMounts, actorId)
        //         );
        //         break;
        //     case "npc":
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.lancer.stats"),
        //             this._npcBaseCategory(actor, actorId)
        //         );
        //         this._combineCategoryWithList(
        //             result,
        //             CoreUtils.i18n("tokenActionHud.features"),
        //             this._npcFeatureCategory(actor, actorId)
        //         );
        //         break;
        }

        // if (settings.get("showHudTitle")) result.hudTitle = token.name;
    }

    _buildPilotCategory(mm) {
        this._buildSkillsTriggersSubCategory(mm);
        this._buildGritSubCategory(mm);
        this._buildTalentsSubCategory(mm);
        // this._buildPilotGearSubCategory();
        // this._buildPilotWeaponSubCategory();
    }

    _makeAction(actionName, actionType, actorId, actionId, option) {
        const action = {
            "name": actionName,
            "encodedValue": [
                actionType,
                actorId,
                actionId,
                JSON.stringify(option ? option : {}),
            ].join(this.delimiter)
        }
        return action;
    }

    _makeActionsFromItems(actorId, itemType, mm) {
        let macro = "item";
        const actions = mm
            .filter((item) => {
                if (item != null) return item.Type === itemType;
            })
            .map((item) => {
                return this._makeAction(item.Name, macro, actorId, item.RegistryID);
            });

        return actions;
    }

    _makeNPCItemSubCat(name, itemType, actor, actorId) {
        let result = this.initializeEmptySubcategory();
        let macro = "item";

        result.name = name;
        result.actions = actor.items
            .filter((item) => {
                if (item != null) return item.type === "npc_feature";
            })
            .filter((item) => {
                return item.system.type === itemType;
            })
            .map((item) => {
                return this._makeAction(item.name, macro, actorId, item.id);
            });
        return result;
    }

    _pilotCategory() {



        return result;
    }

    _npcBaseCategory(actor, actorId) {
        let result = this.initializeEmptyCategory("mech");

        [this._haseSubCategory(actorId)].forEach((subCat) => {
            this._combineSubcategoryWithCategory(result, subCat.name, subCat);
        });

        return result;
    }

    _npcFeatureCategory(actor, actorId) {
        let result = this.initializeEmptyCategory("feature");

        [
            this._npcWeaponSubCat(actor, actorId),
            this._npcTechSubCat(actor, actorId),
            this._npcReactionSubCat(actor, actorId),
            this._npcSystemSubCat(actor, actorId),
            this._npcTraitSubCat(actor, actorId),
        ].forEach((subCat) => {
            this._combineSubcategoryWithCategory(result, subCat.name, subCat);
        });

        return result;
    }

    _npcWeaponSubCat(actor, actorId) {
        let weaponSubCat = this._makeNPCItemSubCat(
            CoreUtils.i18n("tokenActionHud.weapons"),
            "Weapon",
            actor,
            actorId
        );

        let basicAttack = this._makeAction(
            CoreUtils.i18n("tokenActionHud.lancer.basicAttack"),
            "stat",
            actorId,
            "basicattack"
        );
        weaponSubCat.actions.push(basicAttack);

        return weaponSubCat
    }

    _npcTraitSubCat(actor, actorId) {
        return this._makeNPCItemSubCat(
            CoreUtils.i18n("tokenActionHud.traits"),
            "Trait",
            actor,
            actorId
        );
    }

    _npcSystemSubCat(actor, actorId) {
        return this._makeNPCItemSubCat(
            CoreUtils.i18n("tokenActionHud.lancer.systems"),
            "System",
            actor,
            actorId
        );
    }

    _npcTechSubCat(actor, actorId) {
        let techSubCat = this._makeNPCItemSubCat(
            CoreUtils.i18n("tokenActionHud.lancer.techs"),
            "Tech",
            actor,
            actorId
        );

        let basicTechAttack = this._makeAction(
            CoreUtils.i18n("tokenActionHud.lancer.techAttack"),
            "stat",
            actorId,
            "techattack"
        );
        techSubCat.actions.push(basicTechAttack)

        return techSubCat;
    }

    _npcReactionSubCat(actor, actorId) {
        return this._makeNPCItemSubCat(
            CoreUtils.i18n("tokenActionHud.reactions"),
            "Reaction",
            actor,
            actorId
        );
    }

    _buildSkillsTriggersSubCategory(mm) {
        let actorId = mm.RegistryID;
        const actions = this._makeActionsFromItems(actorId, "skill", mm._skills);

        // Create subcategory data
        const subcategoryData = { id: 'skill-triggers', type: 'system' }

        // Add actions to action list
        this.addActionsToActionList(actions, subcategoryData)
    }

    _buildGritSubCategory(mm) {
        let actorId = mm.RegistryID;
        const actions = [this._makeAction(CoreUtils.i18n("tokenActionHud.lancer.grit"), "stat", actorId, "Grit")];

        // Create subcategory data
        const subcategoryData = { id: 'grit', type: 'system' }

        // Add actions to action list
        this.addActionsToActionList(actions, subcategoryData)
    }

    _buildTalentsSubCategory(mm) {
        let actorId = mm.RegistryID;
        let macro = "item";
        let parentSubcategoryData = { id: 'talents', type: 'system', hasDerivedSubcategories: true }

        let talent_iterator = 1;
        mm._talents
            .filter((item) => {
                if (item != null) return item.Type === "talent";
            })
            .map((talent) => {
                console.log(talent.Name);
                const subcat = {
                    id: `pilot-talent-${talent.RegistryID}`,
                    name: talent.Name,
                    type: "system-derived"
                };
                console.log(subcat);

                this.addSubcategoryToActionList(parentSubcategoryData, subcat);

                const actions = [];
                for (let i = 0; i < talent.CurrentRank; i++) {
                    let option = { rank: `${i}` };
                    console.log(talent.Ranks[i].Name);
                    actions.push(this._makeAction(
                        `${CoreUtils.i18n("tokenActionHud.lancer.rank")} ${i + 1}: ${talent.Ranks[i].Name}`,
                        macro,
                        actorId,
                        talent.RegistryID,
                        option
                    ));
                }
                this.addActionsToActionList(actions, subcat);
                talent_iterator++;
            });
    }

    _pilotWeaponSubCategory(mm, actorId) {
        return this._makeItemSubCat(
            CoreUtils.i18n("tokenActionHud.weapons"),
            "pilot_weapon",
            mm.Loadout.Weapons,
            actorId
        );
    }

    _pilotGearSubCategory(mm, actorId) {
        return this._makeItemSubCat(
            CoreUtils.i18n("tokenActionHud.lancer.gear"),
            "pilot_gear",
            mm.Loadout.Gear,
            actorId
        );
    }

    _mechCategory(mm, actorId) {
        let result = this.initializeEmptyCategory("mech");

        [
            this._haseSubCategory(actorId),
            this._frameSubCategory(mm, actorId),
            this._coreBonSubCategory(mm, actorId),
            this._corePowerSubCategory(mm.Loadout.Frame, actorId),
        ].forEach((subCat) => {
            this._combineSubcategoryWithCategory(result, subCat.name, subCat);
        });

        return result;
    }

    _haseSubCategory(actorId) {
        let result = this.initializeEmptySubcategory();
        let macro = "hase";

        result.id = "hase";
        result.name = CoreUtils.i18n("tokenActionHud.lancer.hase");

        let hull = CoreUtils.i18n("tokenActionHud.lancer.hull");
        let agility = CoreUtils.i18n("tokenActionHud.attribute.agility");
        let systems = CoreUtils.i18n("tokenActionHud.lancer.systems");
        let engineering = CoreUtils.i18n("tokenActionHud.lancer.engineering");

        let haseActionData = [
            { name: hull, id: "Hull" },
            { name: agility, id: "Agi" },
            { name: systems, id: "Sys" },
            { name: engineering, id: "Eng" },
        ];

        let haseActions = haseActionData.map((actionData) => {
            return this._makeAction(actionData.name, macro, actorId, actionData.id);
        });

        result.actions = haseActions;

        return result;
    }

    _basicSubCategory(actorId) {
        let result = this.initializeEmptySubcategory();
        let macro = "stat";

        result.id = "stat";
        result.name = CoreUtils.i18n("tokenActionHud.lancer.basic");

        let basicAttack = CoreUtils.i18n("tokenActionHud.lancer.basicAttack");
        let techAttack = CoreUtils.i18n("tokenActionHud.lancer.techAttack");

        let statActionData = [
            { name: basicAttack, data: "basicattack" },
            { name: techAttack, data: "techattack" },
        ];

        let statActions = statActionData.map((actionData) => {
            return this._makeAction(actionData.name, macro, actorId, actionData.data);
        });

        result.actions = statActions;

        return result;
    }

    _frameSubCategory(mm, actorId) {
        let result = this.initializeEmptySubcategory();
        let overchargeSequence = ["+1", "+1d3", "+1d6", "+1d6 + 4"];
        let overchargeCount = Math.min(mm.OverchargeCount, overchargeSequence.length - 1);

        result.id = "frame";
        result.name = CoreUtils.i18n("tokenActionHud.lancer.frame");

        let overchargeText = CoreUtils.i18n("tokenActionHud.lancer.overcharge") + " (" + overchargeSequence[overchargeCount] + ")";

        result.actions = [
            this._makeAction(overchargeText, "frame", actorId, "overcharge"),
            this._makeAction(CoreUtils.i18n("tokenActionHud.lancer.stabilize"), "frame", actorId, "stabilize")
        ];

        return result;
    }

    _coreBonSubCategory(mm, actorId) {
        let result = this.initializeEmptySubcategory();
        let coreBonus = mm.Pilot.CoreBonuses;
        result.name = "Core Bonuses";
        result.actions = coreBonus.map((bonus) => {
            let option = {};
            option.pilot = mm.Pilot.RegistryID;
            return this._makeAction(
                bonus.Name,
                "coreBonus",
                actorId,
                bonus.RegistryID,
                option
            );
        });
        return result;
    }

    _corePowerSubCategory(frame, actorId) {
        let result = this.initializeEmptySubcategory();

        let core = frame.CoreSystem;

        result.name = core.Name;

        if (core.PassiveName != "Core Passive") {
            result.actions.push(
                this._makeAction(core.PassiveName, "corePassive", actorId, "")
            );
        }
        if (core.ActiveName) {
            result.actions.push(
                this._makeAction(core.ActiveName, "coreActive", actorId, "")
            );
        }

        return result;
    }

    _weaponsCategory(WepMounts, actorId) {
        let result = this.initializeEmptyCategory();
        let macro = "item";

        result.id = "weapons";
        result.name = CoreUtils.i18n("tokenActionHud.weapons");

        let itemSubCats = WepMounts.map((mount, i) => {
            let subcat = this.initializeEmptySubcategory("Mount_" + i);
            subcat.name = mount.MountType;

            subcat.actions = mount.Slots.filter((slot) => slot.Weapon !== null).map(
                (slot) => {
                    return this._makeAction(
                        slot.Weapon.Name,
                        macro,
                        actorId,
                        slot.Weapon.RegistryID
                    );
                }
            );

            return subcat;
        });

        itemSubCats = [this._basicSubCategory(actorId)].concat(itemSubCats);

        itemSubCats.forEach((subCat) => {
            this._combineSubcategoryWithCategory(result, subCat.name, subCat);
        });

        return result;
    }

    _systemsCategory(loadout, actorId) {
        let result = this.initializeEmptyCategory();
        let macro = "item";

        result.id = "systems";
        result.name = CoreUtils.i18n("tokenActionHud.lancer.systems");

        let itemSubCats = loadout
            .flatMap((mount) => mount.System)
            .map((system) => {
                let subcat = this.initializeEmptySubcategory(system.RegistryID);
                subcat.name = system.Name;

                let activations = system.Actions.map((action, i) => {
                    let option = {};
                    option.Type = "Action";
                    option.Index = i;
                    return this._makeAction(
                        action.Name,
                        "activation",
                        actorId,
                        system.RegistryID,
                        option
                    );
                });

                let deployables = system.Deployables.map((deployable, i) => {
                    let option = {};
                    option.Type = "Deployable";
                    option.Index = i;
                    return this._makeAction(
                        deployable.Name,
                        "activation",
                        actorId,
                        system.RegistryID,
                        option
                    );
                });

                subcat.actions = activations.concat(deployables);

                return subcat;
            });

        itemSubCats.forEach((subCat) => {
            this._combineSubcategoryWithCategory(result, subCat.name, subCat);
        });

        return result;
    }
}
