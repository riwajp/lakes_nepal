import ReactMapGL, { Popup, Layer, Source } from "react-map-gl";
import { useState, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

import { geoContains } from "d3";
import { Bar } from "react-chartjs-2";
import mapboxgl from "mapbox-gl";

function Map(props) {
  const { selected_devreg, devRegs_districts, selected_district } = props;

  const { width, height, ref } = useResizeDetector();
  const data_devregs = props.devregData;
  const data_districts = props.districtsData;
  const lakesData = props.lakesData;
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

  useEffect(() => {
    update_viewport({ ...viewport, width: "100%", height: "100vh" });
  }, [width, height]);

  function hover_handler(lngLat) {
    //console.log(lngLat);
    var hovered_devreg = [];
    var hovered_district = [];
    if (!selected_devreg) {
      hovered_devreg = data_devregs.features.filter((f) =>
        geoContains(f, lngLat)
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
        geoContains(f, lngLat)
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
      data_devregs.features.filter((f) => geoContains(f, lngLat)).length === 0
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

  /*mapboxgl.workerClass =
    require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
    */

  var districtsFill;
  if (selected_devreg) {
    districtsFill = {
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "DISTRICT"], selected_district],
          "pink",
          [
            "case",
            [
              "in",
              ["get", "DISTRICT"],
              ["literal", devRegs_districts[selected_devreg]],
            ],
            "red",
            "rgba(20,200,20,0.3)",
          ],
        ],

        "fill-outline-color": [
          "case",
          [
            "in",
            ["get", "DISTRICT"],
            ["literal", devRegs_districts[selected_devreg]],
          ],
          "black",
          "rgba(0,0,0,0)",
        ],
      },
    };
  }
  function getCursor({ isHovering, isDragging }) {
    return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
  }
  return (
    <div ref={ref}>
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
        getCursor={getCursor}
      >
        <Source id="devRegs" type="geojson" data={data_devregs} />
        <Source id="districts" type="geojson" data={data_districts} />

        <div>
          <Layer
            type="fill"
            paint={{
              "fill-color": "rgba(20,200,20,0.3)",

              "fill-outline-color": "white",
            }}
            source="devRegs"
          ></Layer>

          <Layer
            type="line"
            paint={{ "line-width": 2, "line-color": "black" }}
            source="devRegs"
          ></Layer>
        </div>

        <div>
          <div>
            {selected_devreg && (
              <Layer {...districtsFill} source="districts"></Layer>
            )}
          </div>
        </div>

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
