import fs from "fs";
import { parse } from "node-html-parser";
import { utils } from "./utils/index.js";
import getSections from "./sections.js";

const allCompanies = new Set();

// getSections('profiles', 'sections')


function readFiles(dirname, onError) {

    const filenames = fs.readdirSync(dirname)

    filenames.forEach(function (filename) {
        if (filename === ".gitkeep") return;
        console.log("Preprocessing ", filename);

        const html = fs.readFileSync(`${dirname}/${filename}`, "utf8");
        const html_root = parse(html);

        const experienceList = utils.getExperience(html_root)

        // console.log(experienceList)

        const profileDetails = {
            education: utils.getEducation(html_root),
            experience: experienceList,
            skill: utils.getSkill(html_root),
            volunteer: utils.getVolunteering(html_root),
            language: utils.getLanguages(html_root),
            certificate: utils.getLicensesAndCertifications(html_root),
        };

        const companiesLinks = experienceList.map((experience) => experience?.companyUrl ?? "");
        companiesLinks.forEach((company) => allCompanies.add(company))
    });

    console.log("Total Companies: ", allCompanies.size)
}

readFiles("sections")

let companiesLinks = "";
allCompanies.forEach((company) => {
    if (company === "UNKNOWN") return;
    companiesLinks += `${company}\n`
})

fs.writeFileSync('companies/companiesLinks.txt', companiesLinks);
