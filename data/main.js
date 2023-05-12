import fs from "fs";
import { parse } from "node-html-parser";
import { utils } from "./utils/index.js";
import getSections from "./sections.js";

// getSections('profiles', 'sections')


const allExperiences = [];
const allEducations = [];
const allSkills = [];
const allVolunteering = [];
const allLanguages = [];
const allLicenses = [];

function readFiles(dirname, onError) {

    const filenames = fs.readdirSync(dirname)

    filenames.forEach(function (filename) {
        if (filename === ".gitkeep") return;
        console.log("Preprocessing ", filename);

        const html = fs.readFileSync(`${dirname}/${filename}`, "utf8");
        const html_root = parse(html);


        const filenameKey = filename.split('.')[0]


        const profileDetails = {
            education: utils.getEducation(html_root, filenameKey),
            experience: utils.getExperience(html_root, filenameKey),
            skill: utils.getSkill(html_root, filenameKey),
            volunteer: utils.getVolunteering(html_root, filenameKey),
            language: utils.getLanguages(html_root, filenameKey),
            certificate: utils.getLicensesAndCertifications(html_root, filenameKey),
        };

        allExperiences.push(...profileDetails.experience);
        allEducations.push(...profileDetails.education);
        allSkills.push(...profileDetails.skill);
        allVolunteering.push(...profileDetails.volunteer);
        allLanguages.push(...profileDetails.language);
        allLicenses.push(...profileDetails.certificate);

    });
}

readFiles("sections")

fs.writeFileSync("preprocessed-data/experiences.json", JSON.stringify(allExperiences));
fs.writeFileSync("preprocessed-data/educations.json", JSON.stringify(allEducations));
fs.writeFileSync("preprocessed-data/skills.json", JSON.stringify(allSkills));
fs.writeFileSync("preprocessed-data/volunteering.json", JSON.stringify(allVolunteering));
fs.writeFileSync("preprocessed-data/languages.json", JSON.stringify(allLanguages));
fs.writeFileSync("preprocessed-data/licenses.json", JSON.stringify(allLicenses));
