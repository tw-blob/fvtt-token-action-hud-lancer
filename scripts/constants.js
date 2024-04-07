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
    activation: 'tokenActionHud.lancer.activation',
    system: 'tokenActionHud.lancer.system',
    tech: 'tokenActionHud.lancer.tech',
    weapon: 'tokenActionHud.lancer.weapon',
}

export const ACTIVATION_TYPE = {
    "None": { groupId: 'other-actions' },
    "Passive": { groupId: 'other-actions'},
    "Quick": { groupId: 'quick-actions' },
    "Quick Tech": { groupId: 'quick-techs' },
    "Invade": { groupId: 'invades' },
    "Full": { groupId: 'full-actions' },
    "Full Tech": { groupId: 'full-techs' },
    "Other": { groupId: 'other-actions' },
    "Reaction": { groupId: 'reactions' },
    "Protocol": { groupId: 'protocols' },
    "Free": { groupId: 'free-actions' },
}

/**
 * Groups
 */
export const GROUP = {
    attacks: { id: 'attacks', name: 'tokenActionHud.lancer.attacks', type: 'system' },
    basicAttack: { id: 'basic-attack', name: 'tokenActionHud.lancer.basicAttack', type: 'system' },
    basicTech: { id: 'basic-tech', name: 'tokenActionHud.lancer.basicTech', type: 'system' },
    bonds: { id: 'bonds', name: 'tokenActionHud.lancer.bonds', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.lancer.combat', type: 'system' },
    coreBonuses: { id: 'core-bonuses', name: 'tokenActionHud.lancer.coreBonuses', type: 'system' },
    corePower: { id: 'core-power', name: 'tokenActionHud.lancer.corePower', type: 'system' },
    deployables: { id: 'deployables', name: 'tokenActionHud.lancer.deployables', type: 'system' },
    freeActions: { id: 'free-actions', name: 'tokenActionHud.lancer.freeActions', type: 'system' },
    fullActions: { id: 'full-actions', name: 'tokenActionHud.lancer.fullActions', type: 'system' },
    grit: { id: 'grit', name: 'tokenActionHud.lancer.grit', type: 'system' },
    hase: { id: 'hase', name: 'tokenActionHud.lancer.hase', type: 'system' },
    invades: { id: 'invades', name: 'tokenActionHud.lancer.invades', type: 'system' },
    mechWeapons: { id: 'mech-weapons', name: 'tokenActionHud.lancer.mechWeapons', type: 'system' },
    pilotGear: { id: 'pilot-gear', name: 'tokenActionHud.lancer.pilotGear', type: 'system' },
    pilotWeapons: { id: 'pilot-weapons', name: 'tokenActionHud.lancer.pilotWeapons', type: 'system' },
    protocols: { id: 'protocols', name: 'tokenActionHud.lancer.protocols', type: 'system' },
    quickActions: { id: 'quick-actions', name: 'tokenActionHud.lancer.quickActions', type: 'system' },
    reactions: { id: 'reactions', name: 'tokenActionHud.lancer.reactions', type: 'system' },
    repair: { id: 'repair', name: 'tokenActionHud.lancer.repair', type: 'system' },
    skillTriggers: { id: 'skill-triggers', name: 'tokenActionHud.lancer.skillTriggers', type: 'system' },
    stats: { id: 'stats', name: 'tokenActionHud.lancer.stats', type: 'system' },
    statuses: { id: 'statuses', name: 'tokenActionHud.lancer.statuses', type: 'system' },
    systems: { id: 'systems', name: 'tokenActionHud.lancer.systems', type: 'system' },
    talents: { id: 'talents', name: 'tokenActionHud.lancer.talents', type: 'system' },
    techs: { id: 'techs', name: 'tokenActionHud.lancer.techs', type: 'system' },
    traits: { id: 'traits', name: 'tokenActionHud.lancer.traits', type: 'system' },
    weaponMods: { id: 'weapon-mods', name: 'tokenActionHud.lancer.weaponMods', type: 'system' },
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

export const ID_DELIMITER = '>'

export const NPC_FEATURE_TYPE = {
    Reaction: { groupId: 'reactions', actionType: 'system' },
    System: { groupId: 'systems', actionType: 'system' },
    Tech: { groupId: 'techs', actionType: 'tech'},
    Trait: { groupId: 'traits', actionType: 'system' },
    Weapon: { groupId: 'mech-weapons', actionType: 'weapon' },
}

export const STAT_TYPE = {
    hull: 'tokenActionHud.lancer.hull',
    agi: 'tokenActionHud.lancer.agi',
    sys: 'tokenActionHud.lancer.sys',
    eng: 'tokenActionHud.lancer.eng',
    grit: 'tokenActionHud.lancer.grit',
    tier: 'tokenActionHud.lancer.tier',
}

export const ITEM_TYPE = {
    mech_weapon: { groupId: 'mech-weapons', actionType: 'weapon' },
    pilot_weapon: { groupId: 'pilot-weapons', actionType: 'weapon' },
    weapon_mod: { groupId: 'weapon-mods', actionType: 'weapon' },
}
