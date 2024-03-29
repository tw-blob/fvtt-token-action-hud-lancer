/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-lancer'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.5'

/**
 * Action types
 */
export const ACTION_TYPE = {
    weapon: 'tokenActionHud.lancer.weapon',
}

/**
 * Groups
 */
export const GROUP = {
    attacks: { id: 'attacks', name: 'tokenActionHud.lancer.attacks', type: 'system' },
    bonds: { id: 'bonds', name: 'tokenActionHud.lancer.bonds', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.lancer.combat', type: 'system' },
    coreBonuses: { id: 'core-bonuses', name: 'tokenActionHud.lancer.coreBonuses', type: 'system' },
    corePower: { id: 'core-power', name: 'tokenActionHud.lancer.corePower', type: 'system' },
    deployables: { id: 'deployables', name: 'tokenActionHud.lancer.deployables', type: 'system' },
    grit: { id: 'grit', name: 'tokenActionHud.lancer.grit', type: 'system' },
    hase: { id: 'hase', name: 'tokenActionHud.lancer.hase', type: 'system' },
    mechWeapons: { id: 'mech-weapons', name: 'tokenActionHud.lancer.mechWeapons', type: 'system' },
    pilotGear: { id: 'pilot-gear', name: 'tokenActionHud.lancer.pilotGear', type: 'system' },
    pilotWeapons: { id: 'pilot-weapons', name: 'tokenActionHud.lancer.pilotWeapons', type: 'system' },
    repair: { id: 'repair', name: 'tokenActionHud.lancer.repair', type: 'system' },
    skillTriggers: { id: 'skill-triggers', name: 'tokenActionHud.lancer.skillTiggers', type: 'system' },
    statuses: { id: 'statuses', name: 'tokenActionHud.lancer.status', type: 'system' },
    systems: { id: 'systems', name: 'tokenActionHud.lancer.systems', type: 'system' },
    talents: { id: 'talents', name: 'tokenActionHud.lancer.talents', type: 'system' },
    techs: { id: 'techs', name: 'tokenActionHud.lancer.techs', type: 'system' },
    traits: { id: 'traits', name: 'tokenActionHud.lancer.traits', type: 'system' },
    weaponMods: { id: 'weapon-mods', name: 'tokenActionHud.lancer.weapon-mods', type: 'system' },
}

export const ENTRY_TYPE = {
    CORE_BONUS: 'core_bonus',
    DEPLOYABLE: 'deployable',
    FRAME: 'frame',
    MECH: 'mech',
    LICENSE: 'license',
    NPC: 'npc',
    NPC_CLASS: 'npc_class',
    NPC_TEMPLATE: 'npc_template',
    NPC_FEATURE: 'npc_feature',
    WEAPON_MOD: 'weapon_mod',
    MECH_SYSTEM: 'mech_system',
    MECH_WEAPON: 'mech_weapon',
    ORGANIZATION: 'organization',
    PILOT_ARMOR: 'pilot_armor',
    PILOT_GEAR: 'pilot_gear',
    PILOT_WEAPON: 'pilot_weapon',
    PILOT: 'pilot',
    RESERVE: 'reserve',
    SKILL: 'skill',
    STATUS: 'status',
    TALENT: 'talent',
    BOND: 'bond',
}

export const NPC_FEATURE_TYPE = {
    system: { groupId: 'system-actions' },
}

export const WEAPON_TYPE = {
    npc_feature: { groupId: 'mech-weapons' },
    mech_wepon: { groupId: 'mech-weapons' },
    pilot_weapon: { groupId: 'pilot-weapons' },
}
