function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 13)];
  }
  return color;
}

function chooseColor(level) {
  return COLOR_PALETE[level]
}


COLOR_PALETE = {
  "1": "#fce5cd",
  "2": "#f9cb9c",
  "3": "#e69138",
  "4": "#b45f06",
  "5": "#783f04",
}

LEVEL_LEGEND = {
  "1": "2,536 to 9,800",
  "2": "9,800 to 15,400",
  "3": "15,400 to 26,000",
  "4": "26,000 to 50,600",
  "5": "50,600 to 381,565",
}


let map;
let infowindow;

function showInfo(position, data) {
  const names = new Set([])


  let content = data.filter((x)=>{
    if(names.has(x.name )){
      return false
    }
    else {
      names.add(x.name)
      return true
    }
  }).map(x => `<span style="font-weight: 900">${x.name}:</span> <span>${x.value}</span>`).join("<br>")
  infowindow.setContent(`<div >${content}</div>`)
  infowindow.setPosition(position)
  infowindow.open(map)
}


function initLegend() {
  const legend = document.createElement("div")
  legend.style.padding = "1rem"
  legend.style.margin = "1rem"
  legend.style.border = "1px solid black"
  legend.style.background = "white"
  // legend.style.height = "6rem"

  title = document.createElement("h2")
  title.innerHTML = "Asian American Population"
  legend.appendChild(title)

  for (let level of Object.keys(COLOR_PALETE)) {
    const color = COLOR_PALETE[level]
    const legendText = LEVEL_LEGEND[level]

    const row = document.createElement("div")

    row.innerHTML = `<span style="background-color: ${color};width: 1.5rem;height: 1rem;display:inline-block;margin-right: 0.5rem"></span> <span >${legendText}</span>`
    legend.appendChild(row)
  }
  document.body.appendChild(legend)
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
}

async function initMap() {

  const districtData = await (await fetch("geo_all_data.json")).json()
  // console.log(districtData);


  infowindow = new google.maps.InfoWindow()

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.2101854, lng: -98.7250281},
    zoom: 4.9,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
  });

  // populate the data
  for (let district of districtData) {

    const color = chooseColor(district.level)
    switch (district.type) {
      case "Polygon":
        const region = new google.maps.Polygon({
          paths: district.coordinates,
          strokeColor: '#FFC107',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35
        });
        region.setMap(map);
        const state = {
          color
        }
        region.addListener("click", (event) => {
          showInfo(event.latLng, district.data)
        })

        break
      case "MultiPolygon":
        for (let coords of district.coordinates) {
          const region = new google.maps.Polygon({
            paths: coords,
            strokeColor: '#FFC107',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 1
          });
          region.setMap(map);

        }
        break
      default:

    }
  }

  initLegend()

}

// initMap()
