import co from 'co'
import fetch from 'node-fetch'

function* main() {
  const res = yield fetch('https://api.punkapi.com/v2/beers/106')
  const data = yield res.json()
  console.log(data)
}

co(main).catch(e => console.error(e))
