import cleanSpaces from "./cleanSpaces.js";

function getSkillObject(el) {
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


export default function getSkill(html_root) {
    const skillsSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#skills"));
    if (skillsSection.length > 0) {
        const skillsUl = skillsSection[0].querySelector("ul");
        const skillsLis = Array.from(skillsUl.querySelectorAll("li"));
        const skillsArray = skillsLis.map(getSkillObject).filter((el) => el !== undefined);
        return skillsArray;
    }
    return [];
}