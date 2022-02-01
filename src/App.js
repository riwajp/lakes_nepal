import "./App.css";
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { geoContains } from "d3";
import devregData from "./data/nepal-development-regions";
import lakesData from "./data/lakes_nepal";
import districtsData from "./data/nepal-districts";
import Map from "./components/Map";
import Menu from "./components/Menu";

function App() {
  const [devRegs_districts, update_devRegs_districts] = useState(null);
  const [devRegs_lakes, update_devRegs_lakes] = useState(null);
  const [selected_devreg, update_selected_devreg] = useState(null);
  const [selected_district, update_selected_district] = useState(null);
  console.log(selected_devreg);
  if (selected_devreg) {
    console.log(devRegs_districts[selected_devreg]);
  }

  /*
  console.log(
    geoContains(
      devregData.features[0],
      [80.65380096435547, 28.978796005249023]
    )
  );
  */
  function devRegs_districts_mapper() {
    const districts = districtsData.features.map((f) => f.properties.DISTRICT);
    const developmentRegions = devregData.features.map(
      (f) => f.properties.REGION
    );
    const districts_by_dev_regs = {};

    for (var i = 0; i < developmentRegions.length; i++) {
      const districts = [];
      for (var j = 0; j < districtsData.features.length; j++) {
        if (
          geoContains(
            devregData.features[i],
            districtsData.features[j].geometry.coordinates[0][10]
          )
        ) {
          districts.push(districtsData.features[j].properties.DISTRICT);
        }
      }
      districts_by_dev_regs[developmentRegions[i]] = districts;
    }

    update_devRegs_districts(districts_by_dev_regs);
  }
  if (devRegs_districts === null) {
    devRegs_districts_mapper();
  }
  console.log(lakesData);
  function devRegs_lakes_mapper() {
    const devRegs = Object.keys(devRegs_districts);
    const lakes_by_dev_regs = {};
    for (var i = 0; i < devRegs.length; i++) {
      const districts = devRegs_districts[devRegs[i]];
      var lakes = 0;
      for (var j = 0; j < lakesData.records.length; j++) {
        if (districts.indexOf(lakesData.records[j][2].toUpperCase()) !== -1) {
          lakes += lakesData.records[j][3];
        }
      }
      lakes_by_dev_regs[devRegs[i]] = lakes;
    }
    console.log(lakes_by_dev_regs);
    update_devRegs_lakes(lakes_by_dev_regs);
    console.log(devRegs_lakes);
  }

  if (devRegs_districts && devRegs_lakes == null) {
    devRegs_lakes_mapper();
  }

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Map
              selected_devreg={selected_devreg}
              devRegs_districts={devRegs_districts}
              selected_district={selected_district}
              lakesData={lakesData}
              districtsData={districtsData}
              devregData={devregData}
            />
          </Grid>
          <Grid
            item
            xs={6}
            className="menu_container"
            style={{ maxHeight: "100vh", overflow: "auto" }}
          >
            <Menu
              selected_devreg={selected_devreg}
              update_selected_devreg={update_selected_devreg}
              devRegs_districts={devRegs_districts}
              selected_district={selected_district}
              update_selected_district={update_selected_district}
              devRegs_lakes={devRegs_lakes}
              lakesData={lakesData}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
