---
layout: "layouts/page.liquid"
title: "Crabs and Sharks II"
authorAvatar: "https://avatars.githubusercontent.com/u/112771657?v=4"
author: "Angel Dollface"
description: "How to make a bot for Sharkey in Rust! (Part II)"
date: "08/24/2024"
show: "false"
---

## What is the plan?

Before I explain the plan I had in mind, I would like to just fill you in on the networking knowledge required to make this bot. Many social media website, Sharkey included, allow you to interact with them using computer code. This interaction is done over what is called an application-programming interface, or API for short. These APIs work in a very simple way. These APIs have a set of pre-defined paths on the site's servers that hold certain information. When you go and ask the server "Hey, give me this info.", the server says "Sure!" and gives you the info you wanted as text in a certain format. You asking the server is called "making a request". The server sending back information to you is called "receieving a response". The text the server sends back is usually in the text format of JSON. JSON is a language for storing data in a structured way. How and why JSON exists is irrelevant for our purposes. Sometimes you can ask the server for information and tell it that you would like some very specific information by sending certain parameters along with your request. These parameters would also be sent as JSON. This quick survey of how programmtic interaction happens with social media sites is just for you to have the basic understanding of how our bot will work.

For simplicity's sake, I decided to split our bot into the three following parts:

- 1.) A data structure to hold the response from the Sharkey server and put the JSON response into.
- 2.) A function to get the current user count and post this user count to your Sharkey account.
- 3.) A function to run the function from point 2 every 5 seconds.

## Making the project and adding a few crates

To create the files for our project we need to tell the Rust compiler's package manager, Cargo, to create a few files for us. We can do that with this command:

```Bash
cargo new shonkbot
```

This command will create a new directory called "shonkbot" with a file to tell Cargo some information about our project and a sub-directory called "src" with our main Rust file inside it, "main.rs". These two files are all we will need. I suggest that you open the folder "shonkbot" in the text editor of your choice. We will be editing Cargo's manifest first and then get to writing the code for our bot.

## Setting up the project and adding some libraries

Each Cargo manifest has two basic sections: "package" and "dependencies". This Cargo manifest is called "Cargo.toml". The two sections each Rust project consists of are written in a format called TOML. In this format you specify which sections a TOML file has by enclosing the section name in square brackets. You will see that both the words "package" and "dependencies" are declared as sections. Inside these sections you store some data by assigning some data to a name. In TOML this is done as shown in the code sample below.

```
name = "shonkbot"
```

We will not have to modify the "package" section of our manifest, only the "dependencies" section. In the dependencies section we tell Cargo which libraries we will need for our bot project. Each dependency declared generally has the version number required, any parts needed from the library, and optionally if the library is not on "crates.io", Rust's central "warehouse" where all of Rust's libraries are kept, we have to specify where Cargo can download the code for the library. Open your "Cargo.toml" and add the following lines in the "dependencies" section:

# ADD CODE SNIPPET!

Here's a brief explanation of the libraries we just added and why we added them:

- chrono: We need this library to get the current time as a string of text.
- reqwest: This library is needed to download and upload things to and from our code to a Sharkey instance's servers.
- serde-json: We need this library to put the responses the instance's server sends back into a format we can modify and read from our Rust code.
- tokio: This library adds features that will help us run asynchronous code.
- serde: We need this library to import some special functions that add features to a structure we will be writing to "understand" the response the instance's server sends back.
- sharkey: This library I wrote makes working with Sharkey from Rust very easy.

## Custom data structures

Now we can finally start writing some Rust code! The first thing we need to do is import one of the special functions from the "serde" library. This function is called "Deserialize". It will help us decode the response we get from the instance's server into a data structure we can easily work with in Rust. Put the code below into your "main.rs" file located in "src".

```Rust
use serde::Deserialize;

#[derive(Deserialize)]
pub struct UsersOnline {
    pub count: u32
}
```

In line 1 we import the "Deserialize" function from the "serde" library. In line 4 we define our data type called "UsersOnline". We do this using a standard Rust structure. In line 3 we derive the special "Deserialize" function for our data type of "UsersOnline". This structure has one field, "count". This field will store what the Sharkey instance server returns as an unsigned integer of a maximum length of 32 bits. In Rust there are many types of numbers for diffferent use cases. "u32" is one of these data types.

Next, we need to define a function specifically for the "UsersOnline" data type that will allow us to extract the information of the number of users online right now as a string of text. Add the below code to your "main.rs" file.

```Rust
impl UsersOnline {
    pub fn to_string(self) -> String {
        self.count.to_string()
    }
}
```

In line 1 we define a block that holds functions specifically for the "UsersOnline" data structure. In Rust we do this via the "impl" keyword followed by the name of the data structure along with a set of curly braces. Inside these curly braces the functions for "UsersOnline" go. In our case this only one function, "to\_string". The "self" parameter to the function allows us to access fields of the structure and other functions for "UsersOnline". Inside our "to\_string" function on line 3 we simply the count of users online as a string. We declared that the function returns a string on line 2 with the "-> String" part.

Your code for your bot should now look something like this:

```Rust

use serde::Deserialize;

#[derive(Deserialize)]
pub struct UsersOnline {
    pub count: u32
}

impl UsersOnline {
    pub fn to_string(self) -> String {
        self.count.to_string()
    }
}

```

We are one third of the way! Two more functions left! The next component of our bot is actually getting the count of users and posting that to our Sharkey instance's server!

## Getting the count of users online and posting it

To get the count of users and post it, we need to define a function that does three things:

- 1.) Asks the Sharkey servers for the count of users currently online in some computer-readable format.
- 2.) Puts that information into the "UsersOnline" data structure.
- 3.) Posts that information along with the current time to our Sharkey account.

Before we can proceed we need to import a few functions and enums.
Add the following code to the top of your "main.rs" file:

```Rust
use reqwest;
use std::io::Error;
use serde_json::from_str;
use chrono::prelude::Local;
use sharkey::NoteVisibility;
use sharkey::ReactionAcceptance;
use sharkey::create_note_for_user;
```


In line 1 we import the "reqwest" library to make network requests to the server of our Sharkey instance. In line 2 we import an error structure to handle any errors that may occur inside operations we conduct in our function. In line 3 we import a function to put the data we get from the instance's server into our "UsersOnline" data structure. In line 4 we import a data structure from the "chrono" library to get the current time. In line 5 we import an enum from the Sharkey library to describe the visibility of the posts we make from our bot. This visibility only tells Sharkey who can see the posts our bot makes. In line 6 we import an enum from the Sharkey library to describe what reactions we would like on the posts we make from our bot. In line 7 we import the "create\_note\_for\_user" function from the Sharkey library to post notes to our Sharkey account from our bot code.

Let's first define our function! Put the code below into your main.rs file.

```Rust
pub async fn get_count_and_post(
    url: &str,
    api_base: &str,
    base_url: &str,
    token: &String,
    reaction_acceptance: &ReactionAcceptance,
    visibility: &NoteVisibility
) -> Result<(), Error>{
}
```

In the first line we define the asynchronous "get\_count\_and\_post" function. This function needs to be asynchronous because network requests take time to complete and may fail to do so. This also takes time. Our function accepts six paramaters. Here's a brief explanation of them:

- "url": This parameter contains the URL to the information on the Sharkey instance's server that will return the count of users currently online.
- "apibase": This parameter will be needed for posting a note and describes the path on the Sharkey instance's server that returns information when requested in a computer-readable format.
- "baseurl": This is the basic URL to Sharkey instance we are trying to post to.
- "token": Since an action like posting to your account requires you to login to your account first, this parameter is a string of text which is a shortcut to login to your Sharkey from code you write, in this case Rust.
- "reactionacceptance": This parameter is an enum from my Sharkey library to describe what sort of reactions we would like to accept on our posts from our bot.
- "visibility": This parameter is an enum from my Sharkey library to describe who can see the posts we make from our bot.


The function does not return any data but operations inside the function can go wrong which is why we return a result.

Let us get to operation one in our function: get the current count of users online. Add the following code inside the "get\_count\_and\_post" function:

```Rust
let resp = match reqwest::get(url).await {
    Ok(resp) => resp,
    Err(e) => return Err::<(), Error>(
        Error::new(std::io::ErrorKind::Other,e)
    )
};
```

In line one we call the "get" function from the "reqwest" library and give it the URL to get the count of users online. This request is stored in the "resp" variable. Because this request can fail for a variety of reasons, we need to handle any errors that may occur. This is done via the "match" keyword. The "match" keyword handles different variants of enums in Rust. Since the "get" function returns a "Result" enum with either an "Ok" variant or an "Err" variant, the "match" keyword is used. If the operation succeeds, we return the data the network request got from the "Ok" variant and if it fails, we return an instance of the "Error" data structure we just imported. These lines will return a raw response from the Sharkey instance's server. Next, we need to get the data we are actually looking for from this response. Add the following code under the bit you just added:

```Rust
let body: String = match resp.text().await{
    Ok(body) => body,
    Err(e) => return Err::<(), Error>(
        Error::new(std::io::ErrorKind::Other,e)
    )
};
```

In this step we are getting the raw text data from the response we fetched in the previous step. We do this by calling the "text" function on the "resp" variable from the previous step. Calling this function can fail if the response does not have any raw data so we again have to handle "result" that the "text" function returns. Since the raw data is just a string of text, we store it in the "body" variable of type "String". The "Ok" case returns our text and in the "Err" case we return an instance of the "Error" data structure we imported with some details on the error.

The penultimate operation in our function is to decode this raw text into our "UsersOnline" data structure. Add the following code right under the code we just added to get the text from our response:

```Rust
let parsed: UsersOnline = match from_str(&body){
    Ok(parsed) => parsed,
    Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other,e))
};
```

In line 1 we declare a variable of type "UsersOnline" and call it "parsed" since we have parsed (decoded) the raw data from our response into our "UsersOnline" data structure. We do this decoding via the "from\_str" function from the "serde\_json" library. This operation can also fail if the raw text data from the response was corrupted somehow. In the "Ok" case of the "Result" that the "from\_str" function returns we get our parsed data back. If the operation fails, we return an instance of the "Error" data structure we imported with some details on the error.

Now we can get the current time and finally post to our Sharkey instance's server. To perform this action, we need to add the following code right under the "parsed" variable declaration from the previous step:

```Rust
let local: String = Local::now().to_string();
let msg: String = format!(
    "Posted at: {}\nUsers online: {}",
    local,
    parsed.to_string(),
);
let _posted = match create_note_for_user(
    api_base, 
    base_url, 
    &token, 
    visibility, 
    &Some(*reaction_acceptance), 
    &msg
).await {
    Ok(_posted) => _posted,
    Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other, e))
};
Ok(())
```

This might look like a lot but it is very simple! In the first line we declare a variable called "local", where we get the current time as a string of text. We do this by calling the "now()" function on the "Local" data structure we imported from the "chrono" library. In the second line we define the message we would like to post on our Sharkey account. We store this message in a variable of type "String", since it is just a string of text and call it "msg". We "build" our message via the special "format" function Rust provides. Special functions in Rust are marked with an exclamation mark. The main message is the text inside double quotes. The curly braces inside the text mark that we would like to put pieces of data there. These two pieces of data are the two variables that follow the string of text, the "local" and "parsed.to\_string()" variables respectively. We call "to\_string" on our "parsed" variable because we want to return the count of users online as a string. The second variable "\_posted" is an empty variable for the function we call in it, "create\_note\_for\_user". We supply the paramaters from our "get\_count\_and\_post" function and await the results. Because this operation can fail and "create\_note\_for\_user" returns a "Result", we need to handle the "Ok" case and the "Err" case. In the "Ok" case we return the placeholder variable "\_posted" and in the "Err" case we return an instance of the "Error" data structure we imported with some details on the error.

Your Rust code for your bot should now look like this:

```Rust

use reqwest;
use std::io::Error;
use serde_json::from_str;
use chrono::prelude::Local;
use sharkey::NoteVisibility;
use sharkey::ReactionAcceptance;
use sharkey::create_note_for_user;

use serde::Deserialize;

#[derive(Deserialize)]
pub struct UsersOnline {
    pub count: u32
}

impl UsersOnline {
    pub fn to_string(self) -> String {
        self.count.to_string()
    }
}

pub async fn get_count_and_post(
    url: &str,
    api_base: &str,
    base_url: &str,
    token: &String,
    reaction_acceptance: &ReactionAcceptance,
    visibility: &NoteVisibility
) -> Result<(), Error>{
    let resp = match reqwest::get(url).await {
        Ok(resp) => resp,
        Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other,e))
    };
    let body: String = match resp.text().await{
        Ok(body) => body,
        Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other,e))
    };
    let parsed: UsersOnline = match from_str(&body){
        Ok(parsed) => parsed,
        Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other,e))
    };
    let local: String = Local::now().to_string();
    let proj_url: String = "https://github.com/angeldollface/sharkey.rs/tree/main/example".to_string();
    let msg: String = format!(
        "Posted at: {}\nUsers online: {}\nPosted from: {}",
        local, parsed.to_string(), proj_url
    );
    let _posted = match create_note_for_user(
        api_base, 
        base_url, 
        &token, 
        visibility, 
        &Some(*reaction_acceptance), 
        &msg
    ).await {
        Ok(_posted) => _posted,
        Err(e) => return Err::<(), Error>(Error::new(std::io::ErrorKind::Other, e))
    };
    Ok(())
}

```

The only thing left now is to define our second function to run the "get\_count\_and\_post\_function" in set time intervals.

## Running our counting-and-posting function periodically

To write this second function, we need to make a few more imports of functions and structures. Add the following code to the top of your "main.rs" file:

```Rust
use tokio;
use std::env::var;
use tokio::task::spawn;
```

In line 1 we import the "tokio" library to run asynchronous functions. In the second line we import the "var" function to retrieve values stored in environment variables on your system. In the command line, as stated earlier, you can not only run commands but also save data in so-called environment variables. These variables are usually settings for some application that runs on the command line and are usually pieces of text. In our case we do not want to expose the API token for Sharkey publicly, so we store our token in an environment variable. The "var" function helps ur retrieve our API token from our Rust code without disclosing this token to anyone else. In line 3 we import the "spawn" function to make a new process that runs in a certain interval from the "tokio" library.

When you write a Rust application, the Rust compiler looks for some entry point to your code. This entry point is the "main" function. This is the final and last function we will define to get our bot working. Add the following code to your "main.rs" file:

```Rust
#[tokio::main]
async fn main() {
}
```

Since Rust does not support running asynchronous code inside the "main" function of an application, we ask the "tokio" library for help with this and use the special function it provides us with to run asynchronous code from the "main" function. This special function is being called upon in line 1. In line 2 we simply define our bot's "main" function. There is nothing in it yet but that will change in the next step.

Because I mentioned we need an API token for Sharkey to conduct operations that would normally require us to login, like making a post to our account, we now need to fetch our API token from the environment variable we created earlier. To do this, add the following code inside the "main" function:

```Rust
match var("SHARKEY_API_TOKEN"){
    Ok(token) => {

    },
    Err(e) => eprintln!("{}", e)
};
```

In line 1, since the "var" function returns a "Result", we use the "match" keyword on the "var" function to retrieve the API token from the environment variable "SHARKEY\_API\_TOKEN". In line 2 we handle the "Ok" case and in line 5 we print out any errors if the retrieval of the token fails. Inside the "Ok" case we will now call on the "spawn" function to run the "get\_count\_and\_post" function periodically. To implement this, add the following code within the curly braces "Ok" case of retrieving our API token:

```Rust
let scheduler = spawn(
    async {
        let api_token: String = token;
        let mut interval = tokio::time::interval(std::time::Duration::from_secs(5));
        loop {
            interval.tick().await;
        }
    }
);
let _ = scheduler.await;
```

In line one we define a variable called "scheduler" that calls on the "spawn" function we imported to run some job periodically. In line 2, because the "spawn" function" takes another function as an argument, we define this function and mark it to be asynchronous since our "get\_count\_and\_post" function is also asynchronous. In line 3 we "copy" our API token so that we can use it inside the asynchronous function we just defined. In line 4 we define a mutable variable called "interval" that sets the time interval in which to run our "get\_count\_and\_post" function. I chose 5 seconds but you would realistically run this maybe every 12 or 24 hours. In line 5 we make a statement to do whatever is inside the curly braces after the "loop" keyword again and again, forever. On line 6 we reset the time interval until the next time the instructions inside the "loop" block are executed. On line 10 we call the function defined inside the "scheduler" variable and await its results.

Now we are ready to call our "get\_count\_and\_post" function. Add the following code after line 6 of the code we just added.

```Rust
match get_count_and_post(
    "https://blahaj.zone/api/get-online-users-count", 
    "/api", 
    "https://blahaj.zone", 
    &api_token, 
    &ReactionAcceptance::LikeOnly, 
    &NoteVisibility::Public
).await {
    Ok(_x) => {},
    Err(e) => eprintln!("{}", e)
};
```

This block of code will run again and again every 5 seconds and finally calls our "get\_count\_and\_post" function. Because our function returned a "Result" we need to use the "match" keyword again and handle the "Ok" cases and "Err" cases, respectively. We call the function on line 1. On line 2 we supply the function with the URL to the API for our Sharkey instance's server. In my case this is "blahaj.zone". If you signed up with a different instance of Sharkey, change that to be your instance. On line 3 we supply the basic path to all computer-readable data for the Sharkey instance. On line 4 we supply the URL to our instance and on line 5 we supply the API token. On line 6 we tell Sharkey that the only reactions we want to accept on our bot's posts are likes. And on line 7 we tell Sharkey that our bot's posts should be visbile for everyone. After we have called the function, we await the result and do nothing in the "Ok" case and print out the error to the screen if an error occurs.

## Running our bot

Now that we have built our bot, running it is very simple. Open up your a command line session inside the "shonkbot" directory and run the following command:

```Rust
cargo run
```

This will download all the libraries we imported, combine your code and the library code together, translate all that code into machine code, and run the resulting binary executable. You will see no output. However, if you navigate to your Sharkey account's timeline, you will see your user posting the current number of people online on your instance every 5 seconds. To kill and exit the bot you just built, you can usually press Control+C.

## Conclusion

I hope you enjoyed learning some Rust and building a cool project like this bot. I hope I explained everything easily enough and if you encounter any problems, please do not hesitate to contact me on[Instagram](https://instagram.com/angeldollface666) or on my Sharkey profile [here](https://blahaj.zone/@angeldollface666). If you liked this blogpost, follow me on Instagram and/or Sharkey and play around with the bot and see how you can extend it or modify it!