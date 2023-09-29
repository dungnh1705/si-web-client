import React, { Fragment } from 'react'
import { Skeleton } from '@material-ui/lab'

export const SumAbsent = ({ totalAbsents }) => {
  if (!totalAbsents)
    return (
      <Fragment>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
      </Fragment>
    )

  return (
    <Fragment>
      <td className="text-center">{totalAbsents?.totalMassPermission + totalAbsents.totalMassNonPermission}</td>
      <td className="text-center">{totalAbsents?.totalClassPermission + totalAbsents.totalClassNonPermission}</td>
    </Fragment>
  )
}
