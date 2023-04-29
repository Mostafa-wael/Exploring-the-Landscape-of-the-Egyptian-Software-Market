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


export default function getVolunteering(html_root) {
    const volunteeringSection = html_root.querySelectorAll("section").filter((el) => el.querySelector("#volunteering_experience"));
    if (volunteeringSection.length > 0) {
        const volunteeringUl = volunteeringSection[0].querySelector("ul");
        const volunteeringLis = Array.from(volunteeringUl.querySelectorAll("li"));
        const volunteeringArray = volunteeringLis.map(getVolunteeringObject).filter((el) => el !== undefined);
        console.log("volunteeringArr: ", volunteeringArray);
        return volunteeringArray;
    }
    return [];
}