// This function runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Find the container element in the HTML
  const sadhanaContainer = document.getElementById('sadhana-content');

  // If the container doesn't exist, stop the script
  if (!sadhanaContainer) {
    console.error('Sadhana container not found!');
    return;
  }

  // Fetch the data from the JSON file
  fetch('sadhana.json')
    .then(response => {
      // Check if the file was found
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      // Parse the response as JSON
      return response.json();
    })
    .then(data => {
      // Start with an empty string to build our HTML
      let htmlContent = '';

      // Add the introduction text
      htmlContent += `<p><em>${data.introduction}</em></p><hr>`;

      // Loop through each principle in the 'principles' array
      data.principles.forEach(principle => {
        htmlContent += `
          <article style="margin-top: 20px;">
            <h3>${principle.id}. ${principle.title}</h3>
            <p>${principle.description}</p>
        `;

        // Check if there are any points and loop through them
        if (principle.points && principle.points.length > 0) {
          htmlContent += '<ul>';
          principle.points.forEach(point => {
            htmlContent += `
              <li>
                <strong>${point.title}:</strong> ${point.details}
              </li>
            `;
          });
          htmlContent += '</ul>';
        }
        htmlContent += '</article>';
      });

      // Add the conclusion text
      htmlContent += `<hr><p><em>${data.conclusion}</em></p>`;

      // Insert the generated HTML into the container
      sadhanaContainer.innerHTML = htmlContent;
    })
    .catch(error => {
      // If there's an error (e.g., file not found), display it in the container
      sadhanaContainer.innerHTML = `<p style="color: red;">Failed to load Sadhana content: ${error}</p>`;
      console.error('There has been a problem with your fetch operation:', error);
    });
});