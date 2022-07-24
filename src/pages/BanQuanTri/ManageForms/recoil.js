import { atom, selector } from 'recoil'

export const OpenEditorForm = atom({
  key: 'OpenEditorForm',
  default: {
    OpenEditor: false,
    Template: undefined
  }
})
