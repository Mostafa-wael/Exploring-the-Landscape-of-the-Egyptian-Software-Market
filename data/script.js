import { parse } from "node-html-parser";
import fs from "fs";
import cleanSpaces from "./utils/cleanSpaces.js";

function getExperienceObject(el) {
    const containerDiv = el.querySelector("div");

    if (cleanSpaces(containerDiv.getAttribute("class")) !== cleanSpaces("pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns")) return;

    const firstDiv = containerDiv.querySelector("div:nth-child(1)");
    const secondDiv = containerDiv.querySelector("div:nth-child(2)");

    const haveMultiplePositions = secondDiv.querySelectorAll("div.pvs-list__outer-container>ul.pvs-list>li.pvs-list__item--one-column>span.pvs-entity__path-node").length > 0;

    const obj = {}

    const companyUrl = firstDiv.querySelector("a").getAttribute("href");
    obj.companyUrl = companyUrl;

    if (!haveMultiplePositions) {
        const mainDiv = secondDiv.querySelectorAll("div")[0];

        const parentSpan = mainDiv.querySelector(".t-bold");
        if (parentSpan && parentSpan.querySelector("span")) {
            const title = parentSpan.querySelector("span");
            obj.title = cleanSpaces(title.innerText);
        }

        const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
        for (let i = 0; i < companyDateLocationSpans.length; i++) {
            const companyDateLocationSpan = companyDateLocationSpans[i];
            if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
                const companyDateLocation = companyDateLocationSpan.querySelector("span");
                if (i === 0) {
                    obj.company = cleanSpaces(companyDateLocation.innerText);
                }
                if (i === 1) {
                    obj.date = cleanSpaces(companyDateLocation.innerText);
                }
                if (i === 2) {
                    obj.location = cleanSpaces(companyDateLocation.innerText);
                }
            }
        }
        return obj;
    } else {
        const mainDiv = secondDiv.querySelectorAll("div")[0];

        const parentSpan = mainDiv.querySelector(".t-bold");
        if (parentSpan && parentSpan.querySelector("span")) {
            const company = parentSpan.querySelector("span");
            obj.company = company.innerText;
        }

        const positions = secondDiv.querySelectorAll("div.pvs-list__outer-container>ul.pvs-list>li.pvs-list__item--one-column>div.pvs-entity");
        const positionsArray = Array.from(positions);

        const positionsObjects = positionsArray.map((el) => {
            const positionDataDiv = el.querySelector(":scope>div:nth-child(2)>div:nth-child(1)>a");
            const positionObj = {};

            const parentSpan = positionDataDiv.querySelector(".t-bold");
            if (parentSpan && parentSpan.querySelector("span")) {
                const position = parentSpan.querySelector("span");
                positionObj.position = cleanSpaces(position.innerText);
            }

            const employmentTypeSpan = positionDataDiv.querySelector("span.t-normal:not(.t-black--light)");
            if (employmentTypeSpan && employmentTypeSpan.querySelector("span")) {
                positionObj.employmentType = cleanSpaces(employmentTypeSpan.querySelector("span").innerText);
            }

            const otherSpans = positionDataDiv.querySelectorAll("span.t-normal.t-black--light");
            if (otherSpans.length === 2) {
                positionObj.date = cleanSpaces(otherSpans[0].querySelector("span").innerText);
                positionObj.location = cleanSpaces(otherSpans[1].querySelector("span").innerText);
            } else if (otherSpans.length === 1) {
                positionObj.date = cleanSpaces(otherSpans[0].querySelector("span").innerText);
            }

            console.log("positionObj: ", positionObj);

            return positionObj;
        });

        obj.positions = positionsObjects;
        return obj;
    }
}

function getEducationalObject(el) {
    const firstDiv = el.querySelector("div");
    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;

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
        obj.University = cleanSpaces(title.innerText);
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.Degree = cleanSpaces(companyDateLocation.innerText);
            }
            if (i === 1) {
                obj.Date = cleanSpaces(companyDateLocation.innerText)
            }
        }
    }

    return obj;
}

function getVolunteeringObject(el) {
    const firstDiv = el.querySelector("div");
    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;

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
        obj.Organization = cleanSpaces(title.innerText);
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.Role = cleanSpaces(companyDateLocation.innerText);
            }
            if (i === 1) {
                obj.Date = cleanSpaces(companyDateLocation.innerText);
            }
        }
    }

    return obj;
}

function getSkill(el) {
    const firstDiv = el.querySelector("div");
    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const parentSpan = mainDiv.querySelector(".t-bold");

    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        return cleanSpaces(title.innerText);
    }
}


// Parse Sections
const html = fs.readFileSync(`sections/abdullahadel41.html`, "utf8");
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

