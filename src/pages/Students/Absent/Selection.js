import React, { useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import InputBase from '@material-ui/core/InputBase'

import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'
import { absentTypeOptionsColorEnum, absentTypeOptionsEnum, saveAbsentDataModeEnum } from 'app/enums'
import { useRecoilState } from 'recoil'
import { ReloadStudentDetailsWithAbsentList } from './recoil'

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 13,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase)

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}))

export default function ControlledOpenSelect({ Permission, date, dropdownAbsentMode, studentId, absentObj }) {
  const classes = useStyles()

  let reload = 0
  const [absentType, setAbsentType] = React.useState(absentTypeOptionsEnum.NoAbsent) // Manage state of absent mode before and after change
  const [selectedColor, setSelectedColor] = React.useState(absentTypeOptionsColorEnum[Permission.toString()])
  const [reloadAbsent, setReloadAbsent] = useRecoilState(ReloadStudentDetailsWithAbsentList)

  const handleChange = async event => {
    const data = {
      StudentId: studentId,
      Reason: '',
      DateAbsents: [date],
      IsActive: true,
      AbsentMode: dropdownAbsentMode,
      HasPermission: Boolean(Permission),
      userId: sessionHelper().userId,
      classId: sessionHelper().classId,
      scholasticId: sessionHelper().scholasticId,
      userFullName: sessionHelper().fullName
    }

    let body = {}
    const selectedAttendanceOption = event.target.value // New Attendance value
    setSelectedColor(
      selectedAttendanceOption === absentTypeOptionsEnum.Permission
        ? absentTypeOptionsColorEnum[absentTypeOptionsEnum.Permission]
        : absentTypeOptionsColorEnum[selectedAttendanceOption]
    )

    // If new absent mode is not NoAbsent, then we will prepare data to send to server
    if (selectedAttendanceOption !== absentTypeOptionsEnum.NoAbsent) {
      // If old absent mode is NoAbsent, then we will add data
      // if not (it means switching from permission to non-permission or vice verca), then we will modify data
      body = {
        ...data,
        HasPermission: Boolean(Number(selectedAttendanceOption)),
        mode: absentType !== absentTypeOptionsEnum.NoAbsent ? saveAbsentDataModeEnum.Modify : saveAbsentDataModeEnum.Add
      }
    } else {
      body = { ...absentObj, mode: saveAbsentDataModeEnum.Delete }
    }

    try {
      await doPost(`student/absent`, body)
      setAbsentType(selectedAttendanceOption)
      setReloadAbsent([...reloadAbsent, { id: studentId, reload: reload++ }])
    } catch (err) {}
  }

  useEffect(() => {
    setAbsentType(Permission)
  }, [Permission, setAbsentType])

  return (
    <>
      <FormControl className={classes.margin}>
        <NativeSelect value={absentType} onChange={handleChange} input={<BootstrapInput />} style={{ color: selectedColor }}>
          <option aria-label="None" value={absentTypeOptionsEnum.NoAbsent} />
          <option value={absentTypeOptionsEnum.Permission} style={{ color: absentTypeOptionsColorEnum[absentTypeOptionsEnum.Permission] }}>
            P
          </option>
          <option value={absentTypeOptionsEnum.NonPermission} style={{ color: absentTypeOptionsColorEnum[absentTypeOptionsEnum.NonPermission] }}>
            KP
          </option>
        </NativeSelect>
      </FormControl>
    </>
  )
}
