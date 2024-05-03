const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.nytimes.com/2024/04/06/technology/ai-data-tech-companies.html';

axios.get(url, {   proxy: {
    protocol: 'http',
    host: '127.0.0.1',  // Change to your Proxy server host name 
    port: 33210,        // Change to your Proxy server port
  },
  headers: {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    'Referer': "https://www.google.com"
  } 
 })
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const articleContent = [];

    $('section[name="articleBody"] .css-53u6y8').children().each((_, element) => {
        if ($(element).is('h2, h3, p')) {
          let content = '';
          if ($(element).is('p')) {
            content = $(element).text();
          } else {
            content = `### ${$(element).text()}`;
          }
          const links = $(element).find('a');
          if (links.length > 0) {
            links.each((_, link) => {
              const text = $(link).text();
              const href = $(link).attr('href');
              const markdownLink = `[${text}](${href})`;
              content = content.replace(text, markdownLink);
            });
          }
          articleContent.push(content);
        }
      });

    const markdown = articleContent.join('\n\n');
    console.log(markdown);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
