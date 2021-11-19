const config = {
  wUrl: "https://api.openweathermap.org/data/2.5/",
  wKey: "cf87a9e4938d8fbf85f279a3b8c2e0aa",
};


// Create a modal

      // Get the modal
      let modal = document.getElementById("myModal");
      
      // Get the button that opens the modal
      let btn = document.getElementById("myBtn");
      
      // Get the <span> element that closes the modal
      let span = document.getElementsByClassName("close")[0];
      
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }
      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }



// Get weather info

const getWeather = async (lat, lon, units = "metric") => {
  const apiEndPoint =`${config.wUrl}weather?lat=${lat}&lon=${lon}&APPID=${config.wKey}&units=${units}`;

  try {
    const response = await fetch(apiEndPoint);
    if (response.status != 200) {
      if (response.status == 404) {
        weatherDiv.innerHTML = `<div class="alert-danger">
                              <h3>Oops! No data available.</h3>
                              </div>`;
      } else {
        throw new Error(
          `Something went wrong, status code: ${response.status}`
        );
      }
    }
    const weather = await response.json();
    return weather;
  } catch (error) {
    console.log(error);
  }
};

const getDateTime = (unixTimeStamp) => {
  const milliSeconds = unixTimeStamp * 1000;
  const dateObject = new Date(milliSeconds);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const humanDateFormate = dateObject.toLocaleDateString("en-US", options);
  return humanDateFormate;
};

// Display Weather
const displayWeather = (data) => {
  const wheatherWidget = `<div class="card">
    <div class="card-body">
        <h5 class="card-title">${data.name}, ${
    data.sys.country
  } 
        </h5>
        <p>${getDateTime(data.dt)}</p>
        <div id="tempcard"><h6 class="card-subtitle mb2 cel"> ${data.main.temp}</h6>
        <p class="card-text">Feels Like: ${data.main.temp}</p>
        <p class="card-text">Max: ${data.main.temp_max} °C, Min: ${data.main.temp_min} °C</p></div>
        ${data.weather
          .map(
            (
              w
            ) => `<div id="img-container">${w.main} <img src="https://openweathermap.org/img/wn/${w.icon}.png" /></div>
        <p>${w.description}</p>`
          )
          .join("\n")}
        
    </div>
</div>`;
  weatherDiv.innerHTML = wheatherWidget;
};

// Loader from bootstrap
const getLoader = () => {
  return `<div class="spinner-grow text-info" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;
};

const weatherDiv = document.querySelector("#weatherwidget");

// Creating map

      // Initialize the platform object:
      let platform = new H.service.Platform({
        'apikey': '{45odJpnbwl_ldJkK4E1NX1Nem46fsRWZvphOTZy29w8}'
      });

      // Obtain the default map types from the platform object
      let maptypes = platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      let map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
          zoom: 1,
          center: { lat: 28.704060, lng: 77.102493 }
        });

        // Map UI and controls
        let ui = H.ui.UI.createDefault(map, maptypes);


        let mapEvents = new H.mapevents.MapEvents(map);
        let behavior = new H.mapevents.Behavior(mapEvents);
        map.addEventListener("tap", async function(evt) {
            const position = map.screenToGeo(
                evt.currentPointer.viewportX,
                evt.currentPointer.viewportY
                );
            console.log(position.lat); 
            console.log(position.lng);
            weatherDiv.innerHTML = getLoader();
            const weatherInfo = await getWeather(position.lat, position.lng);
            displayWeather(weatherInfo);
            modal.style.display = "block";

        });

