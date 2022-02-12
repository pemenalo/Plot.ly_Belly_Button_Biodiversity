function demographic(id) {
    let data = d3.json("data/samples.json").then(data => {
        const metadata = data.metadata;
        let demoPanel = d3.select('#sample-metadata')
        demoPanel.html('');
        let filteredData = metadata.filter(sampleName => sampleName.id == id)[0]
        Object.entries(filteredData).forEach(([key, value]) => {
            demoPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function optionChanged(userChoice) {
    demographic(userChoice)
    BuildCharts(userChoice)
}

function BuildCharts(sampleId) {
    let data = d3.json("data/samples.json").then(data => {
        const samples = data.samples;
        const metadata = data.metadata;

        //samples_values
        let filteredSample = samples.filter(sampleName => sampleName.id == sampleId)[0]
        let filteredMetaSample = metadata.filter(sampleName => sampleName.id == sampleId)[0]
        let otu_ids = filteredSample.otu_ids
        let otu_labels = filteredSample.otu_labels
        let samples_values = filteredSample.sample_values
        let wfreq = parseInt(filteredMetaSample.wfreq)

        console.log(otu_ids)
        console.log(otu_labels)
        console.log(samples_values)
        console.log(wfreq)

        function unpack(rows, index) {
            return rows.map(function (row) {
                return row[index];
            });
        }

        function updatePlotly(newdata) {
            Plotly.restyle("pie", "values", [newdata]);
        }
        // Horizontal Chart
        function horizontalChart(dataID) {
            let yticksBar = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
            let data = [
                {
                    y: yticksBar,//otu_ids
                    x: samples_values.slice(0, 10).reverse(),
                    text: otu_labels.slice(0, 10).reverse(), //otu_labels
                    type: 'bar',
                    orientation: 'h',
                    width: 0.6,
                    marker: { color: '(255, 128, 0, 100)' }
                },
            ];
            let layout = {
                title: 'Top 10 OTU\'s',

                showlegend: false,
                xaxis: {
                    tickangle: 0,
                    zeroline: true,
                    title: "Sample Value",
                },
                yaxis: {
                    zeroline: true,
                    gridwidth: 1,
                    title: "OTU ID"
                },
                height: 370,
                width: 750,
                margin: { t: 40, l: 90, b: 35, r: 20 },
                barmode: 'stack',
                colorway : ['#b8860b'],
                paper_bgcolor: "aliceblue",

            };
            Plotly.newPlot('bar', data, layout);
        }

        // Function Bubble chart
        function bubbleChart(dataID) {
            let xticksBubble = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
            var trace1 = {
                x: xticksBubble, //otu_id
                y: samples_values.slice(0, 10).reverse(), // sample_values
                text: otu_labels.slice(0, 10).reverse(), // otu_labels
                mode: 'markers',
                marker: {
                    color: ['rgb(255,20,147)', 'rgb(255, 144, 14)', 'rgb(0,128,0)', 'rgb(255,0,0)','rgb(0,0,128)' ],
                    size: samples_values.slice(0, 10).reverse()
                }
            };

            let dataBubble = [trace1];

            var layout = {
                title: 'Top 10 OTU\'s',
                showlegend: false,
                height: 600,
                width: 1150,
                margin: { t: 40, l: 70, b: 35, r: 20 },
                showlegend: false,
                xaxis: {
                    tickangle: 0,
                    zeroline: false,
                    title: "OTU ID"
                },
                yaxis: {
                    zeroline: false,
                    gridwidth: 1,
                    title: "Sample Value",
                },
                paper_bgcolor: "aliceblue",
            };
            console.log(data)
            Plotly.newPlot('bubble', dataBubble, layout, { scrollZoom: true });
        }
        // The Gauge Chart
        function gauge(dataID) {
            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: wfreq,
                    title: { text: "B.B. Washing Frequency" },
                    type: "indicator",

                    mode: "gauge+number+delta",
                    delta: { reference: 4, increasing: { color: 'green' } },
                    gauge: {
                        axis: { range: [0, 9], tickwidth: 1, tickcolor: "black" },
                        bar: { color: 'red' },
                        steps: [
                            { range: [0, 4], color: "gold" },
                            { range: [4, 9], color: "forestgreen" }
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 1,
                            value: 9
                        }
                    },
                    bgcolor: "aliceblue",
                }
            ];
            var layout = {
                width: 200,
                height: 370,
                margin: { t: 25, r: 25, l: 25, b: 25 },
                paper_bgcolor: "aliceblue",
                font: { color: "black", family: "Liberation Sans" }
            };


            Plotly.newPlot('gauge', data, layout);
        }
        horizontalChart(sampleId)
        bubbleChart(sampleId)
        gauge(sampleId)
    })
}

let data = d3.json("data/samples.json").then(data => {
    console.log(data)
    const samples = data.samples;
    const metadata = data.metadata;
    const names = data.names;
    console.log(samples)
    console.log(metadata)

    // the dropDown button
    let dropDown = d3.select('#selDataset')
    names.forEach(name => {
        dropDown.append('option').text(name).property('value', name);
    });
    demographic('940');
    BuildCharts('940')
})