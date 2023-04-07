const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// select the dropdown menu
function init() {
    const menu = d3.select("#selDataset");
    d3.json(url).then(response => {
        const samples = response.names;
        samples.forEach(sample => {
          menu.append("option")
            .text(sample)
            .attr("value", sample);
        });    

        const first_sample = samples[0];
        charts(first_sample);
        metadata(first_sample);
    });
}

init();

//creates a horizontal bar chart
const charts = async sample => {
    const response = await d3.json(url);
    const samples = response.samples;
    const selectedSample = samples.filter(sample_obj => sample_obj.id == sample);
    const first_sample = selectedSample[0];
    const otu_ids = first_sample.otu_ids;
    const otu_labels = first_sample.otu_labels;
    const sample_values = first_sample.sample_values;
    const ytick = otu_ids.slice(0, 10).map(otuID => `OTU: ${otuID}`).reverse()

    const barChart = [{
        type: 'bar',
        x: sample_values.slice(0, 10).reverse(),
        y: ytick,
        orientation: 'h',
        text: otu_labels.slice(0, 10).reverse()
    }];
    Plotly.newPlot('bar', barChart);


//Create a bubble chart
var bubbleChart = [{
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      },
      text: otu_labels
    }];

    var layout = {
      xaxis: {
        title: "OTU ID"
      }
    };

    Plotly.newPlot("bubble", bubbleChart, layout);
  }

//Display the sample metadata
function metadata(sample) {
    d3.json(url).then((response) => {
      var metadata = response.metadata;
      var results = metadata.filter(sample_obj => sample_obj.id == sample);
      var result = results[0];
      var panel = d3.select("#sample-metadata");
      panel.html("")
      var table = panel.append("table").classed("table table-striped", true);
      var tbody = table.append("tbody");
      Object.entries(result).forEach(([key, value]) => {
        var row = tbody.append("tr");
        row.append("td").text(key);
        row.append("td").text(value);
      });
    });
  }
  

//To update all the plots
const optionChanged = new_sample => {
    charts(new_sample);
    metadata(new_sample);
}