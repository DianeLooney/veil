import { dhSavedya0 } from './fixtures/'
import { IEntity, DefaultEntity } from '../src/entity'
import { expect } from 'chai'
import { calcItems } from '../src/templates/from-armory'

describe('Fixtures', () => {
  describe('dh-savedya-0', () => {
    it('should exist', () => {
      expect(dhSavedya0).to.not.be.undefined
    })
    let arr = calcItems(dhSavedya0)
    it('should be handled by calcItems', () => {
      expect(arr).to.be.an.instanceOf(Array)
    })
    it('should have length 16', () => {
      expect(arr).to.have.length(16)
    })
    it('should have exactly 1 entry for each slot', () => {
      var slots = [
        'head',
        'neck',
        'shoulder',
        'back',
        'chest',
        'wrist',
        'hands',
        'waist',
        'legs',
        'feet',
        'finger1',
        'finger2',
        'trinket1',
        'trinket2',
        'mainHand',
        'offHand'
      ].forEach(s => {
        expect(arr.filter(x => x.slot === s)).to.have.length(1)
      })
    })
    let e: IEntity = Object.create(DefaultEntity)
    it('should be able to equip each item', () => {
      arr.forEach(i => {
        expect(e.items[i.slot]).to.be.undefined
        e.equipItem(i.slot, i)
        expect(e.items[i.slot]).to.be.equal(i)
      })
    })
  })
})
