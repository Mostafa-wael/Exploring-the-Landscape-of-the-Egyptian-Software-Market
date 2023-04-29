import cleanSpaces from "./cleanSpaces.js";

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
                obj.Date = cleanSpaces(companyDateLocation.innerText);
            }
        }
    }

    return obj;
}

export default function getEducation(html_root) {
    const educationSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#education"));
    if (educationSection.length === 0) return [];

    const educationUl = educationSection[0].querySelector("ul");

    const educationLis = Array.from(educationUl.querySelectorAll("li"));
    const educationArray = educationLis.map(getEducationalObject).filter((el) => el !== undefined);
    console.log("educationArr: ", educationArray);
    return educationArray;
}