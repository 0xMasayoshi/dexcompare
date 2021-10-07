import { gql } from '@apollo/client'

export function blocksQueryFactory(timestamps, key) {
  const queryBody = timestamps.reduce(
    (query, timestamp, i) =>
      (query += `${
        key + i
      }: blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_lte: ${timestamp} }) {
        number
      }
      `),
    ''
  )

  return gql`
      query blocksQuery {${queryBody}}
    `
}
