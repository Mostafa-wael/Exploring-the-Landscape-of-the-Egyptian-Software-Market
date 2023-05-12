import cleanSpaces from "./cleanSpaces.js";

export default function getExperience(html_root, filename) {
    const experienceSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#experience"));

    if (experienceSection.length > 0) {
        const experienceUl = experienceSection[0].querySelector("ul");
        const experienceLis = Array.from(experienceUl.querySelectorAll("li"));
        const experienceArray = experienceLis.map((el) => getExperienceObject(el, filename)).filter((el) => el !== undefined);

        const cleanExperienceArray = [];
        experienceArray.forEach((experience) => {
            if ("Positions" in experience) {
                const positionsArray = experience.Positions.map((position) => {
                    const obj = {
                        User: experience.User,
                        CompanyUrl: experience.CompanyUrl,
                        Company: experience.Company,
                        Title: position.Position,
                        EmploymentType: position.EmploymentType ?? "",
                        From: "",
                        To: "",
                        Duration: 0,
                        Location: position.Location ?? "",
                    }

                    const { From, To, Duration } = parseFromToAndDuration(position.Date)
                    obj.From = From;
                    obj.To = To;
                    obj.Duration = Duration;

                    return obj;
                });

                cleanExperienceArray.push(...positionsArray);
            } else {
                cleanExperienceArray.push(experience);
            }
        });

        return cleanExperienceArray;
    }

    return [];
}


function getExperienceObject(el, filename) {
    const containerDiv = el.querySelector("div");

    if (cleanSpaces(containerDiv.getAttribute("class")) !== cleanSpaces("pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns")) return;

    const firstDiv = containerDiv.querySelector("div:nth-child(1)");
    const secondDiv = containerDiv.querySelector("div:nth-child(2)");

    const haveMultiplePositions = secondDiv.querySelectorAll("div.pvs-list__outer-container>ul.pvs-list>li.pvs-list__item--one-column>span.pvs-entity__path-node").length > 0;

    const obj = {
        User: filename,
        CompanyUrl: "",
        Company: "",
        Title: "",
        EmploymentType: "",
        From: "",
        To: "",
        Duration: 0,
        Location: "",
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
                    const companyAndEmploymentType = cleanSpaces(companyDateLocation.innerText);
                    const { Company, EmploymentType } = parseCompanyAndEmploymentType(companyAndEmploymentType);
                    obj.Company = Company;
                    obj.EmploymentType = EmploymentType;
                }
                if (i === 1) {
                    const fromToAndDuration = cleanSpaces(companyDateLocation.innerText);
                    const { From, To, Duration } = parseFromToAndDuration(fromToAndDuration)
                    obj.From = From;
                    obj.To = To;
                    obj.Duration = Duration;
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
                positionObj.Location = cleanSpaces(otherSpans[1].querySelector("span").innerText);
            } else if (otherSpans.length === 1) {
                positionObj.Date = cleanSpaces(otherSpans[0].querySelector("span").innerText);
            }

            return positionObj;
        });

        obj.Positions = positionsObjects;
        return obj;
    }
}

function parseCompanyAndEmploymentType(companyAndEmploymentType) {
    const obj = {
        Company: "",
        EmploymentType: "",
    }

    if (companyAndEmploymentType.includes(" · ")) {
        const [companyName, employmentType] = companyAndEmploymentType.split(" · ");
        obj.Company = companyName;
        obj.EmploymentType = employmentType;
    } else {
        obj.Company = companyAndEmploymentType;
    }

    return obj;
}

function parseFromToAndDuration(fromToAndDuration) {
    const obj = {
        From: "",
        To: "",
        Duration: 0,
    }

    if (fromToAndDuration.includes(" · ")) {
        let [fromTo, duration] = fromToAndDuration.split(" · ");
        fromTo = parseFromTo(fromTo);
        duration = parseDuration(duration);
        obj.From = fromTo.From;
        obj.To = fromTo.To;
        obj.Duration = duration;
    } else {
        const fromTo = parseFromTo(fromToAndDuration);
        obj.From = fromTo.From;
        obj.To = fromTo.To;
    }

    return obj;
}

function parseFromTo(fromTo) {
    const obj = {
        From: "",
        To: "",
    }

    if (fromTo.includes(" - ")) {
        const [from, to] = fromTo.split(" - ");
        obj.From = from;
        obj.To = to;
    } else {
        obj.From = fromTo;
    }

    return obj;
}

function parseDuration(duration) {
    const durationArray = duration.split(" ");
    let years = 0;
    let months = 0;

    if (durationArray.length === 4) {
        years = parseInt(durationArray[0]);
        months = parseInt(durationArray[2]);
    } else if (durationArray.length === 2) {
        if (durationArray[1] === "yr" || durationArray[1] === "yrs") {
            years = parseInt(durationArray[0]);
        } else if (durationArray[1] === "mo" || durationArray[1] === "mos") {
            months = parseInt(durationArray[0]);
        }
    }

    return years * 12 + months;
}
