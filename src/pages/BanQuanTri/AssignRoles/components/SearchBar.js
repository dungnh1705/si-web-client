import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'

import { Button, Card, CardContent, Grid, MenuItem, TextField } from '@material-ui/core'

import { totalGroupSummaryQuery } from 'pages/Dashboard/recoil'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import { UserFilterAtom } from '../recoil'

export default function SearchBar() {
  const classes = useRecoilValue(totalGroupSummaryQuery)
  const [filter, setFilter] = useRecoilState(UserFilterAtom)

  const validationSchema = Yup.object({})

  const filterForm = useFormik({
    initialValues: {
      status: 2
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnMount: false,
    enableReinitialize: true,
    initialErrors: null
  })

  const TextField_Props = (name, label) => {
    const { values, errors, touched, handleBlur, handleChange } = filterForm
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
      onChange: handleChange
    }
  }

  const handleSearch = () => {
    const values = filterForm.values
    setFilter({ ...values })
  }

  const handleClearFilter = () => {
    filterForm.resetForm()
    setFilter(null)
  }

  useEffect(() => {
    if (!filter){
        const defaultValues = filterForm.values
        console.log(defaultValues)
        setFilter({...defaultValues})
    }
  }, [])
  return (
    <Card className="card-box mb-4">
      <CardContent className="p-3">
        <Grid container item xs={12} justifyContent={'flex-start'} alignItems={'center'} spacing={3}>
          <Grid item xs={12} lg={3}>
            <TextField {...TextField_Props('name', 'Họ và Tên')} autoFocus={true} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select {...TextField_Props('status', 'Trạng thái')}>
              <MenuItem value={2}>Đang hoạt động</MenuItem>
              <MenuItem value={0}>Đã nghỉ</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select {...TextField_Props('position', 'Chức vụ')}>
              <MenuItem value={1028}>Ban điều hành</MenuItem>
              <MenuItem value={32}>Ngành trưởng</MenuItem>
              <MenuItem value={16}>Phân đoàn trưởng</MenuItem>
              <MenuItem value={256}>Phụng vụ</MenuItem>
              <MenuItem value={512}>Học tập</MenuItem>
              <MenuItem value={64}>Kỷ luật</MenuItem>
              <MenuItem value={128}>Sinh hoạt</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select {...TextField_Props('classId', 'Phân Đoàn')}>
              {classes.map(cl => (
                <MenuItem value={cl.id} key={cl.id}>
                  {cl.group.groupName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid container item xs={12} justifyContent={'flex-end'} alignItems={'center'} spacing={2}>
            <Button variant={'contained'} color={'default'} size={'large'} onClick={handleClearFilter} className={'mr-2'}>
              Xóa bộ lọc
            </Button>

            <Button variant={'contained'} color={'primary'} size={'large'} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
