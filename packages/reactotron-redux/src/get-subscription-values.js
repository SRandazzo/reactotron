import R from 'ramda'
import RS from 'ramdasauce'
// fishes out the values for the subscriptions in state and returns them
export default (subscriptions, state) =>
  R.pipe(
    R.map(R.when(R.isNil, R.always(''))),
    R.filter(RS.endsWith('.*')),
    R.map((key) => {
      const keyMinusWildcard = R.slice(0, -2, key)
      const value = RS.dotPath(keyMinusWildcard, state)
      if (R.is(Object, value) && !RS.isNilOrEmpty(value)) {
        return R.pipe(
          R.keys,
          R.map((key) => `${keyMinusWildcard}.${key}`)
        )(value)
      }
      return []
    }),
    R.concat(R.map(R.when(R.isNil, R.always('')), subscriptions)),
    R.flatten,
    R.reject(RS.endsWith('.*')),
    R.uniq,
    R.sortBy(R.identity),
    R.map(key => ({
      path: key,
      value: RS.isNilOrEmpty(key) ? state : RS.dotPath(key, state)
    }))
  )(subscriptions)
