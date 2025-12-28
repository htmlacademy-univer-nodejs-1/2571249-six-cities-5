import chalk from "chalk";

import type { Offer } from "../types/entities.js";

export function printOffer(offer: Offer): void {
  console.log(chalk.cyan.bold("\nOffer:"));
  console.log(`  ${chalk.yellow("title:")} ${offer.title}`);
  console.log(`  ${chalk.yellow("description:")} ${offer.description}`);
  console.log(`  ${chalk.yellow("publicationDate:")} ${offer.publicationDate}`);
  console.log(`  ${chalk.yellow("city:")} ${chalk.magenta(offer.city)}`);
  console.log(`  ${chalk.yellow("preview:")} ${offer.preview}`);
  console.log(`  ${chalk.yellow("images:")} ${JSON.stringify(offer.images)}`);
  console.log(
    `  ${chalk.yellow("isPremium:")} ${
      offer.isPremium ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(
    `  ${chalk.yellow("isFavorite:")} ${
      offer.isFavorite ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(
    `  ${chalk.yellow("rating:")} ${chalk.cyan(String(offer.rating))}`
  );
  console.log(`  ${chalk.yellow("type:")} ${chalk.magenta(offer.type)}`);
  console.log(`  ${chalk.yellow("bedrooms:")} ${chalk.cyan(offer.bedrooms)}`);
  console.log(`  ${chalk.yellow("guests:")} ${chalk.cyan(offer.guests)}`);
  console.log(`  ${chalk.yellow("price:")} ${chalk.cyan(String(offer.price))}`);
  console.log(
    `  ${chalk.yellow("amenities:")} ${JSON.stringify(offer.amenities)}`
  );
  console.log(`  ${chalk.yellow("host:")}`);
  console.log(`    ${chalk.yellow("name:")} ${offer.host.name}`);
  console.log(`    ${chalk.yellow("email:")} ${offer.host.email}`);
  console.log(
    `    ${chalk.yellow("avatar:")} ${offer.host.avatar ?? "undefined"}`
  );
  console.log(`    ${chalk.yellow("password:")} ${offer.host.password}`);
  console.log(
    `    ${chalk.yellow("isPro:")} ${
      offer.host.isPro ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(
    `  ${chalk.yellow("commentCount:")} ${chalk.cyan(offer.commentCount)}`
  );
  console.log(`  ${chalk.yellow("location:")}`);
  console.log(
    `    ${chalk.yellow("latitude:")} ${chalk.cyan(offer.location.latitude)}`
  );
  console.log(
    `    ${chalk.yellow("longitude:")} ${chalk.cyan(offer.location.longitude)}`
  );
}
