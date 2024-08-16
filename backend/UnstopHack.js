const axios = require('axios');

// Function to fetch hackathon details from a single page
async function fetchHackathonsFromPage(pageNumber) {
  const url = `https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=${pageNumber}`;
  try {
    const { data } = await axios.get(url);
    return data.data.data; // Return the array of hackathons
  } catch (error) {
    console.error('Error fetching hackathon details:', error);
    return [];
  }
}

// Function to parse hackathon details
function parseHackathon(hackathon) {
  const title = hackathon.title || 'N/A';
  const collegeName = hackathon.organisation ? hackathon.organisation.name : 'N/A';
  const seoUrl = hackathon.seo_url || 'N/A';
  const logoUrl = hackathon.logoUrl2 || '';

  // Extract days left from remain_days field
  const daysLeft = hackathon.regnRequirements ? hackathon.regnRequirements.remain_days : 'N/A';

  return {
    title,
    collegeName,
    seoUrl,
    logoUrl,
    daysLeft
  };
}

// Function to fetch hackathons from multiple pages
async function fetchAllHackathons(totalPages) {
  const pagePromises = [];
  for (let page = 1; page <= totalPages; page++) {
    pagePromises.push(fetchHackathonsFromPage(page));
  }
  const allHackathons = await Promise.all(pagePromises);
  return allHackathons.flat();
}

// Main function to fetch and display hackathons
async function displayHackathons() {
  const totalPages = 100;
  const hackathons = await fetchAllHackathons(totalPages);

  const parsedHackathons = hackathons.map(parseHackathon);
  console.log(JSON.stringify({ hackathons: parsedHackathons }));
}

// Fetch and display hackathons
displayHackathons().catch(error => {
  console.error('Error displaying hackathons:', error);
});