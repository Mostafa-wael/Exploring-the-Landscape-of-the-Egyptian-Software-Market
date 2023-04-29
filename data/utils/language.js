import cleanSpaces from "./cleanSpaces.js";

function getLanguagesObject(el) {
    const obj = {
        title: "",
        proficiency: ""
    }

    const firstDiv = el.querySelector("div");

    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;

    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];


    const language = mainDiv.querySelector(".t-bold");
    if (language && language.querySelector("span")) {
        const title = language.querySelector("span");
        obj.title = cleanSpaces(title.innerText);
    }

    const proficiency = mainDiv.querySelector(".t-normal");
    if (proficiency && proficiency.querySelector("span")) {
        const proficiencySpan = proficiency.querySelector("span");
        obj.proficiency = cleanSpaces(proficiencySpan.innerText);
    }

    return obj;

}

export default function getLanguages(html_root) {
    const languages = html_root.querySelectorAll("section").filter((el) => el.querySelector("#languages"))
    if (languages && languages.length > 0) {
        const languagesUl = languages[0].querySelector("ul");
        const lis = Array.from(languagesUl.querySelectorAll("li"));

        const languagesArray = lis.map(getLanguagesObject).filter((el) => el !== undefined);

        console.log("languagesArray: ", languagesArray);
        return languagesArray;

    }
    return [];
}