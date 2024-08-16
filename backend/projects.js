const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch project details from a single page
async function fetchProjectsFromPage(pageNumber) {
  const url = `https://www.coursera.org/courses?productTypeDescription=Projects&productTypeDescription=Guided%20Projects&sortBy=BEST_MATCH&index=prod_all_products_term_optimization&page=${pageNumber}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let projects = [];
    $('div.css-1evtm7z').each((index, element) => {
      const project_title = $(element).find('h3.cds-CommonCard-title.css-6ecy9b').text().trim();
      const project_organization = $(element).find('p.cds-ProductCard-partnerNames.css-vac8rf').text().trim();
      const project_URL = "https://www.coursera.org" + $(element).find('a.cds-119.cds-113.cds-115.cds-CommonCard-titleLink.css-si869u.cds-142').attr('href');
      const skills = $(element).find('div.cds-CommonCard-bodyContent').text().trim().replace("Skills you'll gain: ", "");
      const project_image_URL = $(element).find('div.cds-CommonCard-previewImage img').attr('src');
      const project_Certificate_type = $(element).find('div.cds-CommonCard-metadata p.css-vac8rf').text().trim();

      projects.push({
        project_title,
        project_URL,
        project_organization,
        skills,
        project_image_URL,
        project_Certificate_type
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching project details:', error);
    return [];
  }
}

// Function to fetch projects from multiple pages
async function fetchAllProjects(totalPages) {
  const pagePromises = [];
  for (let page = 1; page <= totalPages; page++) {
    pagePromises.push(fetchProjectsFromPage(page));
  }
  const allProjects = await Promise.all(pagePromises);
  return allProjects.flat();
}

// Main function to fetch and filter projects
async function generateFilteredProjects(titleFilter) {
  const totalPages = 50; // Adjust this number based on the total number of pages available
  const projects = await fetchAllProjects(totalPages);

  const filteredProjects = projects.filter(project =>
    project.project_title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  return filteredProjects;
}

// Get the title filter from command line arguments and fetch projects
const titleFilter = process.argv[2] || '';
generateFilteredProjects(titleFilter).then(projects => {
  console.log(JSON.stringify({ projects }));
}).catch(error => {
  console.error('Error generating filtered projects:', error);
});