# Labyrinth (Prototype)
Just a toy prototype, messing around with various features. This writing comes about a year after I left the project behind, so this is being written from potentially spotty memory after giving the project a quick once-over.

The "game" is networked, so the client communicates with a NodeJS based server through socket.io for all messages - including authentication. It seems I finished the login functionality, character listing, character creation, dungeon generation, and character actions.

## Login Screen
![Empty login screen](/../screenshots/login_screen.png?raw=true)

The login page is comprised on DOM elements styled to match the UI that is drawn in ~Phaser~ Pixi.JS (apparently this is before I wised up and started using Phaser over Pixi) later.

![Login screen filled](/../screenshots/login_screen_filled.png?raw=true)

At this point, the socket is already established, but it isn't yet authenticated. Looking into main.js:61, I believe I may have tried to roll my own authentication (tisk tisk). Since then I've started using JWT-based authentication as described [here](https://auth0.com/blog/auth-with-socket-io/). TODO: Take a closer look at how I did - namely how vulnerable the solution I came up with is.

I didn't show it in the screenshots, but an alert pops up with an error if invalid credentials are provided.

## Loading Bar
This screen will appear briefly after successful login. It was actually kinda hard to get a screenshot because of how quickly it loaded (the image is about to fade out to the next screen, which is why its a bit dim):

![Loading bar](/../screenshots/loading_screen.png)

It quickly goes through and lists all the resources that are being loaded, and the bar moves along accordingly. This is a self-implemented component.

## Character Select
![List of characters: ShadowSong, Somavia, Somavian](/../screenshots/character_select.png)

The character select screen actually fetched a list of the account's characters from the server over socket.io as well, and renders them to the screen. It is drawing them with Pixi.js, so I feel like this is going to have issues if the list overflows the screen (I don't believe I thought to check at the time - oops). Clicking any of the characters will toss you into the game using that character. A brand new account would only show the + at the bottom.

Clicking the + bring us to...

## Character Creation
![Create character screen](/../screenshots/create_character.png)

I actually surprised myself when I discovered this hiding in the depths of my Github account - I wasn't aware I had created something so complete. Everything on this screen is functional. The arrows beneath the character preview turn the character to face the direction of the arrow, the name text input is homemade and drawn in Pixi, etc. You can see all the changes in this screenshot:

![Create character screen with a few fields changed](/../screenshots/create_character_filled.png)

The character and the "style" name in the middle of the arrows for skin, hair, and eyes both update. The class label also updates along with the description text below. Clicking the Create Character button even validates server-side:

![Validation message: Character name contains invalid characters (due to a space)](/../screenshots/create_character_validation.png)

However, now that I'm done tooting my own horn, the `./js/screens/charcreate.js` file is actually pretty bad code. Things are unnecessarily complex, there are stylistic inconsistencies (:209 and :236 use `self.` instead of `this.` like all the other methods), and there is an odd blend of functional code into a codebase that is obviously intended to be object-oriented.

Anyway, once a valid character is created, you are sent back to the character select screen with your new character:

![Character select screen again, now with new character](/../screenshots/character_select_new.png)

## Screen System
This is a quick aside from the main front-end features of the game to quickly highlight an underlying system. Phaser has a Scene function and it seems I tried to create something like it out of necessity. Granted, there isn't any inheritence resulting in code duplication among the screen classes but it does seemed to have worked decently well.

## In-Game Dungeon
Selecting a character will toss you directly into the game:

![Character in world with terminal overlayed on side](/../screenshots/generate_dungeon.png)

It actually looks like there was a fair amount of work put into this. I'll quickly talk about the dungeon generation algorithm because I actually remember it.

First, the algorithm:
1. Select a random component from a library of pre-made pieces and place it in the world
2. Pick a random "connector" defined on the component
3. Pick a random component from the library that has a matching connector on it
4. Place the new component so the connectors match up and remove the connectors from both components
5. Repeat recursively from step 2 on the latest component until no connectors remain

This ends up being a depth-first search, each branch ending on a component that has only a single connector. As an example, let's look at a T-shaped hallway component:

```
#####
.....
,...,
.....
#.,.#

# = Wall
. = Floor
, = Floor, connector
```

This component could actually match up with itself in two different ways - to the left or right:

```
##########
..........
,........,
..........
#.,.##.,.#
```

Note that the connectors in the middle are gone. With only a handful of pieces (defined in JSON files), rather extensive dungeons could be generated.

Anyway, dungeons are generated each time the game is started, the character can move in 8 directions with ASDW (including a walk animation), dodge/dash in the direction they're moving with a tap of shift, and will play an attack animation on left-click.

I have included the terminal in the screenshot to demonstrate just what is going on - the server is quick busy in the background.

## Server
The server is actually a fairly large beast. It persists everything using SQLite (which I have since abandoned in favor of MongoDB) and responds to various requests through sockets. This is pretty old code and I have actually learned quite a few new things since then:
- Async/await would make for much more readable code than callback hell
- I didn't know how to make actual node modules (with `module.exports`) at the time, that would help to split the server out into small chunks
- Would switch to MongoDB to make the queries/persistence more managable
- Would want to find a better way to load the components - maybe use fs to just load everything in the directory. I did actually like how the components were defined in JSON as it makes for easy editing
