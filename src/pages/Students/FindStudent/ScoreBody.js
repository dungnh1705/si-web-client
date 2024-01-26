import React, { Fragment } from 'react'

export default function ScoreBody({ semesterData, headerLength }) {
  if (!semesterData) return <th colSpan={headerLength}></th>

  const scoreFormData = semesterData.scoreForm && JSON.parse(semesterData.scoreForm)

  return (
    <Fragment>
      {scoreFormData ? (
        scoreFormData.map((d, index) => (
          <th key={index} style={{ textAlign: 'center' }}>
            {d.Value}
          </th>
        ))
      ) : (
        <Fragment>
          <th style={{ textAlign: 'center' }}>{semesterData?.oldTest}</th>
          <th style={{ textAlign: 'center' }}>{semesterData?.fifteenTest}</th>
          <th style={{ textAlign: 'center' }}>{semesterData?.lessonTest}</th>
          <th style={{ textAlign: 'center' }}>{semesterData?.semesterTest}</th>
        </Fragment>
      )}
      <th style={{ textAlign: 'center' }}>{semesterData?.average}</th>
      <th style={{ textAlign: 'center' }}>{semesterData?.morality}</th>
      <th style={{ textAlign: 'center' }}>{semesterData?.ranking}</th>
    </Fragment>
  )
}
