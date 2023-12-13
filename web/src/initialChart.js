const chart = new Chart(document.getElementById("myChart"), {
  type: "line",
  options: {
    scales: {
      x: {
        title: {
          text: "Time (s)",
          display: true,
          color: "#cdd6f4",
        },
        ticks: { color: "#cdd6f4" },
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
        grid: { color: "#313244" },
      },
      y1: {
        title: {
          text: "Temperature (°F)",
          display: true,
          color: "#f38ba8",
        },
        type: "linear",
        display: true,
        position: "right",
        ticks: { color: "#f38ba8" },
        grid: { color: "#313244", drawOnChartArea: false },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#cdd6f4" },
      },
      title: {
        display: true,
        text: "lol gotem",
        color: "#cdd6f4",
      },
    },
  },
  data: {
    datasets: [
      {
        label: "Temperature",
        yAxisID: "y1",
        data: [],
        fill: false,
        borderColor: "rgb(243, 139, 168)",
        backgroundColor: "rgba(243, 139, 168, 0.05)",
      },
      {
        label: "Power",
        yAxisID: "y",
        data: [],
        fill: false,
        borderColor: "rgb(166, 227, 161)",
        backgroundColor: "rgba(166, 227, 161, 0.05)",
      },
    ],
  },
});
