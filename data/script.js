import { parse } from "node-html-parser";
import fs from "fs";

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
        obj.title = title.innerHTML.replace(/\s+/g, ' ').trim();
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.company = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
            if (i === 1) {
                obj.date = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
            }
            if (i === 2) {
                obj.location = companyDateLocation.innerHTML.replace(/\s+/g, ' ').trim();
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


// Parse Sections
const html = fs.readFileSync(`sections/ahmadhindawy.html`, "utf8");
const html_root = parse(html);
const uls = Array.from(html_root.querySelectorAll("ul"));


// Parse Experience
const experienceUl = uls[0]
const lis = Array.from(experienceUl.querySelectorAll("li"));
const experienceArray = lis.map(getExperienceObject).filter((el) => el !== undefined)
console.log("experienceArr: ", experienceArray);


// Parse Education
const educationUl = html_root.querySelectorAll("section").filter((el) => el.querySelector("#education"))[0].querySelector("ul");
const educationLis = Array.from(educationUl.querySelectorAll("li"));
const educationArray = educationLis.map(getEducationalObject).filter((el) => el !== undefined);
console.log("educationArr: ", educationArray);

// Parse Volunteering
const volunteeringSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#volunteering_experience"));
if (volunteeringSection.length > 0) {
    const volunteeringUl = volunteeringSection[0].querySelector("ul");
    const volunteeringLis = Array.from(volunteeringUl.querySelectorAll("li"));
    const volunteeringArray = volunteeringLis.map(getVolunteeringObject).filter((el) => el !== undefined);
    console.log("volunteeringArr: ", volunteeringArray);
}

// Parse Skills
const skillsSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#skills"));
if (skillsSection.length > 0) {
    const skillsUl = skillsSection[0].querySelector("ul");
    const skillsLis = Array.from(skillsUl.querySelectorAll("li"));
    const skillsArray = skillsLis.map(getSkill).filter((el) => el !== undefined);
    console.log("skillsArr: ", skillsArray);
}

