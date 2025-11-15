#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');

clear();

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        prefix: "",
        message: `O que você deseja fazer?`,
        choices: [
            {
                name: `Me enviar um email ?`,
                value: () => {
                    open("mailto:paulo.oliveira.phgo@gmail.com");
                    console.log("\nPronto, nos vemos em breve na sua caixa de entrada.\n");
                }
            },
            {
                name: `Salvar meu currículo ?`,
                value: () => {
                    const loader = ora({
                        text: ' Salvando currículo...',
                        spinner: cliSpinners.material,
                    }).start();

                    // ID do arquivo no Google Drive
                    const driveFileId = "1w4tSNyRZbXnCJZgpvvgr6PqSOxng_JE5";
                    const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;

                    let pipe = request(downloadUrl).pipe(fs.createWriteStream('./Paulo H. Oliveira-CV.pdf'));

                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), 'Paulo H. Oliveira-CV.pdf');
                        console.log(`\nCurrículo salvo em: ${downloadPath}\n`);
                        open(downloadPath);
                        loader.stop();
                    });

                    pipe.on("error", function (err) {
                        console.log("\nErro ao baixar o currículo:", err.message);
                        loader.stop();
                    });
                }
            },
            {
                name: "Sair",
                value: () => {
                    console.log("Sessão terminada — nos vemos na próxima interação.\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.hex("#4684F6")("                Paulo H. Oliveira"),
    handle: chalk.blue("@PauloOliveiraDev"),
    // work: `${chalk.white("Colocar o cargo aqui")} ${chalk
    //    .hex("#4684F6")
    //    .bold("aqui o local")}`,
    work: chalk.white("  Desenvolvedor Full Stack"),
    github: chalk.gray("https://github.com/PauloOliveiraDev"),
    linkedin: chalk.gray("https://www.linkedin.com/in/paulohgo"),
    web: chalk.gray("https://paulodev.vercel.app"),
    npx: chalk.red("npx") + " " + chalk.white("paulo"),

    // labelWork: chalk.white.bold("       Work:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("  Portfólio:"),
    labelCard: chalk.white.bold("       Card:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `           ${data.work}`,
        ``,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        `${data.labelWeb}  ${data.web}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic("Atualmente estou em busca de novas oportunidades.")}`,
        `${chalk.italic("Minha caixa de entrada está sempre aberta —")}`,
        `${chalk.italic("seja para tirar uma dúvida ou apenas dizer um oi.")}`,
        `${chalk.italic("Responderei assim que possível!")}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "#4684F6"
    }
);

console.log(me);
const tip = [
    `Dica: Tente ${chalk.cyanBright.bold(
        "cmd/ctrl + clique"
    )} nos links acima`,
    '',
].join("\n");
console.log(tip);

prompt(questions).then(answer => answer.action());