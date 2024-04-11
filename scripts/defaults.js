import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'attacks',
                id: 'attacks',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.attacks'),
                groups: [
                    { ...groups.mechWeapons, nestId: 'attacks_mech-weapons' },
                    { ...groups.weaponMods, nestId: 'attacks_weapon-mods' },
                    { ...groups.pilotWeapons, nestId: 'attacks_pilot-weapons' },
                    { ...groups.basicAttack, nestId: 'attacks_basic-attack' },
                ],
            },
            {
                nestId: 'techs',
                id: 'techs',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.techs'),
                groups: [
                    { ...groups.quickTechs, nestId: 'techs_quick-techs' },
                    { ...groups.fullTechs, nestId: 'techs_full-techs' },
                    { ...groups.invades, nestId: 'techs_invades' },
                    { ...groups.basicTech, nestId: 'techs_basic-tech' },
                ],
            },
            {
                nestId: 'activations',
                id: 'activations',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.activations'),
                groups: [
                    { ...groups.corePower, nestId: 'activations_core-power' },
                    { ...groups.protocols, nestId: 'activations_protocols' },
                    { ...groups.quickActions, nestId: 'activations_quick-actions' },
                    { ...groups.fullActions, nestId: 'activations_full-actions' },
                    { ...groups.freeActions, nestId: 'activations_free-actions' },
                    { ...groups.reactions, nestId: 'activations_reactions' },
                    { ...groups.traits, nestId: 'activations_traits' },
                    { ...groups.otherActions, nestId: 'activations_other-actions' },
                ],

            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.skills'),
                groups: [
                    { ...groups.stats, nestId: 'skills_stats' },
                    { ...groups.skillTriggers, nestId: 'skills_skill-triggers' },
                    { ...groups.bonds, nestId: 'skills_bonds' },
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.repair, nestId: 'utility_repair' },
                    { ...groups.refresh, nestId: 'utility_refresh' },
                ]
            },
            {
                nestId: 'statuses',
                id: 'statuses',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.status'),
                groups: [
                    { ...groups.statuses, nestId: 'status_statuses' }
                ]
            }
        ],
        /*layout: [
            {
                nestId: 'pilot',
                id: 'pilot',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.pilot'),
                groups: [
                    { ...groups.skillTriggers, nestId: 'pilot_skill-triggers' },
                    { ...groups.grit, nestId: 'pilot_grit' },
                    { ...groups.talents, nestId: 'pilot_talents' },
                    { ...groups.pilotGear, nestId: 'pilot_pilot-gear' },
                    { ...groups.pilotWeapons, nestId: 'pilot_pilot-weapons' },
                    { ...groups.bonds, nestId: 'pilot_bonds' },
                ]
            },
            {
                nestId: 'mech',
                id: 'mech',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.mech'),
                groups: [
                    { ...groups.hase, nestId: 'mech_hase' },
                    { ...groups.coreBonuses, nestId: 'mech_core-bonuses' },
                    { ...groups.corePower, nestId: 'mech_core-power' },
                    { ...groups.traits, nestId: 'mech_traits' },
                ]
            },
            {
                nestId: 'weapon',
                id: 'weapon',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.weapon'),
                groups: [
                    { ...groups.mechWeapons, nestId: 'weapon_mech-weapons' },
                    { ...groups.weaponMods, nestId: 'weapon_weapon-mods' },
                    { ...groups.attacks, nestId: 'weapon_attacks' },
                ]
            },
            {
                nestId: 'system',
                id: 'system',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.system'),
                groups: [
                    { ...groups.techs, nestId: 'system_techs' },
                    { ...groups.systems, nestId: 'system_systems' },
                    { ...groups.deployables, nestId: 'system_deployables' },
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.repair, nestId: 'utility_repair' }
                ]
            },
            {
                nestId: 'status',
                id: 'status',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.status'),
                groups: [
                    { ...groups.statuses, nestId: 'status_statuses' }
                ]
            }
        ], */
        groups: groupsArray
    }
})
