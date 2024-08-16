const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch internship details from a single page
async function fetchInternshipsFromPage(pageNumber) {
  const url = `https://internshala.com/internships/page-${pageNumber}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let internships = [];
    $('div.individual_internship').each((index, element) => {
      const title = $(element).find('h3').text().trim() || 'N/A';
      const company = $(element).find('p.company-name').text().trim() || 'N/A';
      const location = $(element).find('div.row-1-item.locations').text().trim() || 'N/A';
      let stipend = $(element).find('span.stipend').text().trim() || 'N/A';
      stipend = stipend.replace('?', 'INR');
      const link = $(element).attr('data-href') ? "https://internshala.com" + $(element).attr('data-href') : 'N/A';

      // Check for logo URL
      let logo = $(element).find('div.internship_logo img').attr('src') || 'N/A';
      
      // Handle relative URL case
      if (logo && !logo.startsWith('http')) {
        logo = "https://internshala.com" + logo;
      }

      internships.push({
        title,
        company,
        location,
        stipend,
        link,
        logo  // Add logo URL to the data
      });
    });

    return internships;
  } catch (error) {
    console.error('Error fetching internship details:', error);
    return [];
  }
}

// Function to fetch internships from multiple pages
async function fetchAllInternships(totalPages) {
  const pagePromises = [];
  for (let page = 1; page <= totalPages; page++) {
    pagePromises.push(fetchInternshipsFromPage(page));
  }
  const allInternships = await Promise.all(pagePromises);
  return allInternships.flat();
}

// Main function to fetch and display internships
async function displayInternships() {
  const totalPages = 100;
  const internships = await fetchAllInternships(totalPages);

  console.log(JSON.stringify({ internships }));
}

// Fetch and display internships
displayInternships().catch(error => {
  console.error('Error displaying internships:', error);
});