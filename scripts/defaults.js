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
                    { ...groups.other, nestId: 'activations_other' },
                ],

            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.skills'),
                groups: [
                    { ...groups.stats, nestId: 'skills_stats' },
                    { ...groups.skills, nestId: 'skills_skills' },
                    { ...groups.bonds, nestId: 'skills_bonds' },
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.macros, nestId: 'utility_macros' },
                ]
            },
            {
                nestId: 'statuses',
                id: 'statuses',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.statuses'),
                groups: [
                    { ...groups.statuses, nestId: 'statuses_statuses' }
                ]
            }
        ],
        groups: groupsArray
    }
})
