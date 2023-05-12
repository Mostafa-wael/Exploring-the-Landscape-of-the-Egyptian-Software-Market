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


export default function getSkill(html_root, filename) {
    const skillsSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#skills"));
    if (skillsSection.length > 0) {
        const skillsUl = skillsSection[0].querySelector("ul");
        const skillsLis = Array.from(skillsUl.querySelectorAll("li"));
        const skillsArray = skillsLis.map(getSkillObject).filter((el) => el !== undefined);

        const skillsObjectArray = [{
            "User": filename,
            "Skill1": "",
            "Skill2": "",
            "Skill3": ""
        }];

        for (var i = 0; i < skillsArray.length; i++) {
            const skill = skillsArray[i];
            if (i === 0) skillsObjectArray[0].Skill1 = skill;
            if (i === 1) skillsObjectArray[0].Skill2 = skill;
            if (i === 2) skillsObjectArray[0].Skill3 = skill;
        }

        return skillsObjectArray;
    }
    return [];
}