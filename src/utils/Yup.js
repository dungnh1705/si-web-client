import * as Yup from 'yup'

function requiredWith(ref, expectedValue, msg) {
  return this.test({
    name: 'requiredWith',
    exclusive: false,
    message: msg,
    test(value) {
      return this.resolve(ref) !== expectedValue || (this.resolve(ref) === expectedValue && !!value)
    }
  })
}

function atLeastOneOf(list, msg) {
  return this.test({
    name: 'atLeastOneOf',
    exclusive: false,
    message: msg,
    test(value) {
      return list.some(f => value[f] != null)
    }
  })
}

Yup.addMethod(Yup.mixed, 'requiredWith', requiredWith)
Yup.addMethod(Yup.mixed, 'atLeastOneOf', atLeastOneOf)

export default Yup
