const ndb = require('../lib/main.js')
const sandbox = 'test/sandbox/'
const test = require('tape')
const wbd = require('world-bank-dataset')

// apparently async/await doesnt totally work with tape
initIndex = async function() {
  global.wb = await ndb({name: sandbox + 'DELETE-TEST'})
}

test('create a little world bank index', t => {
  t.plan(1)  
  initIndex().then(t.pass)
})

test('can add some worldbank data', t => {
  console.log(wb)
  var dataSize = 10
  const data = wbd.slice(0, dataSize).map(item => {
    return {
      _id: item._id.$oid,
      board_approval_month: item.board_approval_month,
      totalamt: item.totalamt
    }
  })
  console.log(JSON.stringify(data.map(item => {
    return {
      _id: item._id,
      board_approval_month: item.board_approval_month,
      sectorcode: item.sectorcode
    }
  }), null, 2))
  t.plan(1)
  wb.PUT(data).then(result => {
    t.looseEqual(result, [
      '52b213b38594d8a2be17c780',
      '52b213b38594d8a2be17c781',
      '52b213b38594d8a2be17c782',
      '52b213b38594d8a2be17c783',
      '52b213b38594d8a2be17c784',
      '52b213b38594d8a2be17c785',
      '52b213b38594d8a2be17c786',
      '52b213b38594d8a2be17c787',
      '52b213b38594d8a2be17c788',
      '52b213b38594d8a2be17c789' ])
  })
})

test('can GET with string', t => {
  t.plan(1)
  wb.GET('board_approval_month:November')
    .then(result => {
      t.looseEqual(result, [
        { _id: '52b213b38594d8a2be17c780', match: [ 'board_approval_month:November' ] },
        { _id: '52b213b38594d8a2be17c781', match: [ 'board_approval_month:November' ] },
        { _id: '52b213b38594d8a2be17c782', match: [ 'board_approval_month:November' ] }
      ])
    })
})

test('can DELETE', t => {
  t.plan(1)
  wb.DELETE([
    '52b213b38594d8a2be17c781',
    '52b213b38594d8a2be17c782'
  ]).then(result => {
    t.looseEqual(result, [ '52b213b38594d8a2be17c781', '52b213b38594d8a2be17c782' ])
  })
})

test('can GET with object', t => {
  t.plan(1)
  wb.GET({
    gte: 'board_approval_month:November',
    lte: 'board_approval_month:November'
  })
    .then(result => {
      t.looseEqual(result, [
        { _id: '52b213b38594d8a2be17c780', match: [ 'board_approval_month:November' ] }
      ])
    })
})
