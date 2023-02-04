import React from 'react'
import { useRecoilValue } from 'recoil'
import { Divider, Grid } from '@material-ui/core'

import { orderBy } from 'lodash'

import { TemplateType } from 'app/enums'
import { TemplatesQuery } from 'recoils/selectors'

import FormItem from './FormItem'

const Forms = () => {
  const myTemplates = useRecoilValue(TemplatesQuery)

  return (
    <>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">BIỂU MẪU</h4>
            </div>
          </div>
          <Divider />
          {orderBy(
            myTemplates?.filter(t => t.templateType === TemplateType.Document),
            ['name']
          )?.map(item => (
            <FormItem key={item.id} item={item} />
          ))}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">BÁO CÁO</h4>
            </div>
          </div>
          <Divider />

          {orderBy(
            myTemplates?.filter(t => t.templateType === TemplateType.Report),
            ['name']
          )?.map(item => (
            <FormItem key={item.id} item={item} />
          ))}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">EMAIL TỰ ĐỘNG</h4>
            </div>
          </div>
          <Divider />

          {orderBy(
            myTemplates?.filter(t => t.templateType === TemplateType.SystemTemplate),
            ['name']
          )?.map(item => (
            <FormItem key={item.id} item={item} />
          ))}
        </div>
      </Grid>
    </>
  )
}

export default Forms
