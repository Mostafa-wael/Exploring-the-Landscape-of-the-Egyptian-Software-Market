import scrapedin from 'scrapedin';

const profileScraper = await scrapedin({ email: 'abdullah.abdulghani01@eng-st.cu.edu.eg', password: 'DS_Password' })
const profile = await profileScraper('https://www.linkedin.com/in/hazemkak/')

console.log(profile)