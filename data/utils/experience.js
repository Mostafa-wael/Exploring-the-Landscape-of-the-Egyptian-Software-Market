import cleanSpaces from "./cleanSpaces.js";

function getExperienceObject(el, filename) {
    const containerDiv = el.querySelector("div");

    if (cleanSpaces(containerDiv.getAttribute("class")) !== cleanSpaces("pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns")) return;

    const firstDiv = containerDiv.querySelector("div:nth-child(1)");
    const secondDiv = containerDiv.querySelector("div:nth-child(2)");

    const haveMultiplePositions = secondDiv.querySelectorAll("div.pvs-list__outer-container>ul.pvs-list>li.pvs-list__item--one-column>span.pvs-entity__path-node").length > 0;

    const obj = {
        "User": filename,
    }

    if (firstDiv.querySelector("a")?.getAttribute("href") === undefined) {
        return undefined;
    }

    let companyUrl = firstDiv.querySelector("a").getAttribute("href");

    if (companyUrl.split("/")[3] !== "company")
        companyUrl = "UNKNOWN";
    obj.CompanyUrl = companyUrl;

    if (!haveMultiplePositions) {
        const mainDiv = secondDiv.querySelectorAll("div")[0];

        const parentSpan = mainDiv.querySelector(".t-bold");
        if (parentSpan && parentSpan.querySelector("span")) {
            const title = parentSpan.querySelector("span");
            obj.Title = cleanSpaces(title.innerText);
        }

        const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
        for (let i = 0; i < companyDateLocationSpans.length; i++) {
            const companyDateLocationSpan = companyDateLocationSpans[i];
            if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
                const companyDateLocation = companyDateLocationSpan.querySelector("span");
                if (i === 0) {
                    obj.Company = cleanSpaces(companyDateLocation.innerText);
                }
                if (i === 1) {
                    obj.Date = cleanSpaces(companyDateLocation.innerText);
                }
                if (i === 2) {
                    obj.Location = cleanSpaces(companyDateLocation.innerText);
                }
            }
        }
        return obj;
    } else {
        const mainDiv = secondDiv.querySelectorAll("div")[0];

        const parentSpan = mainDiv.querySelector(".t-bold");
        if (parentSpan && parentSpan.querySelector("span")) {
            const company = parentSpan.querySelector("span");
            obj.Company = company.innerText;
        }

        const positions = secondDiv.querySelectorAll("div.pvs-list__outer-container>ul.pvs-list>li.pvs-list__item--one-column>div.pvs-entity");
        const positionsArray = Array.from(positions);

        const positionsObjects = positionsArray.map((el) => {
            const positionDataDiv = el.querySelector(":scope>div:nth-child(2)>div:nth-child(1)>a");
            const positionObj = {};

            const parentSpan = positionDataDiv.querySelector(".t-bold");
            if (parentSpan && parentSpan.querySelector("span")) {
                const position = parentSpan.querySelector("span");
                positionObj.Position = cleanSpaces(position.innerText);
            }

            const employmentTypeSpan = positionDataDiv.querySelector("span.t-normal:not(.t-black--light)");
            if (employmentTypeSpan && employmentTypeSpan.querySelector("span")) {
                positionObj.EmploymentType = cleanSpaces(employmentTypeSpan.querySelector("span").innerText);
            }

            const otherSpans = positionDataDiv.querySelectorAll("span.t-normal.t-black--light");
            if (otherSpans.length === 2) {
                positionObj.Date = cleanSpaces(otherSpans[0].querySelector("span").innerText);
                positionObj.location = cleanSpaces(otherSpans[1].querySelector("span").innerText);
            } else if (otherSpans.length === 1) {
                positionObj.Date = cleanSpaces(otherSpans[0].querySelector("span").innerText);
            }


            return positionObj;
        });

        obj.Positions = positionsObjects;
        return obj;
    }
}

export default function getExperience(html_root, filename) {
    const experienceSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#experience"));

    if (experienceSection.length > 0) {
        const experienceUl = experienceSection[0].querySelector("ul");
        const experienceLis = Array.from(experienceUl.querySelectorAll("li"));
        const experienceArray = experienceLis.map((el) => getExperienceObject(el, filename)).filter((el) => el !== undefined);
        return experienceArray;
    }

    return [];
}