// get endpoint for samples.json
const endpoint = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Initializes the page with default plot
function init(){
    
    // Select DropDown Menu
    let DropdownMenu =d3.selectAll("#selDataset")
    
    // Fetch JSON Data
    d3.json(endpoint).then(function(data){

        console.log(data)
        let names = data.names
        
        // Add names to drop down menu
        names.forEach(name => {DropdownMenu
            .append("option")
            .text(name)
            .property("value", name)
            
        });
        // Select first entry to fill in charts
        let sampleOne = names[0];

        // Call functions to build charts
        BuildMetaData(sampleOne);
        BuildBarChart(sampleOne);
        BuildBubbleChart(sampleOne);
        }


    );
}


// Initialize funcitons
init()


// Create bar chart function
function BuildBarChart(sample){
    // Select necessary JSON Data
    d3.json(endpoint).then(function(data){
        let samples = data.samples

        // Filter to select sample that matches the sample given
        let sampleValue = samples.filter(result => result.id ==sample)
        let valueData = sampleValue[0]

        // Console log to check value
        console.log(valueData)

        // Save to necessary variables
        let otu_ids = valueData.otu_ids
        let otu_labels = valueData.otu_labels
        let sample_values= valueData.sample_values

        // Console log to check
        console.log(otu_ids, otu_labels, sample_values)

        // Build Trace
        let trace1 = {
            y: otu_ids.slice(0,10).map(id=>`OTU ${id}`).reverse(),
            x: sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"

        }

        // Data Array
        let traceData = [trace1]

        // Create Layout
        let layout = {
            title: "Top 10 OTU found in individual"
        }

        // Create Plot
        Plotly.newPlot("bar", traceData, layout)

    })
}

// Function to build bubble chart
function BuildBubbleChart(sample){
    // Select necessary JSON Data
    d3.json(endpoint).then(function(data){
        let samples = data.samples

        // Filter to select given sample
        let sampleValue = samples.filter(result => result.id ==sample)
        let valueData = sampleValue[0]

        // Console lot to make sure correct data was selected
        console.log(valueData)

        // Save to necessasry variables
        let otu_ids = valueData.otu_ids
        let otu_labels = valueData.otu_labels
        let sample_values= valueData.sample_values

        // Set up trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
            

        }
        // Data Array
        let traceData = [trace1]

        // Format layout
        let layout = {
            title: "Bacteria in sample"
        }

        // Create Plot
        Plotly.newPlot("bubble", traceData, layout)

    })
}

// Function to build metadata
function BuildMetaData(sample){

    // Select Necessary Data
    d3.json(endpoint).then(function(data){
        let metaData = data.metadata

        // Filter data to select correct value
        let sampleMetaData = metaData.filter(result => result.id ==sample)
        let valueData = sampleMetaData[0]
        console.log(valueData)

        // Clear sample metadata
        d3.select("#sample-metadata").html("")

        // Append metadata values
        Object.entries(valueData).forEach(([key,value])=> 
            d3.select("#sample-metadata").append("h4").text(`${key}: ${value}`))
    })
}   

// Function to build charts on option change
function optionChanged(newsample){
    BuildBarChart(newsample)
    BuildMetaData(newsample)
    BuildBubbleChart(newsample)
}