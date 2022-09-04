import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Modal, Divider, CardContent, CardActions, Grid, Button, Typography, TextField, InputAdornment } from '@material-ui/core'
import CardOnModal from 'components/CardOnModal'
import Avatar from 'react-avatar-edit'
import { loadingState, toastState, reloadUserAvatar } from 'recoils/atoms'

import sessionHelper, { setLocalStoreData } from 'utils/sessionHelper'
import { doPost } from 'utils/axios'
import { storageState } from 'recoils/firebase'
import FileUtils from 'utils/FileUtils'

import { EditCoverImage, OpenEditAvatar, ReloadCoverImage } from './recoil'
import { v4 as uuidv4 } from 'uuid'

const EditAvatar = () => {
  const firebaseStorage = useRecoilValue(storageState)
  const isEditCover = useRecoilValue(EditCoverImage)

  const [open, setOpen] = useRecoilState(OpenEditAvatar)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)
  const setReloadUserAvatar = useSetRecoilState(reloadUserAvatar)
  const setReloadCover = useSetRecoilState(ReloadCoverImage)

  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [src, setSrc] = useState(null)
  const [file, setFile] = useState(null)
  const [isLargeFile, setIsLargeFile] = useState(false)

  const handleClickSave = async e => {
    e.preventDefault()

    setLoading(true)
    try {
      if (!isEditCover) {
        const avatarId = uuidv4()
        const croppedAvatarId = uuidv4()

        const resUpdate = await doPost(`user/updateAvatar`, { id: sessionHelper().userId, croppedAvatarId: croppedAvatarId, avatarId: avatarId })
        if (resUpdate && resUpdate.data.success) {
          setLocalStoreData('croppedAvatarId', croppedAvatarId)
          setLocalStoreData('avatarId', avatarId)

          // upload images to firebase storage
          await FileUtils.putFile(preview, firebaseStorage, `avatars/${sessionHelper().userId}`, `${croppedAvatarId}.png`, true)
          await FileUtils.putFile(src, firebaseStorage, `avatars/${sessionHelper().userId}`, `${avatarId}.png`)

          setToast({ ...toast, open: true, message: resUpdate.data.message, type: 'success' })
          setReloadUserAvatar(old => old + 1)
        }
      }

      if (isEditCover) {
        const coverId = uuidv4()

        const resUpdate = await doPost(`user/updateCoverImage`, { id: sessionHelper().userId, coverId })
        if (resUpdate && resUpdate.data.success) {
          setLocalStoreData('coverId', coverId)

          // upload images to firebase storage
          await FileUtils.putFile(src, firebaseStorage, `avatars/${sessionHelper().userId}`, `${coverId}.png`)

          setToast({ ...toast, open: true, message: resUpdate.data.message, type: 'success' })
          setReloadCover(old => old + 1)
        }
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
      setIsLargeFile(false)
      setOpen(false)
    }
  }

  const onClose = () => {
    setPreview(null)
  }

  const onCrop = preview => {
    setPreview(preview)
  }

  const onFileLoad = file => {
    setSrc(file)
  }

  const onBeforeFileLoad = elem => {
    if (elem.target.files[0].size > 5120000) {
      setIsLargeFile(true)
      elem.target.value = ''
    } else {
      setIsLargeFile(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setIsLargeFile(false)
  }

  const onFileSelect = e => {
    setFile(URL.createObjectURL(e.target.files[0]))
    setSrc(e.target.files[0])
  }

  return (
    <Modal open={open} onClose={handleClose} className="uw-modal">
      <CardOnModal>
        <div className="card-header">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-2 font-weight-bold">{isEditCover ? 'Cập nhật ảnh bìa' : 'Cập nhật ảnh đại diện'}</h4>
          </div>
        </div>
        <Divider />
        <CardContent>
          <Grid spacing={3} container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              {!isEditCover && (
                <Avatar
                  label="Chọn ảnh trong máy của bạn"
                  width={'100%'}
                  height={300}
                  onCrop={onCrop}
                  onClose={onClose}
                  src={base64}
                  onFileLoad={onFileLoad}
                  onBeforeFileLoad={onBeforeFileLoad}
                  borderStyle={{ border: '2px solid rgb(151, 151, 151)', borderRadius: '8px', textAlign: 'center', width: '100%', height: '300px' }}
                />
              )}
              {isEditCover && (
                <>
                  <TextField
                    style={{ position: 'relative' }}
                    value={src ? src.name : ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button size="large" variant="contained" component="label" fullWidth>
                            Tìm
                            <TextField type="file" onChange={onFileSelect} inputProps={{ accept: '.png,.jpg', hidden: true }} />
                          </Button>
                        </InputAdornment>
                      )
                    }}
                  />
                  {file && <img src={file} alt="preview" width="100%" height="50%" className="mt-4" />}
                </>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {!isLargeFile && <Typography variant="subtitle2">Chọn ảnh có dung lượng lớn nhất 5 MB.</Typography>}
              {isLargeFile && (
                <Typography variant="subtitle2" style={{ color: 'red' }}>
                  Chọn ảnh &lt; 5MB.
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={3} justifyContent="flex-end">
            <Grid item>
              <Button size="large" color="primary" onClick={handleClickSave} variant="contained" type="submit" disabled={isEditCover ? src == null : preview == null}>
                Lưu
              </Button>
            </Grid>
            <Grid item>
              <Button size="large" onClick={handleClose} variant="outlined">
                Quay lại
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </CardOnModal>
    </Modal>
  )
}

export default EditAvatar
