import ReactMapGL, { Marker, Popup, Layer, Source } from "react-map-gl";
import { useState, useRef, createRef } from "react";
import data_devregs from "../data/nepal-development-regions";
import data_districts from "../data/nepal-districts";
import lakesData from "../data/lakes_nepal";
import * as d3 from "d3";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";

function Map(props) {
  const { selected_devreg, devRegs_districts, selected_district } = props;
  const [centerLatLongs, update_centerLatLongs] = useState({
    lat: 28,
    long: 84,
  });
  const [hoverDr, update_hoverDr] = useState(null);
  const [hoverDistrict, update_hoverDistrict] = useState(null);
  const [hoverlongLat, updatelongLat] = useState(null);

  const [viewport, update_viewport] = useState({
    //latitude: 27.880357,
    //longitude: 84.711398,
    latitude: centerLatLongs.lat,
    longitude: centerLatLongs.long,
    zoom: 6,
    maxZoom: 20,
    minZoom: 1,
    width: "100%",
    height: "100vh",
  });
  const token =
    "pk.eyJ1Ijoicml3YWpwIiwiYSI6ImNreGhqdmNrcTJheXUyeHRoZGV4Mm9qZTAifQ.krIdQfzikO4kh6g3j6ClLg";
  /*
  const ref1 = useRef();

  if (ref1 && ref1.current) {
    ref1.current.addEventListener("mousemove", (e) => console.log("s"));
  }*/

  function hover_handler(lngLat) {
    //console.log(lngLat);
    var hovered_devreg = [];
    var hovered_district = [];
    if (!selected_devreg) {
      hovered_devreg = data_devregs.features.filter((f) =>
        d3.geoContains(f, lngLat)
      );
      if (hovered_devreg.length === 1) {
        update_hoverDr(hovered_devreg[0]);
      }
    } else if (selected_devreg) {
      const temp_data_districts = data_districts.features.filter(
        (f) =>
          devRegs_districts[selected_devreg].indexOf(f.properties.DISTRICT) !==
          -1
      );
      hovered_district = temp_data_districts.filter((f) =>
        d3.geoContains(f, lngLat)
      );
      if (hovered_district.length === 1) {
        update_hoverDistrict(hovered_district[0]);
      } else {
        update_hoverDistrict(null);
      }
    }
  }

  function mapHover(lngLat) {
    hover_handler(lngLat);

    if (
      data_devregs.features.filter((f) => d3.geoContains(f, lngLat)).length ===
      0
    ) {
      updatelongLat(null);
    } else {
      updatelongLat(lngLat);
    }
  }
  var lakes;
  var barChartData;
  if (hoverDistrict) {
    lakes = lakesData.records.filter(
      (d) => d[2].toUpperCase() === hoverDistrict.properties.DISTRICT
    );
    if (lakes.length > 0) {
      lakes = lakes[0];
    }
    barChartData = {
      labels: [
        "<100m",
        "100-499m",
        "500-1999m",
        "2000-2999m",
        "3000-4999m",
        ">5000m",
      ],
      datasets: [
        {
          axis: "x",
          data: [lakes[4], lakes[5], lakes[6], lakes[7], lakes[8], lakes[9]],
          label: "No. of Lakes",
          borderColor: "#3333ff",
          backgroundColor: "rgba(0, 0, 255, 0.5)",
          fill: true,
        },
      ],
    };
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={token}
        onViewportChange={(new_viewport) => update_viewport(new_viewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        doubleClickZoom={false}
        scrollZoom={{ speed: 0.01, smooth: true }}
        /* onZoomChange={""}
        onClick={""}
        onWheel={""}*/
        onHover={(e) => mapHover(e.lngLat)}
      >
        {data_devregs.features.map((f) => (
          <div>
            <Layer
              type="fill"
              paint={{
                "fill-color": "green",
                "fill-opacity": 0.3,
                "fill-outline-color": "white",
              }}
              source={{
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: f.geometry.coordinates,
                  },
                },
              }}
            ></Layer>

            <Layer
              type="line"
              paint={{ "line-width": 2, "line-color": "black" }}
              source={{
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: f.geometry.coordinates,
                  },
                },
              }}
            ></Layer>

            <Layer
              type="symbol"
              layout={{
                "text-field": f.properties.REGION,
                "text-variable-anchor": ["top", "bottom", "left", "right"],
                "text-radial-offset": 0.5,
                "text-justify": "auto",
                "icon-image": "marker-11",
                "icon-size": 2,
              }}
              source={{
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: f.geometry.coordinates,
                  },
                },
              }}
            ></Layer>
          </div>
        ))}

        {data_districts.features.map((f) => (
          <div>
            <div>
              <Layer
                type="fill"
                paint={{
                  "fill-color":
                    f.properties.DISTRICT === selected_district
                      ? "blue"
                      : "green",
                  "fill-opacity":
                    selected_devreg &&
                    devRegs_districts[selected_devreg].indexOf(
                      f.properties.DISTRICT
                    ) !== -1
                      ? 0.5
                      : 0,
                }}
                source={{
                  type: "geojson",
                  data: {
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: f.geometry.coordinates,
                    },
                  },
                }}
              ></Layer>

              <Layer
                type="line"
                paint={{
                  "line-width":
                    selected_devreg &&
                    devRegs_districts[selected_devreg].indexOf(
                      f.properties.DISTRICT
                    ) !== -1
                      ? 0.5
                      : 0,
                  "line-color": "blue",
                }}
                source={{
                  type: "geojson",
                  data: {
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: f.geometry.coordinates,
                    },
                  },
                }}
              ></Layer>
            </div>
          </div>
        ))}

        {!selected_devreg && hoverlongLat && (
          <Popup longitude={hoverlongLat[0]} latitude={hoverlongLat[1]}>
            {hoverDr.properties.REGION}
          </Popup>
        )}

        {hoverDistrict && hoverlongLat && (
          <Popup longitude={hoverlongLat[0]} latitude={hoverlongLat[1]}>
            {hoverDistrict.properties.DISTRICT}{" "}
            <Bar
              type="bar"
              width={200}
              height={200}
              options={{
                title: {
                  display: true,
                  text: "Lakes by Size",
                  fontSize: 15,
                },
                legend: {
                  display: true, //Is the legend shown?
                  position: "top", //Position of the legend.
                },
                indexAxis: "x",
              }}
              data={barChartData}
            />
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}

export default Map;
