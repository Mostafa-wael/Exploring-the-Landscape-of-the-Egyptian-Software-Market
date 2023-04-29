import fs from "fs";
import { parse } from "node-html-parser";
import { utils } from "./utils/index.js";

const html = fs.readFileSync(`sections/heba-abdelnasser.html`, "utf8");
const html_root = parse(html);

utils.getEducation(html_root);
utils.getExperience(html_root);
utils.getSkill(html_root);
utils.getVolunteering(html_root);
utils.getLanguages(html_root);
utils.getLicensesAndCertifications(html_root);