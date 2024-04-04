// Function to initialize the dashboard
function init() {
    // Fetch the JSON data
    const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
    d3.json(url).then(data => {
      // Populate the dropdown menu
      const names = data.names;
      const dropdown = d3.select("#selDataset");
      names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
      });
  
      
      const firstSample = names[0];
      updateBarChart(firstSample, data);
    });
  }
  
  // Function to update the bar chart
  function updateBarChart(sample, data) {
    const samples = data.samples;
    const result = samples.find(s => s.id === sample);
  
    //
    const otu_ids = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
    const sample_values = result.sample_values.slice(0, 10);
    const otu_labels = result.otu_labels.slice(0, 10);
  
    // Create the trace
    const trace = {
      x: sample_values.reverse(),
      y: otu_ids.reverse(),
      text: otu_labels.reverse(),
      type: 'bar',
      orientation: 'h'
    };
  
    const layout = {
      title: `Top 10 OTUs Found in Individual ${sample}`,
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };
  
    // Render the bar chart
    Plotly.newPlot('bar', [trace], layout);
  }
  
  // Function to handle the change event of the dropdown
  function optionChanged(newSample) {
    // Fetch the data again and update the bar chart
    const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
    d3.json(url).then(data => updateBarChart(newSample, data));
  }

  init();
  





  // Fetch the data and populate the dropdown
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    
    const names = data.names;
    const dropdown = d3.select("#selDataset");
    
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
  
    // Update the dashboard with the first sample's data
    updateDashboard(names[0], data);
  });
  
  // Function to update the dashboard
  function updateDashboard(newSampleId, data) {
    const sampleData = data.samples.find(sample => sample.id === newSampleId);
    createBubbleChart(sampleData);
  }
  
  // Function to create a bubble chart
  function createBubbleChart(sampleData) {
    const trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth'
      },
      text: sampleData.otu_labels
    };
  
    const layout = {
      title: 'Belly Button Biodiversity - Samples',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      margin: { t: 30 }
    };
  
    Plotly.newPlot('bubble', [trace1], layout);
  }
  
  // Function called by DOM changes
  function optionChanged(newSampleId) {
    // Fetch the data again and update
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => updateDashboard(newSampleId, data));
  }
  

  //4

  // Function to update the demographic info panel
function updateDemographicInfo(sampleId, data) {
    const metadata = data.metadata.find(sample => sample.id == sampleId);
    
    // Select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
  
    // Clear any existing metadata
    panel.html("");
  
    // Add each key-value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }

  // Function to handle the change event of the dropdown
function optionChanged(newSampleId) {
    // Fetch the data again and update the demographic information
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
      updateDemographicInfo(newSampleId, data);
      // Additionally, update charts if needed
    });
  }
  
  // Initialize the dashboard
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    // Populate the dropdown menu
    const names = data.names;
    const dropdown = d3.select("#selDataset");
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
  
    // Update the demographic info with the first sample's data
    updateDemographicInfo(names[0], data);
    // Additionally, render charts with the first sample's data if needed
  });
  
// Advanced challenge


// Function to create a gauge chart
function createGaugeChart(wfreq) {
    // Calculate the angle for the needle
    var level = parseFloat(wfreq) * 20; // Scale the frequency from 0-9 to 0-180
  
    // Trig to calculate the needle position
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Create the main path for the needle
    var mainPath = 'M -.0 -0.05 L .0 0.05 L ';
    var pathX = String(x);
    var space = ' ';
    var pathY = String(y);
    var pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    var data = [
      {
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { size: 12, color: '850000' },
        showlegend: false,
        name: 'frequency',
        text: level,
        hoverinfo: 'text+name'
      },
      {
        type: 'pie',
        showlegend: false,
        hole: 0.5,
        rotation: 90,
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: [
            'rgba(255, 255, 255, 0.5)',
            'rgba(232, 226, 202, .5)',
            'rgba(210, 206, 145, .5)',
            'rgba(202, 209, 95, .5)',
            'rgba(170, 202, 42, .5)',
            'rgba(110, 154, 22, .5)',
            'rgba(14, 127, 0, .5)',
            'rgba(10, 120, 22, .5)',
            'rgba(0, 105, 11, .5)',
            'rgba(255, 255, 255, 0)'
          ],
          labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
          hoverinfo: 'label'
        }
      }
    ];
  
    var layout = {
      shapes: [
        {
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }
      ],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
  
    Plotly.newPlot('gauge', data, layout);
  }
  

// Function to handle the change event of the dropdown
function optionChanged(newSampleId) {
    // Fetch the data again and update the demographic information and charts
    d3.json("https://plot.ly/javascript/gauge-charts").then(data => {
      const metadata = data.metadata.find(sample => sample.id == newSampleId);
      createGaugeChart(metadata.wfreq); // Assuming 'wfreq' is your washing frequency value
      // Call other update functions as necessary
    });
  }
  

