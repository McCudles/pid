const chart = new Chart(document.getElementById("myChart"), {
  type: "line",
  options: {
    scales: {
      x: {
        type: "linear",
        title: {
          text: "Time (s)",
          display: true,
          color: "#cdd6f4",
        },
        ticks: { color: "#cdd6f4", callback: (value) => `${value}s` },
        grid: { color: "#313244" },
      },
      y: {
        title: {
          text: "Power (%)",
          display: true,
          color: "#a6e3a1",
        },
        type: "linear",
        display: true,
        position: "left",
        ticks: { color: "#a6e3a1" },
        grid: { color: "#313244", drawOnChartArea: false },
      },
      y1: {
        title: {
          text: "Temperature (°C)",
          display: true,
          color: "#f38ba8",
        },
        type: "linear",
        display: true,
        position: "right",
        // min: 0,
        ticks: { color: "#f38ba8" },
        grid: { color: "#313244" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#cdd6f4" },
      },
      title: {
        display: true,
        text: "PID Controller Lab",
        color: "#cdd6f4",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  },
  data: {
    datasets: [
      {
        label: "Power",
        yAxisID: "y",
        data: [
          { x: 0.5, y: 0.5 },
          { x: 1, y: 1 },
        ],
        fill: false,
        borderColor: "rgb(166, 227, 161)",
        backgroundColor: "rgba(166, 227, 161, 0.05)",
      },
      {
        label: "Temperature",
        yAxisID: "y1",
        data: [],
        fill: true,
        borderColor: "rgb(243, 139, 168)",
        backgroundColor: "rgba(243, 139, 168, 0.05)",
        pointStyle: "triangle",
      },
      {
        label: "Set Point",
        yAxisID: "y1",
        data: [],
        fill: false,
        borderColor: "rgb(69, 71, 90)",
        pointStyle: false,
      },
    ],
  },
});
