import cleanSpaces from "./cleanSpaces.js";

function getVolunteeringObject(el, filenameKey) {
    const firstDiv = el.querySelector("div");
    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const obj = {
        "Organization": "",
        "Role": "",
        "Date": "",
        "User": filenameKey
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


export default function getVolunteering(html_root, filenameKey) {
    const volunteeringSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#volunteering_experience"));
    if (volunteeringSection.length > 0) {
        const volunteeringUl = volunteeringSection[0].querySelector("ul");
        const volunteeringLis = Array.from(volunteeringUl.querySelectorAll("li"));
        const volunteeringArray = volunteeringLis.map((el) => getVolunteeringObject(el, filenameKey)).filter((el) => el !== undefined);
        return volunteeringArray;
    }
    return [];
}