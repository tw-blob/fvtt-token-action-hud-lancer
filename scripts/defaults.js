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
                nestId: 'pilot',
                id: 'pilot',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.pilot'),
                groups: [
                    { ...groups.skills, nestId: 'pilot_skills' },
                    { ...groups.grit, nestId: 'pilot_grit' },
                    { ...groups.talents, nestId: 'pilot_talents' },
                    { ...groups.pilotGear, nestId: 'pilot_pilot-gear' },
                    { ...groups.pilotWeapons, nestId: 'pilot_pilot-weapons' },
                ]
            },
            {
                nestId: 'mech',
                id: 'mech',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.mech'),
                groups: [
                    { ...groups.hase, nestId: 'mech_hase' },
                    { ...groups.frameTraits, nestId: 'mech_frame-traits' },
                    { ...groups.coreBonuses, nestId: 'mech_core-bonuses' },
                    { ...groups.corePower, nestId: 'mech_core-power' },
                ]
            },
            {
                nestId: 'weapon',
                id: 'weapon',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.weapon'),
                groups: [
                    { ...groups.mount1, nestId: 'weapon_mount-1' },
                    { ...groups.mount2, nestId: 'weapon_mount-2' },
                    { ...groups.mount3, nestId: 'weapon_mount-3' },
                    { ...groups.attacks, nestId: 'weapon_attacks' },
                ]
            },
            {
                nestId: 'system',
                id: 'system',
                name: coreModule.api.Utils.i18n('tokenActionHud.lancer.system'),
                groups: [
                    { ...groups.techs, nestId: 'system_techs' },
                    { ...groups.systemActions, nestId: 'system_systemActions' },
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
                    { ...groups.statuses, nestId: 'status_status' }
                ]
            }
        ],
        groups: groupsArray
    }
})
