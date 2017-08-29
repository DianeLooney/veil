export default function report(event: string, data: any) {
  switch (event) {
    case 'ERROR':
      //console.log(`[${event}] ${data.type}: ${data.details}`)
      break

    case 'ABILITY_LEARNED':

    case 'ABILITY_UNLEARNED':
      console.log(`[${event}] ${data.entity.slug}: ${data.ability.slug}`)
      break

    case 'POWER_LEARNED':

    case 'POWER_UNLEARNED':
      console.log(`[${event}] ${data.entity.slug}: ${data.power}`)
      break

    case 'MODIFIER_GAINED':

    case 'MODIFIER_DROPPED':
      console.log(`[${event}] ${data.entity.slug}: ${data.modifier.slug}`)
      break

    case 'ENTITY_SPAWNED':

    case 'ENTITY_DESPAWNED':
      console.log(`[${event}] ${data.entity.slug}`)
      break
    case 'DAMAGE_TAKEN':
      console.log(
        `[${event}] ${data.source.slug} -> ${data.target.slug} - ${data.amount}`
      )
      break
    case 'ENTITY_DIED':
      console.log(
        `[${event}] ${data.killingBlow.slug} x ${data.unit
          .slug} - ${data.amount}`
      )
    default:
      //console.log(`[${event}] ${JSON.stringify(data)}`)
      break
  }
}
