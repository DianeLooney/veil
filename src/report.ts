import * as express from 'express'
let expressWs = require('express-ws')
let app = expressWs(express()).app

let clients = []
app.ws('/combatlog', function(ws, req) {
  console.log('Client connected')
  clients.push(ws)
})

app.listen(8080)
let isReady = function() {
  return clients.length > 0
}
export { isReady }
export default function report(event: string, data: any) {
  switch (event) {
    case 'ERROR':
      //console.log(`[${event}] ${data.type}: ${data.details}`)
      break
    case 'ABILITY_CASTED':
      clients.forEach(c => {
        c.send(JSON.stringify({ event, entity: data.entity.slug, spell: data.spell.slug }))
      })
      //console.log(`[${event}] ${data.entity.slug}: ${data.spell.slug}`)
      break

    case 'ABILITY_LEARNED':

    case 'ABILITY_UNLEARNED':
      //console.log(`[${event}] ${data.entity.slug}: ${data.ability.slug}`)
      break

    case 'MODIFIER_GAINED':

    case 'MODIFIER_DROPPED':
      //console.log(`[${event}] ${data.entity.slug}: ${data.modifier.slug}`)
      break

    case 'ENTITY_SPAWNED':

    case 'ENTITY_DESPAWNED':
      //console.log(`[${event}] ${data.entity.slug}`)
      break
    case 'DAMAGE_TAKEN':
      //console.log(`[${event}] ${data.source.slug} -> ${data.target.slug} - ${data.amount}`)
      break
    case 'ENTITY_DIED':
      //console.log(`[${event}] ${data.killingBlow.slug} x ${data.unit.slug} - ${data.amount}`)
      break

    case 'WORLD_TICKED':
      //console.log(`[${event}] ${data.time}`)
      break

    default:
      //console.log(`[${event}] ${JSON.stringify(data)}`)
      break
  }
}
