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

export default function getExperience(html_root) {
    const experienceSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#experience"));

    if (experienceSection.length > 0) {
        const experienceUl = experienceSection[0].querySelector("ul");
        const experienceLis = Array.from(experienceUl.querySelectorAll("li"));
        const experienceArray = experienceLis.map(getExperienceObject).filter((el) => el !== undefined);
        console.log("experienceArr: ", experienceArray);
        return experienceArray;
    }

    return [];
}