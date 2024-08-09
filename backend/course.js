const axios = require('axios');
const cheerio = require('cheerio');

async function fetchCoursesFromPage(pageNumber) {
  const url = `https://www.coursera.org/courses?page=${pageNumber}&index=prod_all_products_term_optimization`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let courses = [];
    $('div.css-1evtm7z').each((index, element) => {
      const course_title = $(element).find('h3.cds-CommonCard-title.css-6ecy9b').text().trim();
      const course_organization = $(element).find('p.cds-ProductCard-partnerNames.css-vac8rf').text().trim();
      const course_URL = "https://www.coursera.org" + $(element).find('a.cds-119.cds-113.cds-115.cds-CommonCard-titleLink.css-si869u.cds-142').attr('href');
      const skills = $(element).find('div.cds-CommonCard-bodyContent').text().trim().replace("Skills you'll gain: ", "");
      const course_image_URL = $(element).find('div.cds-CommonCard-previewImage img').attr('src');
      const course_Certificate_type = $(element).find('div.cds-CommonCard-metadata p.css-vac8rf').text().trim();

      courses.push({
        course_title,
        course_URL,
        course_organization,
        skills,
        course_image_URL,
        course_Certificate_type
      });
    });

    return courses;
  } catch (error) {
    console.error('Error fetching course details:', error);
    return [];
  }
}

async function fetchAllCourses(totalPages) {
  const pagePromises = [];
  for (let page = 1; page <= totalPages; page++) {
    // console.log(`Fetching page ${page}`);
    pagePromises.push(fetchCoursesFromPage(page));
  }
  const allCourses = await Promise.all(pagePromises);
  return allCourses.flat();
}

async function generateFilteredCourses(titleFilter) {
  const totalPages = 20;
  const courses = await fetchAllCourses(totalPages);

  const filteredCourses = courses.filter(course =>
    course.course_title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  return filteredCourses;
}

const titleFilter = process.argv[2] || '';
generateFilteredCourses(titleFilter).then(courses => {
  console.log(JSON.stringify({ courses }));
}).catch(error => {
  console.error('Error generating filtered courses:', error);
});