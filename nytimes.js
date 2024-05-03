const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.nytimes.com/2024/05/02/science/orangutan-wound-plant-treatment.html';

axios.get(url, {   proxy: {
    protocol: 'http',
    host: '127.0.0.1',  // Proxy server host name export https_proxy=http://127.0.0.1:33210 http_proxy=http://127.0.0.1:33210 all_proxy=socks5://127.0.0.1:33211
    port: 33210,                        // Proxy server port
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

    $('section[name="articleBody"] .css-53u6y8 p').each((_, element) => {
      let paragraph = $(element).text();
      const links = $(element).find('a');

      if (links.length > 0) {
        links.each((_, link) => {
          const text = $(link).text();
          const href = $(link).attr('href');
          const markdownLink = `[${text}](${href})`;
          paragraph = paragraph.replace(text, markdownLink);
        });
      }

      articleContent.push(paragraph);
    });

    const markdown = articleContent.join('\n\n');
    console.log(markdown);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
