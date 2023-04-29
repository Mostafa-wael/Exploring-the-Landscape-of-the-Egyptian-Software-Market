export default function getSections(sourceFolder, destinationPath) {

    fs.readdirSync(sourceFolder).forEach(file => {

        console.log("processing file: ", file);

        fs.writeFileSync(`${destinationPath}/${file}`, "", "utf8")

        const html = fs.readFileSync(`${sourceFolder}/${file}`, "utf8");

        const html_root = parse(html);

        const sections = Array.from(html_root.querySelectorAll("section"));

        console.log("Number of sections: ", sections.length)

        const targetedIds = ["experience", "education", "licenses_and_certifications", "volunteering_experience", "languages", "skills"]

        const targetedSections = sections.filter(function(el) {
            let found = false;
            for (let i = 0; i < targetedIds.length; i++) {
                const id = targetedIds[i];
                if (el.querySelector(`#${id}`)) {
                    found = true;
                    break;
                }
            }
            return found;
        })

        console.log("Number of targeted sections: ", targetedIds.length)
        console.log("Number of final sections: ", targetedSections.length)

        // write sections to file
        for (let i = 0; i < targetedSections.length; i++) {
            const section = targetedSections[i];
            fs.appendFileSync(`${destinationPath}/${file}`, section.toString(), "utf8");
        }

    });
}