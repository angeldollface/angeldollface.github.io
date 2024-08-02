---
layout: "layouts/page.liquid"
title: "Crabs and Sharks I"
authorAvatar: "https://avatars.githubusercontent.com/u/112771657?v=4"
author: "Angel Dollface"
description: "How to make a bot for Sharkey in Rust! (Part I)"
date: "08/17/2024"
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
- A Sharkey API key. Assuming you already have made your Sharkey account on your instance of choice, go to your account settings, go to "API", and click on "Generate Access Token". Click on "Enable All" and name it. Then, click on the checkmark and copy your access token and save it somewhere safe!

Which operating system you use is not important. All these tools and your bot will work on any of the big three platforms (Windows, Mac OS, Linux). Now that you have your tools, let me briefly explain what a bot even is.

## What is a bot?

A social media platform lives off of its users. These users all have accounts on that platform. Bots are like normal users, except for one difference. When you interact with users and content on a platform in any way you want as a physical human, you do not have any particular rules or events guiding your behavior on that platform. This is how bot accounts are different from a physical human user. A bot account checks periodically if certain events have happened and responds to them by taking some action on that platform. Examples of such events could be the following: a certain amount of time has passed since the bot's last response to an action, a human user has posted content of some kind, and many more. The bot we will be making today does one thing: It will fetch the number of users online every 12 hours and make a post on our account with the current time, the number of users, and the link to our bot. The event the bot is responding to here is the elapsing of a certain amount of time, in this case 12 hours. Now that you know what we will be making, let me give you a primer on Rust, the programming language we will be building this bot in.

## What is Rust?

Rust is a programming language created in 2016 by an employee at Mozilla (the same people who make Firefox). Programming languages are human-readable instructions for your computer. These instructions are put into a text file and then processed by an application to do something useful, a compiler or an interpreter. Rust is a compiled programming language and an elegant one. In the world of programming languages there are two types of programming languages. There are interpreted languages and compiled languages. Interpreted languages are read by another application, an interpreter, line by line and each line is read and executed immediately. This means that the instructions you wrote are taken from the text file you wrote them in and read by the interpreter. The interpreter immediately translates these instructions into a computer-readable instructions and the computer executes them immediately. With compiled programming languages this is different. The instructions you write in a text file are read by an application called a compiler, translated into computer-readable instructions, put in a file, called a binary, and are NOT executed. All the compiler does is translate your instructions into computer-readable instructions. Now let's write some instructions of our own!

## A primer on how to write Rust

To make our bot we will need some knowledge on a few programming concepts and Rust-specific features. Let's start at the beginning. 

### Variables

The most basic entity in any programming language is a variable. Variables are like boxes that you put something inside. This something is a piece of data. This data has to be of a certain type. Some common types of data are strings and numbers. In Rust we would declare a variable, a box, that only holds data of type "String" like this:

```Rust
let my_var: u32 = 666;
```

In the sample above we declare a variable, or box, that holds the text "Hello World!". Rust was invented, among other things, to make a safer C++. I won't go into what that means but this goal of safety brought along another very important concept in Rust: mutable data. In the variable declaration above we cannot change the contents of the box containing our variables. If, however, we modify the statement above like the sample below, we can modify what text the variable box holds.

```Rust
let mut my_var: u32 = 666;
my_var = 566;
```

Now we have declared our variable to be changeable and can now replace the number *666* in the variable box with *566*. That is all you need to know about variables.

### Functions

In all programming languages one writes instructions for a computer. Sometimes these instructions can get very long and hard to maintain. To solve this problem almost all programming languages have what are called "functions". These functions take data, process it, and return the processed data. Each function has the following features:

- A name
- A set of input parameters
- A return type
- A function body

To make this clearer, consider this small code snippet of a function in Rust:

```Rust
fn greet(name: &str) -> String {
    return format!("Hello, {}!", name);
}
```

In the code snippet above you can see the definition for a function called "greet". The function's input parameters are between the two brackets. On the left side between the brackets we have the name of the input parameter, "name" and on the right side, after the colon, we have the type of the "name" input parameter. The bit after the brackets "-> String" tells Rust that this function returns a string of text. Functions in Rust are declared via the "fn" keyword. The bit inside the curly braces is called the "function body". In the case of the "greet" function, the data of "name" is mutated through the addition of "Hello," before it and an exclamation mark after it. Any data that needs to be returned is marked with the "return" keyword. In Rust, however, you do not *need* to use this keyword.

### Structures

Sometimes there care cases when you want to put a lot of "variable" boxes in a bigger box. This "bigger box" is called a structure in Rust. Every structure has two very important parts: the name and the fields. Let us look at a structure to make this clearer:

```Rust
struct Person{
    name: String,
    age: u32
}
```

Here we have defined a big box called "Person". Inside the box we have two fields, or variables, called "name" and "age". "name" has to have the type of "String" since it is just a string of text and "age" has to have the type of "u32" (one of the types of numbers in Rust). "name" and "age" are the fields of the structure with the name of "Person". When you define a structure, this structure becomes its own data type like "String" or "u32". Simple, right?


### Deriving "traits"

Having a bigger box of variables is good but what do you do if you want to use a function on the bigger box you just wrote and maybe other bigger boxes that are similar? This is where traits come in. Traits are essentially functions that are shared between many structures. Sometimes other people write a trait and then you might want to use that trait on a structure you wrote. Using another person's trait is called "deriving" that trait for your structure. This will become relevant later on, which is why I am covering it here.

### Enums

Another useful construct in Rust are enums. Enums are essentially like a bunch of options from a list. Enums have a name and a bunch of options. These options inside enums are called "variants". Let's have a look at an enum.

```Rust
enum PersonAge {
    Young,
    MiddleAged,
    Old
}
```

As you can see here, enums are defined via the "enum" keyword followed by their name. In our case this "PersonAge". This enum has the options, or variants, of a person being "Young", "MiddleAged" or "Old". To do something for every variant of an enum the "match" keyword is used. Consider this example.

```Rust
let person_age: PersonAge = age();
match person_age {
    Young => println!(
        "Wow! You are young!"
    ),
    MiddleAged => println!(
        "Don't buy a Porsche 911."
    ),
    Old => println!(
        "How was Bingo last night?"
    )
}
```

In this code sample we called on a function called "age". The function returned the enum "PersonAge". To print out a message for each age group, we "matched" against all the options that the "PersonAge" enum provided us with. That's all there is to it.

### Results

Enums are very common in Rust and add one very significant and useful feature to Rust, "Results". Results are enums with two variants: "Ok" and "Err". Results are used for operations that can fail. If the operation succeeds, the data resulting from that operation is returned throught the "Ok" variant. If the operation fails, an error type is returned from the "Err" variant.

### Asynchronous programming

One of the other concepts you will encounter in this tutorial is that of asynchronous programming. Asynchronous programming is programming or handling operations that take time to complete. Such operations could be downloading or uploading something, waiting for a long task to complete or awaiting a response from a chat partner. In Rust asynchronous functions are written like this:

```Rust
async fn longop(){
    longerop().await;
}
```

In this code sample we have declared an asynchronous function called "longop". We have declared it to be asynchronous via the "async" keyword before the "fn" keyword. If we need to await the result of an operation that takes time, we call ".await" on that function or operation. In this case, this is the "longerop" function. The bot we will be writing is completely asynchronous.

### Ownership and Borrowing

Another most important Rust concept is that of ownership and borrowing. In most programming languages you can declare a variable and reuse it wherever you need it. This is not the case in Rust. If you declare a variable, you can only use it once. To make Rust a safe language and provide good memory management, Rust forces you to declare a variable once and then use a *reference* of that variable in other places using the "&" sign. Allow me to illustrate this:

```Rust
let name: String = "Dolly"
    .to_string();
greet(name);
greet(name);
```

In line 1 a variable of type "String" is declared. In line 3 I attempt to use this variable in the "greet" function I defined earlier. If I use it only once, this will work and Rust will accept my code. When I use the variable again on line 3, however, Rust will throw an error telling me this is illegal. This is the case because only one entity can use a piece of data only once at a time. The entity owns that piece of data. If, however, I changed the code sample above by referencing "name" in the two calls of "greet" by prefixing "name" with an "&" symbol, Rust would accept my code. You will see this use of the ampersand a few times in the code we will be writing.

### Looping and recursion

Another concept I will be using in this bot is looping. Looping operations is the performance of an operation again and again forever or again and again until a certain condition is met. The performance of an operation again and again is called "recursion" or "iteration". The infite recursion without a condition being met is reloevant for the bot we will be building, so no need to worry about the second type.

### Libraries

The ecosystem around the field of programming is huge. Many people write code and many people want to share their code with others. To avoid sending code around and rewriting the same thing many times, some people package their code in such a way that it can be easily downloaded by others and reused in their own projects. These packages of software available for reuse by others is called a "library". Libraries are very common in many programming languages and to manage the installation and downloading of such libraries, package managers are used. Package managers are applications that download and install code someone else has written in such a way that you can use that library in your own projects. One common way to make things reusable in Rust is the addition of the "pub" keyword to functions, structures, enums, and other entities. Rust's package manager is Cargo. 

### The command line

Before I explain to you how our bot will be structred, I would like to give you a quick introduction to the command line. When you interact with your computer, you usually point at and click on things. The command line is simpler than that. You usually interact with the command line through some kind of terminal-emulation application. Which application this is depends on your operating system. When you open that app, you can enter commands. These commands also allow you to interact with your operating system but only through a text-based interface. Some commands are usually built-in, while you might have to install other commands. Rust's tools are command line tools. The command line not only lets you interact with your computer through a text-based interface, but also allows you to store pieces of data. These pieces of data are called environment variables. The variables usually hold some text data and you can access these pieces of data by simply calling on the name of the environment variable you saved them in. Depending on which operating system you are doing this tutorial on, you will have to see how to create an environment variable. To complete this tutorial, you will have to copy the API token you generated earlier for your Sharkey account and save it in an environment variable called "APITOKEN".

## To be continued

Next week I shall lay out the plan for this bot we will be writing and go into specifics. This is part 1 out 2 of this tutorial. I hope you learned some Rust and if you didn't, I recommend reading what was explained so far as many times as you need. I also struggled a bit at first when getting to know Rust for the first time and writing some code in it. If you enjoyed this tutorial, follow me on [Instagram](https://instagram.com/angeldollface666) or [Sharkey](https://blahaj.zone/@angeldollface666).