// For distribution
const coreModulePath = '../../token-action-hud-core/dist/token-action-hud-core.min.mjs'
const coreModule = await import(coreModulePath)
export const CoreActionHandler = coreModule.ActionHandler
export const CoreActionListExtender = coreModule.ActionListExtender
export const CoreCategoryManager = coreModule.CategoryManager
export const CorePreRollHandler = coreModule.PreRollHandler
export const CoreRollHandler = coreModule.RollHandler
export const CoreSystemManager = coreModule.SystemManager
export const CoreUtils = coreModule.Utils
export const Logger = coreModule.Logger