// /app/inventory/3d-view/components/RequestLines.tsx

import { useMemo } from 'react'
import { Vector3 } from 'three'
import { Line } from '@react-three/drei'
import { RequestLine as RequestLineType } from '../types/inventory3d'

interface RequestLinesProps {
  lines: RequestLineType[]
}

export const RequestLines = ({ lines }: RequestLinesProps) => {
  return (
    <>
      {lines.map((line) => (
        <RequestLine key={line.id} line={line} />
      ))}
    </>
  )
}

const RequestLine = ({ line }: { line: RequestLineType }) => {
  const points = useMemo(() => [
    new Vector3(line.from.x, line.from.y, line.from.z),
    new Vector3(line.to.x, line.to.y, line.to.z)
  ], [line])

  return (
    <Line
      points={points}
      color={line.color}
      lineWidth={2}
      dashed={false}
    />
  )
}