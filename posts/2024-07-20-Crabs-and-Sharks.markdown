---
layout: "layouts/page.liquid"
title: "Crabs and Sharks"
authorAvatar: "https://avatars.githubusercontent.com/u/112771657?v=4"
author: "Angel Dollface"
description: "How to make a bot for Sharkey in Rust!"
date: "20/07/2024"
show: "false"
---

## Introduction

One thing many people come across when interacting with different social media sites is a bot for the platform they are active on. These days bots are as much a part of social media platforms as ads or other content we, as social media users, are used to. In this tutorial I shall walk you through making your own bot in Rust for a platform near and dear to my heart, Sharkey.

## What is Sharkey?

Two weeks ago I went into great detail on what Sharkey is and why it exists. You can read the deets [here](https://angeldollface.boo/posts/2024-07-06-Sharks-and-FOSS/). If you haven't read that post, let me quickly explain what Sharkey is. When you sign up on a social media website like Facebook, Meta Inc. owns the code behind Facebook and this code runs on their own physical computers sitting in a data center somewhere. Because a lot of mainstream platforms have garnered a lot of bad feelings towards them for a variety of reasons, many people switched to an alternate paradigm of social media platforms, called the "fediverse". The fediverse, in short, is run for the people by the people. The fediverse is constituted of many different pieces of software. This software is like Facebook or X but can be freely downloaded, modified, changed, added to. This paradigm of software development is called open-source software development. If someone wants to make their own X or Facebook, they simply download the software of choice, install it on their own computers so that people at large can use this software to interact with each other socially. There are many fediverse platforms like X and Sharkey is one of them. When a person installs fediverse software on their own server, this person is called an "instance". In the fediverse all instances of any software can communicate with each other. This ability is called "federation". Now that you have a good idea of what Sharkey is, let us move on to the tools and software you will need to make your own bot.

## Requirements

To build your own bot, you will need the following:

- A good text editor. I use [Neovim](https://neovim.io/) most of the time and [Visual Studio Code](https://code.visualstudio.com/) sometimes.

- The Rust toolchain. You can get that [here](https://www.rust-lang.org/learn/get-started).

- A Sharkey account. My instance of chocie is [blahaj.zone](https://blahaj.zone). You can also choose another instance but it should run [Sharkey](https://activitypub.software/TransFem-org/Sharkey). If it does not, your bot will not work.

- [A GitHub account](https://github.com/). This will help you backup and store your bot. You can make an account, but you do not have to.

Which operating system you use is not important. All these tools and your bot will work on any of the big three platforms (Windows, Mac OS, Linux). Now that you have your tools, let me briefly explain what a bot even is.

## What is a bot?

A social media platform lives off of its users. These users all have accounts on that platform. Bots are like normal users, except for one difference. When you interact with users and content on a platform in any way you want as a physical human, you do not have any particular rules or events guiding your behavior on that platform. This is how bot accounts are different from a physical human user. A bot account checks periodically if certain events have happened and responds to them by taking some action on that platform. Examples of such events could be the following: a certain amount of time has passed since the bot's last response to an action, a human user has posted content of some kind, and many more. The bot we will be making today does one thing: It will fetch the number of users online every 12 hours and make a post on our account with the current time, the number of users, and the link to our bot. The event the bot is responding to here is the elapsing of a certain amount of time, in this case 12 hours. Now that you know what we will be making, let me give you a primer on Rust, the programming language we will be building this bot in.

## What is Rust?

Rust is a programming language created in 2016 by an employee at Mozilla (the same people who make Firefox). Programming languages are human-readable instructions for your computer. These instructions are put into a text file and then processed by an application to do something useful, a compiler or an interpreter. Rust is a compiled programming language and an elegant one. In the world of programming languages there are two types of programming languages. There are interpreted languages and compiled languages. Interpreted languages are read by another application, an interpreter, line by line and each line is read and executed immediately. This means that the instructions you wrote are taken from the text file you wrote them in and read by the interpreter. The interpreter immediately translates these instructions into a computer-readable instructions and the computer executes them immediately. With compiled programming languages this is different. The instructions you write in a text file are read by an application called a compiler, translated into computer-readable instructions, put in a file, called a binary, and are NOT executed. All the compiler does is translate your instructions into computer-readable instructions. Now let's write some instructions of our own!

## A primer on how to write Rust

To make our bot

## What is the plan?

For simplicity's sake, I decided to split our bot into the three following parts:

- 1.) A data structure to hold the response from the Sharkey server.
- 2.) A function to get the current user count and post this user count to your Sharkey account.
- 3.) A function to run the function from point 2 every 12 hours.

## Making the project and adding a few crates

To create the files for our project we need 

## Structure of our bot

## Custom data structures

## Getting the count of users online

## Posting a note

## Running our app

## Running our bot periodically

## Conclusion

## Links