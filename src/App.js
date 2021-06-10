import React from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

function App() {

  const [flights, setFlights] = React.useState(null)

  const [activeFlights, setActiveFlights] = React.useState(null)

  const [popup, setPopup] = React.useState(null)

  const [viewport, setViewport] = React.useState({
    latitude: 51.501476,
    longitude: -0.140634,
    zoom: 0,
  })

  const url = 'https://opensky-network.org/api/states/all'

  
  React.useEffect(() => {
    setInterval(() => {
      const getData = async () => {
        try {
          const { data } = await axios.get(url)
          // console.log(data.states)
          const filteredFlights = data.states.filter(flight => {
            if (flight[7] && flight[6]) {
              return flight[2]
            }
          })
          setFlights(data.states)
          setActiveFlights(filteredFlights)
  
        } catch (err) {
          console.log(err)
        }
      }
      getData()
    }, 1000)

  }, [])

  console.log(flights)

  return (
    <section>
      <div>
        <h1>Flight Tracker</h1>
      </div>
      <div className="map-container">
        <ReactMapGL
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          height="100%"
          width="100%"
          mapStyle='mapbox://styles/mapbox/light-v10'
          {...viewport}
          onClick={() => setPopup(null)}
          onViewportChange={viewport => setViewport(viewport)}
        >
          {activeFlights ?
            activeFlights.map(flight => (
              <Marker
                className='map-markers'
                key={flight[0]}
                latitude={flight[6]}
                longitude={flight[5]}
              >
                <span
                  role="img"
                  aria-label="map-marker"
                  onClick={() => setPopup(flight)}
                >
                  ✈
                </span>
              </Marker>
            ))
            :
            '💥'
          }
          {popup &&
          <Popup
            closeOnClick={true}
            latitude={popup[6]}
            longitude={popup[5]}
            closeButton={false}
          >
            <h4>Origin: {popup[2]}</h4>
            <h4>Altitude: {popup[7] * 3.28084} ft</h4>
            <h4>Ground Velocity: {popup[9] * 2.23694} mph</h4>
            <h4>{popup[8]}</h4>
            <h4>Vertical rate: {popup[11]} m/s</h4>
          </Popup>
          }
        </ReactMapGL>
      </div>
    </section>



  )
}

export default App
