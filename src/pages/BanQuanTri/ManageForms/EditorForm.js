import React, { useEffect, useState } from 'react'
import { Modal, CardContent, CardActions, Button, Grid, TextField, MenuItem, FormControl, FormControlLabel, FormGroup } from '@material-ui/core'

import CardOnModal from 'components/CardOnModal'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import ButtonLoading from 'components/UI/ButtonLoading'

import { Editor } from '@tinymce/tinymce-react'

import config from 'config'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { TemplateType, Roles } from 'app/enums'
import { toastState, reloadTemplates } from 'recoils/atoms'
import { OpenEditorForm } from './recoil'
import { Placeholders, Sections } from 'utils/Placeholders'

const initValue = { templateType: 0, name: '', content: '', subject: null, roleTemplate: 256 }
const type = [
  { id: 0, name: 'Biểu mẫu' },
  { id: 2, name: 'Báo cáo' },
  { id: 4, name: 'Email tự động' }
]

const EditorForm = () => {
  const [editorState, setEditorState] = useState('')
  const [loading, setLoading] = useState(false)

  let [toast, setToast] = useRecoilState(toastState)
  let [editorForm, setEditorForm] = useRecoilState(OpenEditorForm)
  let { OpenEditor, Template } = editorForm

  let setReloadTemplates = useSetRecoilState(reloadTemplates)

  useEffect(() => {
    if (Template) {
      setEditorState(Template.content)
      editor.resetForm({ values: Template })
    }
  }, [Template])

  const handleClose = () => {
    if (!loading) {
      editor.resetForm({ values: initValue })
      setEditorState(undefined)
      setEditorForm({ OpenEditor: false, Template: undefined })
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Không để trống').max(150, 'Không nhập nhiều hơn 150 ký tự.'),
    subject: Yup.string().max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable()
  })

  const editor = useFormik({
    initialValues: Template ?? initValue,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const TextField_Props = (name, label, maxLength) => {
    const { values, errors, touched, handleBlur, handleChange } = editor
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name] ?? '',
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      }
    }
  }

  const checkSaveButton = () => {
    return !editor.isValid || !editorState
  }

  const checkRole = role => {
    if (editor.values['roleTemplate'] & role) return true
    return false
  }

  const handleCheckRole = e => {
    const val = Number(e.target.value)
    const isChecked = e.target.checked

    let currentRole = editor.values['roleTemplate']

    if (isChecked) {
      editor.setFieldValue('roleTemplate', currentRole + val)
    } else {
      editor.setFieldValue('roleTemplate', currentRole - val)
    }
  }

  const handleSaveForm = async e => {
    e.preventDefault()
    setLoading(true)

    let data = editor.values

    try {
      let res = await doPost(`template/createOrUpdateTemplate`, { ...data, updatedUserId: sessionHelper().userId, content: editorState })
      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        handleClose()
        setReloadTemplates(re => re + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleChangeEditor = (content, editor) => {
    // console.log('Content was updated:', content, editor)
    setEditorState(content)
  }

  const buildListValue = editor => {
    return Sections.map(sec => {
      return {
        type: 'nestedmenuitem',
        text: sec.text,
        getSubmenuItems: function () {
          return Placeholders.filter(p => p.sectionId === sec.sectionId).map(p => {
            return {
              type: 'menuitem',
              text: p.text,
              // icon: 'unlock',
              onAction: function () {
                editor.insertContent(p.value)
              }
            }
          })
        }
      }
    })
  }

  const increaseLetterSpacing = editor => {
    let currentSpacing = 0

    let selectedNode = editor.selection.getNode()

    if (selectedNode && selectedNode.style.letterSpacing) {
      currentSpacing = +Number(selectedNode.style.letterSpacing.replace('px', ''))
    }
    currentSpacing += 1

    editor.formatter.apply('letterSpacing', {
      value: currentSpacing + 'px'
    })

    let spanNode = editor.selection.getStart()
    editor.selection.select(spanNode)
  }

  const decreaseLetterSpacing = editor => {
    let currentSpacing = 0

    let selectedNode = editor.selection.getNode()

    if (selectedNode && selectedNode.style.letterSpacing) {
      currentSpacing = +Number(selectedNode.style.letterSpacing.replace('px', ''))
    }
    currentSpacing -= 1

    editor.formatter.apply('letterSpacing', {
      value: currentSpacing + 'px'
    })

    let spanNode = editor.selection.getStart()
    editor.selection.select(spanNode)
  }

  return (
    <Modal open={OpenEditor} onClose={handleClose} className="uw-modal">
      <CardOnModal>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...TextField_Props('name', 'Tên biểu mẫu', 150)} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...TextField_Props('templateType', 'Loại biểu mẫu')} select>
                {type.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {editor?.values?.templateType == TemplateType.SystemTemplate && (
              <Grid item xs={12}>
                <TextField {...TextField_Props('subject', 'Chủ đề', 250)} />
              </Grid>
            )}
            {editor?.values?.templateType !== TemplateType.SystemTemplate && (
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormGroup row>
                    <FormControlLabel control={<StyledCheckbox checked={checkRole(Roles.DuTruong)} onChange={handleCheckRole} value={Roles.DuTruong} />} label="Dự trưởng" />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkRole(Roles.HuynhTruong)} onChange={handleCheckRole} value={Roles.HuynhTruong} />}
                      label="Huynh trưởng"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkRole(Roles.PhanDoanTruong)} onChange={handleCheckRole} value={Roles.PhanDoanTruong} />}
                      label="Phân đoàn trưởng"
                    />
                    <FormControlLabel control={<StyledCheckbox checked={checkRole(Roles.BanQuanTri)} onChange={handleCheckRole} value={Roles.BanQuanTri} />} label="Ban quản trị" />
                  </FormGroup>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Editor
                id="create-form"
                apiKey="wb7w2gsu9xl1x2ybdqmdxdjy403ebj31rcygwmzrc5b8ndlx"
                value={editorState}
                init={{
                  selector: 'textarea#full-featured-non-premium',
                  plugins:
                    'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                  menubar: 'file edit view insert format tools table help',
                  toolbar:
                    'increaseLetterSpacing decreaseLetterSpacing | placeholders | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                  toolbar_sticky: true,

                  image_advtab: true,
                  image_list: [{ title: 'Logo', value: '/app-logo.png' }],
                  image_dimensions: true,
                  importcss_append: true,
                  image_caption: true,

                  height: 600,
                  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                  toolbar_mode: 'sliding',
                  skin: 'oxide',
                  content_css: 'default',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  setup: function (editor) {
                    editor.ui.registry.addMenuButton('placeholders', {
                      text: 'CHỮ THAY THẾ',
                      fetch: function (callback) {
                        const items = buildListValue(editor)
                        callback(items)
                      }
                    })
                    editor.ui.registry.addButton('increaseLetterSpacing', {
                      type: 'button',
                      text: 'TĂNG KHOẢNG CÁCH CHỮ',
                      onAction: function () {
                        increaseLetterSpacing(editor)
                      }
                    })
                    editor.ui.registry.addButton('decreaseLetterSpacing', {
                      type: 'button',
                      text: 'GIẢM KHOẢNG CÁCH CHỮ',
                      onAction: function () {
                        decreaseLetterSpacing(editor)
                      }
                    })
                  },
                  formats: {
                    letterSpacing: {
                      inline: 'span',
                      styles: {
                        'letter-spacing': '%value'
                      }
                    }
                  }
                }}
                onEditorChange={handleChangeEditor}
                textareaName="formEditor"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleSaveForm} disabled={loading || checkSaveButton()} />
            </Grid>
            <Grid item>
              <Button size="large" variant='outlined' fullWidth onClick={handleClose} disabled={loading}>
                Quay về
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </CardOnModal>
    </Modal>
  )
}

export default EditorForm
