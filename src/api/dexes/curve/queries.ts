import { gql } from '@apollo/client'

export const weeklyVolumeQuery = gql`
  query weeklyVolumesQuery($first: Int! = 1000, $orderBy: String! = "timestamp", $orderDirection: String! = "desc") {
    weeklyVolumes(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      timestamp
      volume
    }
  }
`
