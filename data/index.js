import { parse } from "node-html-parser";
import fs from "fs";

const testFolder = './profiles/';

function getSections() {

    fs.readdirSync(testFolder).forEach(file => {

        console.log("processing file: ", file);

        fs.writeFileSync(`sections/${file}`, "", "utf8")

        const html = fs.readFileSync(`profiles/${file}`, "utf8");

        const html_root = parse(html);

        const sections = Array.from(html_root.querySelectorAll("section"));

        console.log("Number of sections: ", sections.length)

        const targetedIds = ["experience", "education", "licenses_and_certifications", "volunteering_experience", "languages", "skills"]

        const targetedSections = sections.filter(function(el) {
            let found = false;
            for (let i = 0; i < targetedIds.length; i++) {
                const id = targetedIds[i];
                if (el.querySelector(`#${id}`)) {
                    found = true;
                    break;
                }
            }
            return found;
        })

        console.log("Number of targeted sections: ", targetedIds.length)
        console.log("Number of final sections: ", targetedSections.length)

        // write sections to file
        for (let i = 0; i < targetedSections.length; i++) {
            const section = targetedSections[i];
            fs.appendFileSync(`sections/${file}`, section.toString(), "utf8");
        }

    });
}

// check if pvs-entity__path-node
function getExperienceObject(el) {
    const firstDiv = el.querySelector("div");

    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];


    const obj = {
        title: "",
        company: "",
        date: "",
        location: ""
    }

    const parentSpan = mainDiv.querySelector(".t-bold");
    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        obj.title = title.innerHTML;
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.company = companyDateLocation.innerHTML;
            }
            if (i === 1) {
                obj.date = companyDateLocation.innerHTML;
            }
            if (i === 2) {
                obj.location = companyDateLocation.innerHTML;
            }
        }
    }
    return obj;
}

function getEducationalObject(el) {
    const firstDiv = el.querySelector("div");
    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const obj = {
        "University": "",
        "Degree": "",
        "Date": "",
    }

    const parentSpan = mainDiv.querySelector(".t-bold");
    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        obj.University = title.innerHTML.replace(/\s+/g, ' ').trim();
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.Degree = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
            if (i === 1) {
                obj.Date = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
        }
    }

    return obj;
}

function getVolunteeringObject(el) {
    const firstDiv = el.querySelector("div");
    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const obj = {
        "Organization": "",
        "Role": "",
        "Date": "",
    }

    const parentSpan = mainDiv.querySelector(".t-bold");
    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        obj.Organization = title.innerHTML.replace(/\s+/g, ' ').trim();
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.Role = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
            if (i === 1) {
                obj.Date = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
        }
    }

    return obj;
}

function getLicensesAndCertificationsObject(el) {
    const obj = {
        title: "",
        issuer: "",
        date: ""
    }

    const firstDiv = el.querySelector("div");

    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;
    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const parentSpan = mainDiv.querySelector(".t-bold");
    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        obj.title = title.innerHTML;
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.issuer = companyDateLocation.innerHTML;
            }
            if (i === 1) {
                obj.date = companyDateLocation.innerHTML;
            }
        }
    }
    return obj;
}

function getSkill(el) {
    const firstDiv = el.querySelector("div");
    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const parentSpan = mainDiv.querySelector(".t-bold");

    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        return title.innerHTML.replace(/\s+/g, ' ').trim();
    }
}


function getLanguagesObject(el) {
    const obj = {
        title: "",
        proficiency: ""
    }

    const firstDiv = el.querySelector("div");

    if (firstDiv.getAttribute("class").replace(/\s+/g, ' ').trim() !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns".replace(/\s+/g, ' ').trim()) return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];


    const language = mainDiv.querySelector(".t-bold");
    if (language && language.querySelector("span")) {
        const title = language.querySelector("span");
        obj.title = title.innerHTML;
    }

    const proficiency = mainDiv.querySelector(".t-normal");
    if (proficiency && proficiency.querySelector("span")) {
        const proficiencySpan = proficiency.querySelector("span");
        obj.proficiency = proficiencySpan.innerHTML;
    }

    return obj;

}



// Parse Sections
const html = fs.readFileSync(`sections/youssef-abdelhameed.html`, "utf8");
const html_root = parse(html);
const uls = Array.from(html_root.querySelectorAll("ul"));


// Parse Experience
const experienceUl = uls[0]
const lis = Array.from(experienceUl.querySelectorAll("li"));
const experienceArray = lis.map(getExperienceObject).filter((el) => el !== undefined);
// console.log("experienceArr: ", experienceArray);


// Parse Licenses and Certifications
const licensesAndCertifications = html_root.querySelectorAll("section").filter((el) => el.querySelector("#licenses_and_certifications"))
if (licensesAndCertifications && licensesAndCertifications.length > 0) {
    const licensesAndCertificationsUl = licensesAndCertifications[0].querySelector("ul");
    const lis = Array.from(licensesAndCertificationsUl.querySelectorAll("li"));

    const licensesAndCertificationsArray = lis.map(getLicensesAndCertificationsObject).filter((el) => el !== undefined);

    console.log("licensesAndCertificationsArray: ", licensesAndCertificationsArray);

}

// Parse Languages
const languages = html_root.querySelectorAll("section").filter((el) => el.querySelector("#languages"))
if (languages && languages.length > 0) {
    const languagesUl = languages[0].querySelector("ul");
    const lis = Array.from(languagesUl.querySelectorAll("li"));

    const languagesArray = lis.map(getLanguagesObject).filter((el) => el !== undefined);

    console.log("languagesArray: ", languagesArray);

}