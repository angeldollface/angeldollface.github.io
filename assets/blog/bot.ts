/*
SHONK BOT by Alexander Abraham, 
a.k.a. "Angel Dollface".
Licensed under the DSL v1.
*/

// Importing the Sharkey library for Deno.
import * as sharkey from 'sharkey';

// Variables for the API functions.
const APIBASE: string = '/api';
const LOCALONLY: boolean = false;
const VISIBILITY: string = 'public';
const NOEXTRACTEMOJIS: boolean = false;
const NOEXTRACTMENTIONS: boolean = false;
const NOEXTRACTHASHTAGS: boolean = false;
const BASEURL: string = 'https://blahaj.zone';
const REACTIONACCEPTANCE: string = 'likeOnly';

function getToken(){
    let result: string = '';
    if (Deno.env.get('BLAHAJ_API_TOKEN') == ''){
        throw 'Could not get API token.';
    }
    else {
        result = (Deno.env.get('BLAHAJ_API_TOKEN') as string);
    }
    return result;
}

// Getting the count of users online and returning
// the note text.
async function getUserCount(): Promise<string> {
    let result: string = '';
    let count: string;
    const usersCount: object = await sharkey.onlineUsersCount(BASEURL, APIBASE);
    if (sharkey.objectIsErrorResponse(usersCount)){
        throw 'Could not fetch user count.';
    }
    else {
        if (Object.prototype.hasOwnProperty.call(usersCount, 'count')){
            count = new Map(Object.entries(usersCount)).get('count');
            result += 'Users online right now: ' + count;
        }
    }
    return result;
}

// The function to post the note.
async function postNote(){
    const msg = await getUserCount();
    const logMessage: string = 'Creating note with message: ' + msg;
    console.log(new Date());
    console.log(logMessage);
    const _note: object = await sharkey.createTextNoteForUser(
        APIBASE,
        BASEURL,
        getToken(),
        VISIBILITY,
        LOCALONLY,
        REACTIONACCEPTANCE,
        NOEXTRACTMENTIONS,
        NOEXTRACTHASHTAGS,
        NOEXTRACTEMOJIS,
        msg
    );
}

Deno.cron(
    'Posting users online',
    {
        hour: {
            every: 23
        }
    },
    () => {
        postNote();
    } 
);