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
 - Les syntaxes (fonctions/méthodes, fonctions/méthodes asynchrones, yield, yield*, computed property)
 - Les générateurs
 - Comme code (défaut: contamination comme async/await)
 - Les runners/schedulers (task.js LOL, redux-saga, effection, cuillere!)
 - Aller plus loin (effets algébriques)
-->

---

# Comme itérables (ou itérateurs)

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

const iterateur = compterJusquà3()
console.log(iterateur.next()) // { value: 1, done: false }
console.log(iterateur.next()) // { value: 2, done: false }
console.log(iterateur.next()) // { value: 3, done: false }
console.log(iterateur.next()) // { value: undefined, done: true }
```

---

# Comme itérables (ou itérateurs)

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

# Syntaxes : fonctions et méthodes

```js {1-3|5-7|9-13|15-19|all}
const anonyme = function*() {
  // ...
}

function* nommée() {
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
