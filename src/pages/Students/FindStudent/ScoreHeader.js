import React from 'react'
import { ScoreFormTitle } from 'app/enums'

export default function ScoreHeader({ scoreLabels }) {
  return (
    <>
      {scoreLabels.map((l, index) => (
        <th key={index} style={{ textAlign: 'center' }}>
          {ScoreFormTitle[l.Label]}
        </th>
      ))}
    </>
  )
}
