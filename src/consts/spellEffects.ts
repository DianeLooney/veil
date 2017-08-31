let lookup = [
  'SPELL_EFFECT_NONE',
  'SPELL_EFFECT_INSTAKILL',
  'SPELL_EFFECT_SCHOOL_DAMAGE',
  'SPELL_EFFECT_DUMMY',
  'SPELL_EFFECT_PORTAL_TELEPORT',
  'SPELL_EFFECT_TELEPORT_UNITS_OLD',
  'SPELL_EFFECT_APPLY_AURA',
  'SPELL_EFFECT_ENVIRONMENTAL_DAMAGE',
  'SPELL_EFFECT_POWER_DRAIN',
  'SPELL_EFFECT_HEALTH_LEECH',
  'SPELL_EFFECT_HEAL',
  'SPELL_EFFECT_BIND',
  'SPELL_EFFECT_PORTAL',
  'SPELL_EFFECT_RITUAL_BASE',
  'SPELL_EFFECT_INCREASE_CURRENCY_CAP',
  'SPELL_EFFECT_RITUAL_ACTIVATE_PORTAL',
  'SPELL_EFFECT_QUEST_COMPLETE',
  'SPELL_EFFECT_WEAPON_DAMAGE_NOSCHOOL',
  'SPELL_EFFECT_RESURRECT',
  'SPELL_EFFECT_ADD_EXTRA_ATTACKS',
  'SPELL_EFFECT_DODGE',
  'SPELL_EFFECT_EVADE',
  'SPELL_EFFECT_PARRY',
  'SPELL_EFFECT_BLOCK',
  'SPELL_EFFECT_CREATE_ITEM',
  'SPELL_EFFECT_WEAPON',
  'SPELL_EFFECT_DEFENSE',
  'SPELL_EFFECT_PERSISTENT_AREA_AURA',
  'SPELL_EFFECT_SUMMON',
  'SPELL_EFFECT_LEAP',
  'SPELL_EFFECT_ENERGIZE',
  'SPELL_EFFECT_WEAPON_PERCENT_DAMAGE',
  'SPELL_EFFECT_TRIGGER_MISSILE',
  'SPELL_EFFECT_OPEN_LOCK',
  'SPELL_EFFECT_SUMMON_CHANGE_ITEM',
  'SPELL_EFFECT_APPLY_AREA_AURA_PARTY',
  'SPELL_EFFECT_LEARN_SPELL',
  'SPELL_EFFECT_SPELL_DEFENSE',
  'SPELL_EFFECT_DISPEL',
  'SPELL_EFFECT_LANGUAGE',
  'SPELL_EFFECT_DUAL_WIELD',
  'SPELL_EFFECT_JUMP',
  'SPELL_EFFECT_JUMP_DEST',
  'SPELL_EFFECT_TELEPORT_UNITS_FACE_CASTER',
  'SPELL_EFFECT_SKILL_STEP',
  'SPELL_EFFECT_PLAY_MOVIE',
  'SPELL_EFFECT_SPAWN',
  'SPELL_EFFECT_TRADE_SKILL',
  'SPELL_EFFECT_STEALTH',
  'SPELL_EFFECT_DETECT',
  'SPELL_EFFECT_TRANS_DOOR',
  'SPELL_EFFECT_FORCE_CRITICAL_HIT',
  'SPELL_EFFECT_SET_MAX_BATTLE_PET_COUNT',
  'SPELL_EFFECT_ENCHANT_ITEM',
  'SPELL_EFFECT_ENCHANT_ITEM_TEMPORARY',
  'SPELL_EFFECT_TAMECREATURE',
  'SPELL_EFFECT_SUMMON_PET',
  'SPELL_EFFECT_LEARN_PET_SPELL',
  'SPELL_EFFECT_WEAPON_DAMAGE',
  'SPELL_EFFECT_CREATE_RANDOM_ITEM',
  'SPELL_EFFECT_PROFICIENCY',
  'SPELL_EFFECT_SEND_EVENT',
  'SPELL_EFFECT_POWER_BURN',
  'SPELL_EFFECT_THREAT',
  'SPELL_EFFECT_TRIGGER_SPELL',
  'SPELL_EFFECT_APPLY_AREA_AURA_RAID',
  'SPELL_EFFECT_RECHARGE_ITEM',
  'SPELL_EFFECT_HEAL_MAX_HEALTH',
  'SPELL_EFFECT_INTERRUPT_CAST',
  'SPELL_EFFECT_DISTRACT',
  'SPELL_EFFECT_PULL',
  'SPELL_EFFECT_PICKPOCKET',
  'SPELL_EFFECT_ADD_FARSIGHT',
  'SPELL_EFFECT_UNTRAIN_TALENTS',
  'SPELL_EFFECT_APPLY_GLYPH',
  'SPELL_EFFECT_HEAL_MECHANICAL',
  'SPELL_EFFECT_SUMMON_OBJECT_WILD',
  'SPELL_EFFECT_SCRIPT_EFFECT',
  'SPELL_EFFECT_ATTACK',
  'SPELL_EFFECT_SANCTUARY',
  'SPELL_EFFECT_ADD_COMBO_POINTS',
  'SPELL_EFFECT_PUSH_ABILITY_TO_ACTION_BAR',
  'SPELL_EFFECT_BIND_SIGHT',
  'SPELL_EFFECT_DUEL',
  'SPELL_EFFECT_STUCK',
  'SPELL_EFFECT_SUMMON_PLAYER',
  'SPELL_EFFECT_ACTIVATE_OBJECT',
  'SPELL_EFFECT_GAMEOBJECT_DAMAGE',
  'SPELL_EFFECT_GAMEOBJECT_REPAIR',
  'SPELL_EFFECT_GAMEOBJECT_SET_DESTRUCTION_STATE',
  'SPELL_EFFECT_KILL_CREDIT',
  'SPELL_EFFECT_THREAT_ALL',
  'SPELL_EFFECT_ENCHANT_HELD_ITEM',
  'SPELL_EFFECT_FORCE_DESELECT',
  'SPELL_EFFECT_SELF_RESURRECT',
  'SPELL_EFFECT_SKINNING',
  'SPELL_EFFECT_CHARGE',
  'SPELL_EFFECT_CAST_BUTTON',
  'SPELL_EFFECT_KNOCK_BACK',
  'SPELL_EFFECT_DISENCHANT',
  'SPELL_EFFECT_INEBRIATE',
  'SPELL_EFFECT_FEED_PET',
  'SPELL_EFFECT_DISMISS_PET',
  'SPELL_EFFECT_REPUTATION',
  'SPELL_EFFECT_SUMMON_OBJECT_SLOT1',
  'SPELL_EFFECT_SURVEY',
  'SPELL_EFFECT_CHANGE_RAID_MARKER',
  'SPELL_EFFECT_SHOW_CORPSE_LOOT',
  'SPELL_EFFECT_DISPEL_MECHANIC',
  'SPELL_EFFECT_RESURRECT_PET',
  'SPELL_EFFECT_DESTROY_ALL_TOTEMS',
  'SPELL_EFFECT_DURABILITY_DAMAGE',
  'SPELL_EFFECT_112',
  'SPELL_EFFECT_113',
  'SPELL_EFFECT_ATTACK_ME',
  'SPELL_EFFECT_DURABILITY_DAMAGE_PCT',
  'SPELL_EFFECT_SKIN_PLAYER_CORPSE',
  'SPELL_EFFECT_SPIRIT_HEAL',
  'SPELL_EFFECT_SKILL',
  'SPELL_EFFECT_APPLY_AREA_AURA_PET',
  'SPELL_EFFECT_TELEPORT_GRAVEYARD',
  'SPELL_EFFECT_NORMALIZED_WEAPON_DMG',
  'SPELL_EFFECT_122',
  'SPELL_EFFECT_SEND_TAXI',
  'SPELL_EFFECT_PULL_TOWARDS',
  'SPELL_EFFECT_MODIFY_THREAT_PERCENT',
  'SPELL_EFFECT_STEAL_BENEFICIAL_BUFF',
  'SPELL_EFFECT_PROSPECTING',
  'SPELL_EFFECT_APPLY_AREA_AURA_FRIEND',
  'SPELL_EFFECT_APPLY_AREA_AURA_ENEMY',
  'SPELL_EFFECT_REDIRECT_THREAT',
  'SPELL_EFFECT_PLAY_SOUND',
  'SPELL_EFFECT_PLAY_MUSIC',
  'SPELL_EFFECT_UNLEARN_SPECIALIZATION',
  'SPELL_EFFECT_KILL_CREDIT2',
  'SPELL_EFFECT_CALL_PET',
  'SPELL_EFFECT_HEAL_PCT',
  'SPELL_EFFECT_ENERGIZE_PCT',
  'SPELL_EFFECT_LEAP_BACK',
  'SPELL_EFFECT_CLEAR_QUEST',
  'SPELL_EFFECT_FORCE_CAST',
  'SPELL_EFFECT_FORCE_CAST_WITH_VALUE',
  'SPELL_EFFECT_TRIGGER_SPELL_WITH_VALUE',
  'SPELL_EFFECT_APPLY_AREA_AURA_OWNER',
  'SPELL_EFFECT_KNOCK_BACK_DEST',
  'SPELL_EFFECT_PULL_TOWARDS_DEST',
  'SPELL_EFFECT_ACTIVATE_RUNE',
  'SPELL_EFFECT_QUEST_FAIL',
  'SPELL_EFFECT_TRIGGER_MISSILE_SPELL_WITH_VALUE',
  'SPELL_EFFECT_CHARGE_DEST',
  'SPELL_EFFECT_QUEST_START',
  'SPELL_EFFECT_TRIGGER_SPELL_2',
  'SPELL_EFFECT_SUMMON_RAF_FRIEND',
  'SPELL_EFFECT_CREATE_TAMED_PET',
  'SPELL_EFFECT_DISCOVER_TAXI',
  'SPELL_EFFECT_TITAN_GRIP',
  'SPELL_EFFECT_ENCHANT_ITEM_PRISMATIC',
  'SPELL_EFFECT_CREATE_LOOT',
  'SPELL_EFFECT_MILLING',
  'SPELL_EFFECT_ALLOW_RENAME_PET',
  'SPELL_EFFECT_FORCE_CAST_2',
  'SPELL_EFFECT_TALENT_SPEC_COUNT',
  'SPELL_EFFECT_TALENT_SPEC_SELECT',
  'SPELL_EFFECT_OBLITERATE_ITEM',
  'SPELL_EFFECT_REMOVE_AURA',
  'SPELL_EFFECT_DAMAGE_FROM_MAX_HEALTH_PCT',
  'SPELL_EFFECT_GIVE_CURRENCY',
  'SPELL_EFFECT_UPDATE_PLAYER_PHASE',
  'SPELL_EFFECT_ALLOW_CONTROL_PET',
  'SPELL_EFFECT_DESTROY_ITEM',
  'SPELL_EFFECT_UPDATE_ZONE_AURAS_AND_PHASES',
  'SPELL_EFFECT_171',
  'SPELL_EFFECT_RESURRECT_WITH_AURA',
  'SPELL_EFFECT_UNLOCK_GUILD_VAULT_TAB',
  'SPELL_EFFECT_APPLY_AURA_ON_PET',
  'SPELL_EFFECT_175',
  'SPELL_EFFECT_SANCTUARY_2',
  'SPELL_EFFECT_177',
  'SPELL_EFFECT_178',
  'SPELL_EFFECT_CREATE_AREATRIGGER',
  'SPELL_EFFECT_UPDATE_AREATRIGGER',
  'SPELL_EFFECT_REMOVE_TALENT',
  'SPELL_EFFECT_DESPAWN_AREATRIGGER',
  'SPELL_EFFECT_183',
  'SPELL_EFFECT_REPUTATION_2',
  'SPELL_EFFECT_185',
  'SPELL_EFFECT_186',
  'SPELL_EFFECT_RANDOMIZE_ARCHAEOLOGY_DIGSITES',
  'SPELL_EFFECT_188',
  'SPELL_EFFECT_LOOT',
  'SPELL_EFFECT_190',
  'SPELL_EFFECT_TELEPORT_TO_DIGSITE',
  'SPELL_EFFECT_UNCAGE_BATTLEPET',
  'SPELL_EFFECT_START_PET_BATTLE',
  'SPELL_EFFECT_194',
  'SPELL_EFFECT_195',
  'SPELL_EFFECT_196',
  'SPELL_EFFECT_197',
  'SPELL_EFFECT_PLAY_SCENE',
  'SPELL_EFFECT_199',
  'SPELL_EFFECT_HEAL_BATTLEPET_PCT',
  'SPELL_EFFECT_ENABLE_BATTLE_PETS',
  'SPELL_EFFECT_202',
  'SPELL_EFFECT_203',
  'SPELL_EFFECT_CHANGE_BATTLEPET_QUALITY',
  'SPELL_EFFECT_LAUNCH_QUEST_CHOICE',
  'SPELL_EFFECT_ALTER_ITEM',
  'SPELL_EFFECT_LAUNCH_QUEST_TASK',
  'SPELL_EFFECT_208',
  'SPELL_EFFECT_209',
  'SPELL_EFFECT_LEARN_GARRISON_BUILDING',
  'SPELL_EFFECT_LEARN_GARRISON_SPECIALIZATION',
  'SPELL_EFFECT_212',
  'SPELL_EFFECT_213',
  'SPELL_EFFECT_CREATE_GARRISON',
  'SPELL_EFFECT_UPGRADE_CHARACTER_SPELLS',
  'SPELL_EFFECT_CREATE_SHIPMENT',
  'SPELL_EFFECT_UPGRADE_GARRISON',
  'SPELL_EFFECT_218',
  'SPELL_EFFECT_CREATE_CONVERSATION',
  'SPELL_EFFECT_ADD_GARRISON_FOLLOWER',
  'SPELL_EFFECT_221',
  'SPELL_EFFECT_CREATE_HEIRLOOM_ITEM',
  'SPELL_EFFECT_CHANGE_ITEM_BONUSES',
  'SPELL_EFFECT_ACTIVATE_GARRISON_BUILDING',
  'SPELL_EFFECT_GRANT_BATTLEPET_LEVEL',
  'SPELL_EFFECT_226',
  'SPELL_EFFECT_TELEPORT_TO_LFG_DUNGEON',
  'SPELL_EFFECT_228',
  'SPELL_EFFECT_SET_FOLLOWER_QUALITY',
  'SPELL_EFFECT_INCREASE_FOLLOWER_ITEM_LEVEL',
  'SPELL_EFFECT_INCREASE_FOLLOWER_EXPERIENCE',
  'SPELL_EFFECT_REMOVE_PHASE',
  'SPELL_EFFECT_RANDOMIZE_FOLLOWER_ABILITIES',
  'SPELL_EFFECT_234',
  'SPELL_EFFECT_235',
  'SPELL_EFFECT_GIVE_EXPERIENCE',
  'SPELL_EFFECT_GIVE_RESTED_EXPERIENCE_BONUS',
  'SPELL_EFFECT_INCREASE_SKILL',
  'SPELL_EFFECT_END_GARRISON_BUILDING_CONSTRUCTION',
  'SPELL_EFFECT_GIVE_ARTIFACT_POWER',
  'SPELL_EFFECT_241',
  'SPELL_EFFECT_GIVE_ARTIFACT_POWER_NO_BONUS',
  'SPELL_EFFECT_APPLY_ENCHANT_ILLUSION',
  'SPELL_EFFECT_LEARN_FOLLOWER_ABILITY',
  'SPELL_EFFECT_UPGRADE_HEIRLOOM',
  'SPELL_EFFECT_FINISH_GARRISON_MISSION',
  'SPELL_EFFECT_ADD_GARRISON_MISSION',
  'SPELL_EFFECT_FINISH_SHIPMENT',
  'SPELL_EFFECT_FORCE_EQUIP_ITEM',
  'SPELL_EFFECT_TAKE_SCREENSHOT',
  'SPELL_EFFECT_SET_GARRISON_CACHE_SIZE',
  'SPELL_EFFECT_TELEPORT_UNITS',
  'SPELL_EFFECT_GIVE_HONOR',
  'SPELL_EFFECT_254',
  'SPELL_EFFECT_LEARN_TRANSMOG_SET'
]
let data = {}
lookup.forEach(x => (data[x] = x))
export { lookup }
export default data