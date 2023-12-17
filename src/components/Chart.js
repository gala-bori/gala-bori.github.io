import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

function Chart({ ratings, personName }) {
const chartRef = useRef(null);

  useEffect(() => {
    const data = [ //define data for box plot
      {
        x: ratings,
        type: 'box',
        name: '', //Remove grouping name
        boxpoints: 'all',
        marker:{
          color: 'rgb(0, 128, 117)'}
      }
    ];

    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);

    const layout = { //set layout for boxplot
      title: `IMDb Ratings Box Plot for ${personName}`,
      xaxis: {
        range: [minRating, maxRating]
      },
      yaxis: {
        title: 'IMDb Rating'
      },
      staticPlot: true // Disable plot interactivity
    };

    // Render the plot using data and layout
    Plotly.newPlot(chartRef.current, data, layout);

    // Generate static boxplot image 
    Plotly.toImage(chartRef.current, { format: 'png', width: 800, height: 400 })
      .then(dataUrl => {
        const imgElement = document.getElementById('chartImage');
        imgElement.src = dataUrl;

        // Hide the interactive plot
        chartRef.current.style.display = 'none';
      })
      .catch(error => {
        console.error('Error generating plot image:', error);
      });
  }, [ratings, personName]);

  return ( //Renders static image of interactive boxplot
    <div>
      <div ref={chartRef}></div>
      <img id="chartImage" alt="Box Plot" />
    </div>
  );
}

export default Chart;