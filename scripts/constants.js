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
export const REQUIRED_CORE_MODULE_VERSION = '2.0'

/**
 * Action types
 */
export const ACTION_TYPE = {
    activate: 'tokenActionHud.lancer.activate',
    activation: 'tokenActionHud.lancer.activation',
    add_combatant: 'tokenActionHud.lancer.add_combatant',
    'basic-attack': 'tokenActionHud.lancer.basicAttack',
    'basic-tech': 'tokenActionHud.lancer.basicTech',
    bond: 'tokenActionHud.lancer.bond',
    core: 'tokenActionHud.lancer.core',
    deactivate: 'tokenActionHud.lancer.deactivate',
    frame: 'tokenActionHud.lancer.frame',
    'free-action': 'tokenActionHud.lancer.freeAction',
    'full-action': 'tokenActionHud.lancer.fullAction',
    'full-tech': 'tokenActionHud.lancer.fullTech',
    hide_token: 'tokenActionHud.lancer.hide_token',
    invade: 'tokenActionHud.lancer.invade',
    other: 'tokenActionHud.lancer.other',
    'pilot-weapon': 'tokenActionHud.lancer.pilotWeapon',
    'quick-action': 'tokenActionHud.lancer.quickAction',
    'quick-tech': 'tokenActionHud.lancer.quickTech',
    protocol: 'tokenActionHud.lancer.protocol',
    reaction: 'tokenActionHud.lancer.reaction',
    remove_combatant: 'tokenActionHud.lancer.remove_combatant',
    reveal_token: 'tokenActionHud.lancer.reveal_token',
    stat: 'tokenActionHud.lancer.stat',
    status: 'tokenActionHud.lancer.status',
    system: 'tokenActionHud.lancer.system',
    talent: 'tokenActionHud.lancer.talent',
    tech: 'tokenActionHud.lancer.tech',
    weapon: 'tokenActionHud.lancer.weapon'
}

export const ACTIVATION_TYPE = {
    "None": { groupId: 'other-actions', actionType: 'other' },
    "Passive": { groupId: 'other-actions', actionType: 'other' },
    "Quick": { groupId: 'quick-actions', actionType: 'quick-action' },
    "Quick Tech": { groupId: 'quick-techs', actionType: 'quick-tech' },
    "Invade": { groupId: 'invades', actionType: 'invade' },
    "Full": { groupId: 'full-actions', actionType: 'full-action' },
    "Full Tech": { groupId: 'full-techs', actionType: 'full-tech' },
    "Other": { groupId: 'other-actions', actionType: 'other' },
    "Reaction": { groupId: 'reactions', actionType: 'reaction' },
    "Protocol": { groupId: 'protocols', actionType: 'protocol' },
    "Free": { groupId: 'free-actions', actionType: 'free-action' },
}

export const DEFAULT_ACTION_NAME = "New action"
export const NO_ACTION_NAME = "Action"

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
    fullTechs: { id: 'full-techs', name: 'tokenActionHud.lancer.fullTechs', type: 'system' },
    grit: { id: 'grit', name: 'tokenActionHud.lancer.grit', type: 'system' },
    hase: { id: 'hase', name: 'tokenActionHud.lancer.hase', type: 'system' },
    invades: { id: 'invades', name: 'tokenActionHud.lancer.invades', type: 'system' },
    macros: { id: 'macros', name: 'tokenActionHud.lancer.macros', type: 'system' },
    mechWeapons: { id: 'mech-weapons', name: 'tokenActionHud.lancer.mechWeapons', type: 'system' },
    other: { id: 'other', name: 'tokenActionHud.lancer.other', type: 'system' },
    pilotGear: { id: 'pilot-gear', name: 'tokenActionHud.lancer.pilotGear', type: 'system' },
    pilotWeapons: { id: 'pilot-weapons', name: 'tokenActionHud.lancer.pilotWeapons', type: 'system' },
    protocols: { id: 'protocols', name: 'tokenActionHud.lancer.protocols', type: 'system' },
    quickActions: { id: 'quick-actions', name: 'tokenActionHud.lancer.quickActions', type: 'system' },
    quickTechs: { id: 'quick-techs', name: 'tokenActionHud.lancer.quickTechs', type: 'system' },
    reactions: { id: 'reactions', name: 'tokenActionHud.lancer.reactions', type: 'system' },
    refresh: { id: 'refresh', name: 'tokenActionHud.lancer.refresh', type: 'system' },
    repair: { id: 'repair', name: 'tokenActionHud.lancer.repair', type: 'system' },
    skills: { id: 'skills', name: 'tokenActionHud.lancer.skills', type: 'system' },
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

export const ITEM_TYPE = {
    bond: { groupId: 'bonds', actionType: 'bond' },
    frame: { groupId: 'traits', actionType: 'activation' },
    mech_system: { groupId: 'mech-systems', actionType: 'system' },
    mech_weapon: { groupId: 'mech-weapons', actionType: 'weapon' },
    pilot_weapon: { groupId: 'pilot-weapons', actionType: 'pilot-weapon' },
    skill: { groupId: 'skills', actionType: 'skill' },
    stat: { groupId: 'stats', actionType: 'stat' },
    talent: { groupId: 'talents', actionType: 'talent' },
    weapon_mod: { groupId: 'weapon-mods', actionType: 'system' },
}

export const MACRO_TYPE = {
    'full-repair': 'tokenActionHud.lancer.fullRepair',
    overcharge: 'tokenActionHud.lancer.overcharge',
    overheat: 'tokenActionHud.lancer.overheat',
    recharge: 'tokenActionHud.lancer.recharge',
    stabilize: 'tokenActionHud.lancer.stabilize',
    structure: 'tokenActionHud.lancer.structure',
}


export const NPC_FEATURE_TYPE = {
    Reaction: { groupId: 'reactions', actionType: 'system' },
    System: { groupId: 'systems', actionType: 'system' },
    Tech: { groupId: 'techs', actionType: 'tech'},
    Trait: { groupId: 'traits', actionType: 'system' },
    Weapon: { groupId: 'mech-weapons', actionType: 'weapon' },
}

// Test change to group based on tags.
export const NPC_TAG_TYPE = {
/*    "None": { groupId: 'other-actions', actionType: 'other' },
    "Passive": { groupId: 'other-actions', actionType: 'other' },
    "Quick": { groupId: 'quick-actions', actionType: 'quick-action' },
    "Quick Tech": { groupId: 'quick-techs', actionType: 'quick-tech' },
    "Invade": { groupId: 'invades', actionType: 'invade' },
    "Full": { groupId: 'full-actions', actionType: 'full-action' },
    "Full Tech": { groupId: 'full-techs', actionType: 'full-tech' },
    "Other": { groupId: 'other-actions', actionType: 'other' },
    "Reaction": { groupId: 'reactions', actionType: 'reaction' },
    "Protocol": { groupId: 'protocols', actionType: 'protocol' },
    "Free": { groupId: 'free-actions', actionType: 'free-action' },
*/
    tg_full_action: { groupId: 'full-actions', actionType: 'system' },
    tg_quick_action: { groupId: 'quick-actions', actionType: 'system' },
    tg_quick_tech: { groupId: 'quick-techs', actionType: 'tech' },
    tg_full_tech: { groupId: 'full-techs', actionType: 'tech' },
    tg_reaction: { groupId: 'reactions', actionType: 'system' },
    tg_protocol: { groupId: 'protocols', actionType: 'system' },
    tg_free_action: { groupId: 'free-actions', actionType: 'system' },
}


export const STAT_TYPE = {
    hull: 'tokenActionHud.lancer.hul',
    agi: 'tokenActionHud.lancer.agi',
    sys: 'tokenActionHud.lancer.sys',
    eng: 'tokenActionHud.lancer.eng',
    grit: 'tokenActionHud.lancer.grit',
    tier: 'tokenActionHud.lancer.tier',
}