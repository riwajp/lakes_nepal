import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import lakesData from "../data/lakes_nepal";

const Menu = (props) => {
  const {
    selected_devreg,
    update_selected_devreg,
    devRegs_districts,
    selected_district,
    update_selected_district,
    devRegs_lakes,
  } = props;

  const barChartData = {
    labels: Object.keys(devRegs_lakes),
    datasets: [
      {
        data: Object.keys(devRegs_lakes).map((k) => devRegs_lakes[k]),
        label: "No. of Lakes",
        borderColor: "#3333ff",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: true,
      },
    ],
  };
  var districtsbarChartData;
  if (selected_devreg) {
    districtsbarChartData = {
      labels: devRegs_districts[selected_devreg],
      datasets: [
        {
          data: devRegs_districts[selected_devreg].map((d) =>
            lakesData.records.filter((f) => f[2].toUpperCase() === d).length ===
            0
              ? 0
              : lakesData.records.filter((f) => f[2].toUpperCase() === d)[0][3]
          ),
          label: "No. of Lakes",
          borderColor: "#3333ff",
          backgroundColor: "rgba(0, 0, 255, 0.5)",
          fill: true,
        },
      ],
    };

    console.log(
      devRegs_districts[selected_devreg].map((d) =>
        lakesData.records.filter((f) => f[2].toUpperCase() === d).length === 0
          ? 0
          : lakesData.records.filter((f) => f[2].toUpperCase() === d)[0][3]
      )
    );
  }
  var onedistrictbarChartData;
  if (selected_district) {
    const lakes =
      lakesData.records.filter((r) => r[2].toUpperCase() === selected_district)
        .length === 0
        ? [0, 0, 0, 0, 0, 0]
        : lakesData.records.filter(
            (r) => r[2].toUpperCase() === selected_district
          )[0];
    onedistrictbarChartData = {
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
    <div style={{ width: "100%" }}>
      <h1>Lakes in Nepal</h1>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Development Region
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selected_devreg ? selected_devreg : null}
          label="Age"
          onChange={(e) => {
            update_selected_devreg(e.target.value);
            update_selected_district(null);
          }}
        >
          <MenuItem value={null}>None</MenuItem>
          {Object.keys(devRegs_districts).map((d) => (
            <MenuItem value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <br />
      {selected_devreg && (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">District</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selected_district ? selected_district : null}
            label="Age"
            onChange={(e) => update_selected_district(e.target.value)}
          >
            <MenuItem value={null}>None</MenuItem>
            {devRegs_districts[selected_devreg].map((d) => (
              <MenuItem value={d}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {!selected_devreg && (
        <Bar
          type="bar"
          width={"100%"}
          height={50}
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
          }}
          data={barChartData}
        />
      )}

      <br />
      {selected_devreg && !selected_district && (
        <Bar
          type="bar"
          width={"100%"}
          height={80}
          options={{
            indexAxis: "y",
            title: {
              display: true,
              text: "Lakes by Size",
              fontSize: 15,
            },
            legend: {
              display: true, //Is the legend shown?
              position: "top", //Position of the legend.
            },
          }}
          data={districtsbarChartData}
        />
      )}

      {selected_district && (
        <Bar
          type="bar"
          width={"100%"}
          height={50}
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
          }}
          data={onedistrictbarChartData}
        />
      )}
    </div>
  );
};

export default Menu;
