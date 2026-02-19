#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
    .name('tribo')
    .description('Official Tribo Labs MiniKit CLI')
    .version('1.0.7')
    .argument('[directory]', 'directory to create the app in')
    .action(async (directory) => {
        console.log(chalk.bold.green('\n🚀 Welcome to Tribo Labs SDK\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'What is your project name?',
                default: directory || 'my-tribo-app',
                when: !directory
            },
            {
                type: 'list',
                name: 'type',
                message: 'How would you like to start?',
                choices: [
                    { name: 'Clone official Template (Next.js + SDK)', value: 'template' },
                    { name: 'Install SDK only (tribo-kit-sdk)', value: 'sdk-only' }
                ]
            }
        ]);

        const projectName = directory || answers.projectName;
        const targetDir = path.resolve(process.cwd(), projectName);

        if (answers.type === 'template') {
            const spinner = ora(`Cloning Tribo template into ${chalk.cyan(projectName)}...`).start();
            try {
                // Here we would ideally clone from a public URL. 
                // For now, since we are in the user's environment, we'll simulate the clone logic.
                // In reality, this would be: await execa('git', ['clone', 'https://github.com/Ortegaa03/template_ecosystem_app.git', targetDir]);

                await execa('git', ['clone', 'https://github.com/Ortegaa03/template_ecosystem_app.git', targetDir]);

                // Clean up git history of the template
                await fs.remove(path.join(targetDir, '.git'));

                spinner.succeed(chalk.green('Template cloned successfully!'));

                console.log('\nNext steps:');
                console.log(chalk.cyan(`  cd ${projectName}`));
                console.log(chalk.cyan('  npm install'));
                console.log(chalk.cyan('  npm run dev'));
            } catch (error: any) {
                spinner.fail(chalk.red('Failed to clone template.'));
                console.error(error.message);
            }
        } else {
            const spinner = ora(`Initializing project with ${chalk.cyan('tribo-kit-sdk')}...`).start();
            try {
                await fs.ensureDir(targetDir);
                await execa('npm', ['init', '-y'], { cwd: targetDir });
                await execa('npm', ['install', 'tribo-kit-sdk'], { cwd: targetDir });

                spinner.succeed(chalk.green('SDK installed successfully!'));

                console.log('\nNext steps:');
                console.log(chalk.cyan(`  cd ${projectName}`));
                console.log(chalk.cyan('  Start building your Tribo app!'));
            } catch (error: any) {
                spinner.fail(chalk.red('Failed to initialize project.'));
                console.error(error.message);
            }
        }

        console.log(chalk.bold.green('\nPowered by Tribo Labs 💚\n'));
    });

program.parse();
