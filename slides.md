---
highlighter: shiki
info: |
  ## Les fonctions génératrices en JS

  <br>

  [Sources](https://github.com/nlepage/generator-functions-talk)
title: Les fonctions génératrices en JS
routerMode: hash
download: true
lineNumbers: true
layout: cover
---

# Les fonctions génératrices en JS

```js
function* miseEnJambe() {
  yield 'Hello les Pixous !'
}
```

<style>
code {
  @apply text-lg
}
</style>

<!--
## Plan
 - Comme itérables
 - Les syntaxes (fonctions/méthodes, fonctions/méthodes asynchrones, yield, yield*)
 - Les générateurs
 - Les runners/schedulers (task.js, co, redux-saga, effection, cuillere!)
 - Comme code (défaut: contamination comme async/await)
 - Aller plus loin (effets algébriques)
-->

---
layout: section
---

# Comme itérables

---

# Comme itérables

```js {1-5|1-5,7-8|1-5,10-13|1-5,15-19|all}
function* compterJusquà3() {
  yield 1
  yield 2
  yield 3
}

console.log([...compterJusquà3()])        // [1, 2, 3]
console.log(Array.from(compterJusquà3())) // [1, 2, 3]

for (const value of compterJusquà3()) console.log(value)
// 1
// 2
// 3

const itérateur = compterJusquà3()
console.log(itérateur.next()) // { value: 1, done: false }
console.log(itérateur.next()) // { value: 2, done: false }
console.log(itérateur.next()) // { value: 3, done: false }
console.log(itérateur.next()) // { value: undefined, done: true }
```

---

# Comme itérables

```js {-6|8-|all}
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) yield i
}

console.log([...range(1, 9, 2)])                  // [1, 3, 5, 7, 9]
console.log(Array.from(range(0, 4), x => 2 ** x)) // [1, 2, 4, 8, 16]

function* fibonacci(n) {
  for (let [i, a, b] = [0, 0, 1]; i < n; [i, a, b] = [i + 1, b, a + b]) yield a
}

console.log([...fibonacci(10)]) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

<style>
code {
  @apply text-base
}
</style>

---
layout: section
---

# Syntaxes

---

# Syntaxes : fonctions et méthodes

```js {1-3|5-7|9-13|15-19|all}
function* nommée() {
  // ...
}

const anonyme = function*() {
  // ...
}

class Exemple {
  * méthode() {
    // ...
  }
}

const exemple = {
  * méthode() {
    // ...
  }
}
```

---

# ⛔ Syntaxes : fonctions fléchées

```js
// Irregular
() =*> ...

// not the same order as in regular generator functions
() =>* ...

// also wrong order
() *=> ...

// ASI hazard
*() => ...
```

🙃 Mot clé *generator* ? ([à l'étape 1 au tc39](https://github.com/tc39/proposal-generator-arrow-functions)) 

```js
generator function() {}

const foo = generator () => {}
```

---

# Syntaxes : yield

```js {-10|2-4|6-7|9|12-|all}
function* exemple() {
  yield 123
  yield 'foo'
  yield { x: 1, y: 2, z: 3 }

  yield
  yield undefined

  const valeur = yield 'chercher la valeur'
}

console.log([...exemple()])
// [123, 'foo', { x: 1, y: 2, z: 3 }, undefined, undefined, 'chercher la valeur']
```

<style>
code {
  @apply text-base
}
</style>

---

# Syntaxes : return

```js {-3|5-6|8|all}
function* renvoyerLaRéponse() {
  return 42
}

const itérateur = renvoyerLaRéponse()
console.log(itérateur.next()) // { value: 42, done: true }

console.log([...renvoyerLaRéponse()]) // []
```

<style>
code {
  @apply text-lg
}
</style>

---

# Syntaxes : yield*

```js {-8|2|4|6-7|10-|all}
function* exemple() {
  yield* [1, 2, 3]

  yield* range(4, 6)

  const réponse = yield* renvoyerLaRéponse()
  yield réponse
}

console.log([...exemple()])
// [1, 2, 3, 4, 5, 6, 42]
```

<style>
code {
  @apply text-lg
}
</style>

---

# Syntaxes : génératrices et asynchrones

```js {-5|2-3|4|7-10|12-14|16-|all}
async function* getNombres() {
  const res = await fetch('https://example.com/nombres')
  const nombres = await res.json()
  for (const n of nombres) yield n
}

const itérateur = getNombres()
console.log(await itérateur.next()) // { value: 42, done: false }
console.log(await itérateur.next()) // { value: 1024, done: false }
console.log(await itérateur.next()) // { value: undefined, done: true }

for await (const n of getNombres()) console.log(n)
// 42
// 1024

const exemple = {
  async* méthode() {
    // ...
  }
}
```

---
layout: statement
---

# The end ?

---
layout: section
---

# Générateurs

---

# Générateurs

```ts {all|2|3|4|7-|all}
interface Generator {
  next(value: any): IteratorResult
  throw(e: any): IteratorResult
  return(value: any): IteratorResult
}

interface IteratorResult {
  done: boolean
  value: any
}
```

<style>
code {
  @apply text-lg
}
</style>

---
layout: two-cols
---

<template v-slot:default>

# Générateurs

```js


function* exemple() {

  // ...

  const resultat = yield 'tâche 1'
  console.log(resultat) // 'OK'

  try {
    yield 'tâche 2'
  } catch (e) {
    console.error(e) // 'KO'
  }

  while (true) yield 'infini'

  yield 'inaccessible'
}
```

</template>
<template v-slot:right>

# &nbsp;

```js
const gen = exemple()

gen.next() // { value: 'tâche 1', done: false }

// ...

gen.next('OK') // { value: 'tâche 2', done: false }

// ...

gen.throw('KO') // { value: 'infini', done: false }




gen.return('STOP') // { value: 'STOP', done: true }

gen.next() // { value: undefined, done: true }

```

</template>

<style>
code {
  @apply text-xs
}
</style>

---
layout: section
---

# Runners / Schedulers

---

# Runners / Schedulers : pour faire du async/await

## [co](https://github.com/tj/co)
## [task.js](https://github.com/mozilla/task.js)

```js
import co from 'co'

function* main() {
  const res = yield fetch('https://api.punkapi.com/v2/beers/106')
  const data = yield res.json()
  console.log(data)
}

co(main).catch(e => console.error(e))
```

<style>
code {
  @apply text-base
}
</style>

<!--
Fonctions génératrices en ES6/ES2015
async/await en ES2017
-->

---

# Runners / Schedulers : pour les effets de bord

## [redux-saga](https://redux-saga.js.org/)

```js
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId)
    yield put({type: "USER_FETCH_SUCCEEDED", user: user})
  } catch (e) {
    yield put({type: "USER_FETCH_FAILED", message: e.message})
  }
}

function* rootSaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser)
}
```

<style>
code {
  @apply text-base
}
</style>

<!--
Mieux gérer effets bord application (asynchrone, récup données): facile, efficace, résilient, testable

Saga: fonction (thread séparé) responsable gérer effet bord

Effet: simple objet JS contenant des instructions à exécuter (par scheduler redux-saga)
-->

---

# Runners / Schedulers : pour les effets de bord

## [Effection](https://frontside.com/effection/docs/guides/introduction)

```js
import { fetch, main, withTimeout } from 'effection'

main(function*() {
  let dayOfTheWeek = yield withTimeout(fetchWeekDay('est'), 1000)
  console.log(`It is ${dayOfTheWeek}, my friends!`)
})

export function *fetchWeekDay(timezone) {
  let response = yield fetch(`http://worldclockapi.com/api/json/${timezone}/now`)
  let time = yield response.json()
  return time.dayOfTheWeek
}
```


<style>
code {
  @apply text-base
}
</style>

<!--
Généraliste, pour Node et Navigateur

 - Cleanup
 - Cancellation
 - Composition
-->

---

# Runners / Schedulers : pour les effets de bord

## [🥄 Cuillere](https://github.com/cuillerejs/cuillere)

```js {-8|10-|all}
async function inscrireEtudiant({ etudiant, formation }) {
  return crud.transactional(client => {
    await creerDossierEtudiant(etudiant, client)
    await creerDossierFinancier(etudiant, client)
    await inscrireEtudiantFormation(etudiant, formation, client)
    // ...
  })
}

function* inscrireEtudiant({ etudiant, formation }) {
  yield creerDossierEtudiant(etudiant)
  yield creerDossierFinancier(etudiant)
  yield inscrireEtudiantFormation(etudiant, formation)
  // ...
}
```

<!--
Gestionnaire d'effet sous forme plugin.
-->

---

# Runners / Schedulers : pour les effets de bord

## [🥄 Cuillere](https://github.com/cuillerejs/cuillere)

```js {-3|5-|all}
async function recupererFormationEtudiant(etudiant, dataSources) {
  return dataSources.formations.get(etudiant.idFormation)
}

function* recupererFormationEtudiant(etudiant) {
  return yield crud.formations.get(etudiant.idFormation)
}
```

<!--
Gestionnaire d'effet sous forme plugin.
-->

---

# Issue 10238: Async generator: catched error on last yield is wrongly rethrown

```js
async function* gen() {
  try {
    yield 42
  } catch(e) {
    console.log('Error caught!')
  }
}

(async () => {
  const g = gen()
  await g.next() // go to yield 42
  try {
    await g.throw(new Error()) // throw error from the yield
  } catch (e) {
    console.error('e has been rethrown !')
  }
})()
```

<!--
 - génératrice asynchrone
 - throw du dernière yield
 - absence de return explicite
-->

---

# Inconvénients

<v-clicks>

 - Nouvelles syntaxes / pratiques
 - Nécessité d'un framework
 - Mauvais support du typage
 - Contamination du code

</v-clicks>

---
layout: statement
---

# Pour aller plus loin

## Effets algébriques
