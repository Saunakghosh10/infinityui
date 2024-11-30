#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('create-infinity-ui')
  .description('CLI tool for Infinity UI')
  .version('0.1.0');

program
  .command('create <project-name>')
  .description('Create a new Infinity UI project')
  .action(async (projectName) => {
    console.log(chalk.blue(`Creating new Infinity UI project: ${projectName}`));
    
    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Select a template:',
        choices: ['next', 'vite', 'remix']
      }
    ]);

    // Create project
    execSync(`npx create-next-app@latest ${projectName} --typescript --tailwind --app`);
    
    // Install dependencies
    console.log(chalk.blue('\nInstalling Infinity UI...'));
    execSync(`cd ${projectName} && npm install infinity-ui`);
    
    console.log(chalk.green('\nProject created successfully! 🎉'));
  });

program
  .command('add <component>')
  .description('Add a component to your project')
  .action(async (component) => {
    const components = ['button', 'card', 'input', 'modal'];
    
    if (!components.includes(component)) {
      console.log(chalk.red(`Component "${component}" not found`));
      return;
    }

    // Copy component files
    const componentPath = path.join(process.cwd(), 'components', 'ui');
    fs.copySync(
      path.join(__dirname, 'templates', component),
      path.join(componentPath, component)
    );

    console.log(chalk.green(`Component "${component}" added successfully! 🎉`));
  });

program.parse(); 