const URL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to update the demographic info panel
function updateDemographicInfo(subjectId, data) {
  const subjectMetadata = data.metadata.find(metadatum => metadatum.id == subjectId);

  // Select the panel with id of `#sample-metadata`
  const panel = d3.select("#sample-metadata");

  // Clear any existing metadata
  panel.html("");

  // Add each key-value pair to the panel
  Object.entries(subjectMetadata).forEach(([key, value]) => {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
}


// Function to update the bar chart
function updateBarChart(result) {
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
    title: `Top 10 OTUs Found in Individual ${result.id}`,
    margin: { l: 100, r: 100, t: 100, b: 100 }
  };

  // Render the bar chart
  Plotly.newPlot('bar', [trace], layout);
}


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


// Function to handle the change event of the dropdown
function optionChanged(newSubjectId) {
  // Fetch the data again and update the bar chart
  d3.json(URL).then(data => {
    updateDemographicInfo(newSubjectId, data);

    const samples = data.samples;
    const subjectSampleData = samples.find(s => s.id === newSubjectId)
    updateBarChart(subjectSampleData);
    createBubbleChart(subjectSampleData)
  });
}


//Function to initialize the dashboard
function init() {
  d3.json(URL).then(data => {
    // Populate the dropdown menu
    const ids = data.names;
    const dropdown = d3.select("#selDataset");
    ids.forEach(id => {
      dropdown.append("option").text(id).property("value", id);
    });

    const firstSubject = ids[0];
    optionChanged(firstSubject);
  });
}

init();


