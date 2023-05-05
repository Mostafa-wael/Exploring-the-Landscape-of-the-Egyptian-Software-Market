import Axios from 'axios';
import cheerio from 'cheerio';


const config = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    },
};

Axios.get('https://www.linkedin.com/in/hazemkak', {
    credentials: 'omit',
}).then(({ data }) => {
    const $ = cheerio.load(data);
    console.log(data);
}).catch((err) => {
    console.log(err)
})

// fetch('https://eg.linkedin.com/in/hazemkak', {
//     credentials: 'omit',
// }).then((response) => {
//     return response.text();
// }).then((data) => {
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// })