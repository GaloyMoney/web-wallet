import { gql } from "@apollo/client"

const businessMapMarkers = gql`
  query businessMapMarkers {
    businessMapMarkers {
      username
      mapInfo {
        title
        coordinates {
          longitude
          latitude
        }
      }
    }
  }
`

export default businessMapMarkers
