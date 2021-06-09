import React from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import ReactMapGL from 'react-map-gl'

function App() {

  const [flights, setFlights] = React.useState(null)

  const [activeFlights, setActiveFlights] = React.useState(null)

  const [viewport, setViewport] = React.useState({
    latitude: 51.501476,
    longitude: -0.140634,
    zoom: 0,
  })

  const url = 'http://api.aviationstack.com/v1/flights?access_key=e23e5bd4ffb17c11f5c52babe0741ab0'

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(url)
        const filteredFlights = data.data.filter(flight => {
          return flight.flight_status === 'active'
        }
        )
        setFlights(data.data)
        setActiveFlights(filteredFlights)

      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])

  

  console.log(flights)

  // function getActiveFlights() {

  // }

  console.log(activeFlights)


  return (
    <section>
      <div className="map-container">
        <ReactMapGL
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          height="100%"
          width="100%"
          mapStyle='mapbox://styles/mapbox/light-v10'
          {...viewport}
          // onClick={() => setPopup(null)}
          onViewportChange={viewport => setViewport(viewport)}
        >
          
        </ReactMapGL>
      </div>
      <div>
        <h1>Flight Tracker</h1>
        {flights ?
          flights.map(flight => (
            <p key={flight.flight.number}>{flight.flight_status}</p>
          ))
          :
          <p>...loading</p>
        }
      </div>
    </section>



  )
}

export default App
