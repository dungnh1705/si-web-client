import React, { useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

import sessionHelper from '../../../utils/sessionHelper'
import { doPost } from '../../../utils/axios'
import { colorOption, valueOption, saveDataMode, AbsentMode } from 'app/enums';



const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
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
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));



export default function ControlledOpenSelect({Permission, date, mode, StuId, dateAbsentObj}) {
  const classes = useStyles();

  const [absentMode, setAbsentMode] = React.useState(valueOption.NoAbsent); //Manage state of absent mode before and after change
  const [selectedColor, setSelectedColor] = React.useState(colorOption[Permission.toString()]);

  const handleChange = async (event) => {
    const data = {
      StudentId: StuId,
      Reason: '',
      DateAbsents: [date],
      IsActive: true,
      AbsentMode: mode,
      HasPermission: Boolean(Permission),
      userId: sessionHelper().userId,
      classId: sessionHelper().classId,
      scholasticId: sessionHelper().scholasticId,
      userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
    }

    let body = {}
    const selectedMode = event.target.value //New absent mode

    setSelectedColor(selectedMode === valueOption.Permission ? colorOption[valueOption.Permission] : colorOption[selectedMode]);

    //If new absent mode is not NoAbsent, then we will prepare data to send to server
    if(selectedMode !== valueOption.NoAbsent){
      //If old absent mode is NoAbsent, then we will add data
      // if not (it means switching from permission to non-permission or vice verca), then we will modify data
      body = {...data, HasPermission: Boolean(Number(selectedMode)), mode:absentMode !== valueOption.NoAbsent?saveDataMode.Modify:saveDataMode.Add} 

    } else {
      body = {...dateAbsentObj, mode:saveDataMode.Delete}
    }

    try {
      const res = await doPost(`student/absent`, body);
      setAbsentMode(selectedMode)
    } catch (err){

    }

  };

  useEffect(() => {
    setAbsentMode(Permission)
  }, [])

  return (
    <>
      <FormControl className={classes.margin}>
        <NativeSelect
          id="demo-customized-select-native"
          value={absentMode}
          onChange={handleChange}
          input={<BootstrapInput/>}
          style={{color:selectedColor}}
        >
          <option aria-label="None" value={valueOption.NoAbsent} />
          <option value={valueOption.Permission} style={{ color: colorOption[valueOption.Permission]}}>
            P
          </option>
          <option value={valueOption.NonPermission} style={{ color: colorOption[valueOption.NonPermission] }}>
            KP
          </option>
        </NativeSelect>
      </FormControl>
    </>
  );
}
