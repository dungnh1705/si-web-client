import React from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment'

export default function DateField(props) {
  const DatePicker_Props = () => {
    return {
      fullWidth: true,
      inputVariant: 'outlined',
      InputLabelProps: { shrink: true },
      format: props.cusFormat ?? 'dd/MM/yyyy',
      placeholder: props.cusFormat ? 'Tháng / Năm' : 'Ngày / Tháng / Năm',
      KeyboardButtonProps: {
        'aria-label': 'change date'
      },
      InputProps: {
        readOnly: props.readOnly
      },
      InputAdornmentProps: {
        disablePointerEvents: props.readOnly
      }
    }
  }

  return (
    <KeyboardDatePicker
      {...DatePicker_Props()}
      {...props}
      value={props.value ? moment(props.value, props.cusFormat ? 'MM/YYYY' : 'YYYY-MM-DD').format(props.cusFormat ? 'yyyy-MM' : 'yyyy-MM-DD') : null}
    />
  )
}
