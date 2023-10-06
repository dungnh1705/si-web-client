import React, { Fragment } from 'react'

export const SumFieldAbsent = ({ totalAbsents }) => {
  return <td className="text-center">{totalAbsents}</td>
}

export const SumAbsent = ({ totalMassAbsents, totalClassAbsents }) => {
  return (
    <Fragment>
      <SumFieldAbsent totalAbsents={totalMassAbsents} />
      <SumFieldAbsent totalAbsents={totalClassAbsents} />
    </Fragment>
  )
}
