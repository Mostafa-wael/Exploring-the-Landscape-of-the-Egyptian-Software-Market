import cleanSpaces from "./cleanSpaces.js";

function getLicensesAndCertificationsObject(el, filenameKey) {
    const obj = {
        Title: "",
        Issuer: "",
        Date: "",
        "User": filenameKey
    }

    const firstDiv = el.querySelector("div");

    if (cleanSpaces(firstDiv.getAttribute("class")) !== "pvs-entity pvs-entity--padded pvs-list__item--no-padding-in-columns") return;
    const secondDiv = firstDiv.querySelector("div:nth-child(2)");
    const mainDiv = secondDiv.querySelectorAll("div")[0];

    const parentSpan = mainDiv.querySelector(".t-bold");
    if (parentSpan && parentSpan.querySelector("span")) {
        const title = parentSpan.querySelector("span");
        obj.Title = cleanSpaces(title.innerText);
    }

    const companyDateLocationSpans = mainDiv.querySelectorAll(".t-normal");
    for (var i = 0; i < companyDateLocationSpans.length; i++) {
        const companyDateLocationSpan = companyDateLocationSpans[i];
        if (companyDateLocationSpan && companyDateLocationSpan.querySelector("span")) {
            const companyDateLocation = companyDateLocationSpan.querySelector("span");
            if (i === 0) {
                obj.Issuer = cleanSpaces(companyDateLocation.innerText);
            }
            if (i === 1) {
                obj.Date = cleanSpaces(companyDateLocation.innerText);
            }
        }
    }
    return obj;
}

export default function getLicensesAndCertifications(html_root, filenameKey) {
    const licensesAndCertifications = html_root.querySelectorAll("section").filter((el) => el.querySelector("#licenses_and_certifications"))
    if (licensesAndCertifications && licensesAndCertifications.length > 0) {
        const licensesAndCertificationsUl = licensesAndCertifications[0].querySelector("ul");
        const lis = Array.from(licensesAndCertificationsUl.querySelectorAll("li"));

        const licensesAndCertificationsArray = lis.map((el) => getLicensesAndCertificationsObject(el, filenameKey)).filter((el) => el !== undefined);

        return licensesAndCertificationsArray;
    }
    return [];
}