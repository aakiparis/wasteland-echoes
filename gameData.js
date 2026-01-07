const gameData = {
    locations: {
        junktown: {
            name: "Junktown",
            description: "A scrappy settlement built from the bones of the old world.",
            characters: ["oldManPete", "sergeantSteel", "greasyLeo", "docAnya", "kidGizmo"],
            unlocked: true
        },
        shadowkeep: {
            name: "Shadowkeep",
            description: "A fortified underground city, buzzing with rumors and secrets.",
            characters: ["fixer", "donMoroni", "barkeepJones", "whispers", "gladiatorGrok"],
            unlocked: false
        },
        oasis: {
            name: "The Oasis",
            description: "A rare patch of green in the wasteland, fiercely guarded.",
            characters: ["elderWillow", "zara", "farmerStan", "adeptKai", "childOfAtom"],
            unlocked: false
        },
        titanPeak: {
            name: "Titan's Peak",
            description: "A lonely communications tower looming over the wastes.",
            characters: ["hermit", "scavverMia", "brokenSynth", "prospectorJed", "windWorshipper"],
            unlocked: false
        },
        rustyards: {
            name: "The Rustyards",
            description: "A sprawling graveyard of pre-war industry. The air is thick with the tang of rust and the sound of grinding metal.",
            characters: ["foremanGriggs", "scavverJinx", "madMick", "theIrradiated"],
            unlocked: false
        },
        aethelburg: {
            name: "Aethelburg",
            description: "A sterile, corporate city-state that gleams under the smog. The streets are clean, and the people are tense.",
            characters: ["chiefValerius", "drAris", "ambassadorKael", "conciergeUnit"],
            unlocked: false
        }
    },
    characters: {
        // --- JUNKTOWN CHARACTERS ---
        oldManPete: {
            name: "Old Man Pete",
            dialogue: {
                start: {
                    text: "Well, look what the radstorm dragged in. Another wanderer with hopeful eyes. What do you want, kid?",
                    options: [
                        { text: "I'm just passing through. Looking for work.", next: "passingThrough" },
                        { text: "[INT 4] I'm looking for information about this area.", next: "infoSeeker" },
                        { text: "[STR 5] Out of my way, old man.", next: "rude" },
                        { text: "What's your story?", next: "askStory" }
                    ]
                },
                askStory: {
                    text: "My story? My story is written in the rust and dust of this town. I saw it built, and I'll see it fall. Seen a lot of faces like yours come and go. Most go.",
                    options: [ { text: "That's grim.", next: "end" } ]
                },
                passingThrough: {
                    text: "Work, eh? Sergeant Steel over there is always looking for fresh meat for the guard. Or... if you're less scrupulous, Greasy Leo at the cantina might have a job. Your funeral, either way.",
                    options: [{ text: "Thanks for the tip.", next: "end" }]
                },
                infoSeeker: {
                    text: "Smart kid. Knowledge is power, and a bullet in the back. They say there's a green place, an Oasis, to the east. Path is hidden. Maybe the hunter, Zara, knows. She heads for Titan's Peak sometimes.",
                    options: [{ text: "An Oasis? I'll look into it. Thanks.", next: "end_unlockTitan" }],
                    onEnter: (gs) => { gs.unlockLocation('titanPeak'); return "New Location Unlocked: Titan's Peak"; }
                },
                rude: {
                    text: "Hmph. All muscle and no manners. An attitude like that will get you a shallow grave.",
                    options: [{ text: "Whatever, old man.", next: "end" }],
                    onEnter: (gs) => { gs.changeRep(-5); return "Reputation decreased."; }
                },
                end: { text: "Don't cause trouble.", options: [], isEnd: true },
                end_unlockTitan: { text: "Be careful out there. The wastes are hungry.", options: [], isEnd: true }
            }
        },
        sergeantSteel: {
            name: "Sergeant Steel",
            dialogue: {
                start: {
                    text: "Civilian. State your purpose. This is a secure zone.",
                    options: [
                        { text: "I'm here to help. I heard you need people.", next: "offerHelp" },
                        { text: "What's the biggest threat to this town?", next: "askThreat" },
                        { text: "[REP 10] I get things done. What's your problem?", next: "repHelp" },
                        { text: "Just looking around.", next: "end" }
                    ]
                },
                askThreat: {
                    text: "Threats? Take your pick. Raiders, mutants, the water running out... But recently? A prototype combat drone went missing from a military convoy. If it falls into the wrong hands...",
                    options: [
                        { text: "A drone? I can help find it.", next: "acceptDroneQuest", condition: (gs) => !gs.hasFlag('drone_quest_accepted') },
                        { text: "Sounds like a problem.", next: "end" }
                    ]
                },
                acceptDroneQuest: {
                    text: "You? Heh. Fine. Last known heading was towards Shadowkeep. My guess is someone is trying to sell it. Find it, bring back its targeting chip. You'll be rewarded handsomely.",
                    options: [{ text: "I'm on it.", next: "end" }],
                    onEnter: (gs) => { gs.setFlag('drone_quest_accepted'); return "Quest Accepted: The Rogue Drone."; }
                },
                offerHelp: { text: "Good. We have a problem. Raiders have been hitting our supply caravans. We need someone to escort a water shipment to the settlers near the old factory. It's dangerous, but you'll be rewarded.", options: [ { text: "I'll do it. For the people.", next: "acceptQuest_good" }, { text: "What's the pay?", next: "askPay" } ] },
                repHelp: { text: "I've heard of you. Good. No time to waste. Raiders are choking our supply lines. Escort a water shipment, make sure it gets through. You'll be well compensated.", options: [{ text: "Consider it done.", next: "acceptQuest_good" }] },
                askPay: { text: "500 XP and the gratitude of Junktown. It's about more than caps, kid.", options: [{ text: "Alright, I'm in.", next: "acceptQuest_good" }] },
                acceptQuest_good: { text: "You've got guts. The caravan is ready. [You spend a day on the trail. Raiders attack, but you fight them off, taking a few hits in the process. The water arrives safely.]", options: [{ text: "A job well done.", next: "completeQuest_good" }], onEnter: (gs) => { gs.changeHealth(-5); gs.changeXp(500); gs.changeRep(20); return "Lost 5 HP. Gained 500 XP & 20 Rep."; } },
                completeQuest_good: { text: "You did it. You're a hero, kid. Junktown is in your debt. I hear the people at the Oasis value defenders like you. You should go there.", options: [{ text: "Thank you, Sergeant.", next: "end" }], onEnter: (gs) => { gs.unlockLocation('oasis'); return "New Location Unlocked: The Oasis"; } },
                end: { text: "Stay sharp.", options: [], isEnd: true }
            }
        },
        greasyLeo: {
            name: "Greasy Leo",
            dialogue: {
                start: {
                    text: "What do you want? And make it quick. I'm a busy man.",
                    options: [
                        { text: "I'm looking for a special kind of work.", next: "askWork" },
                        { text: "I need a rare component.", next: "askComponent" },
                        { text: "[LCK 5] Feeling lucky. Any games of chance here?", next: "feelingLucky" },
                        { text: "Nothing. My mistake.", next: "end" }
                    ]
                },
                askComponent: {
                    text: "Heh, you and everyone else. What are you looking for?",
                    options: [ { text: "A hydro-actuator. It's for a client.", next: "actuatorQuest" }]
                },
                actuatorQuest: {
                    text: "A hydro-actuator... there's a rumor you can find old-world tech like that in the Rustyards, but it's a deathtrap. I know a scavver, Jinx, who might guide you. Find her. She owes me.",
                    options: [{text: "Where can I find Jinx?", next: "findJinx"}]
                },
                findJinx: {
                    text: "She's not here now, but you can find her in the Rustyards. If you can get there. Tell her Leo sent you. She'll know what it means.",
                    options: [{text: "Thanks, Leo.", next: "end"}],
                    onEnter: (gs) => { gs.setFlag('actuator_quest_accepted'); return "Quest Accepted: The Hydro-Actuator."; }
                },
                askWork: { text: "Heh. I like your style. I need a package 'delivered' to the Fixer in Shadowkeep. Don't ask what's in it. Don't be seen. You get it there, you get paid. Simple.", options: [ { text: "I'm not a mule.", next: "refuseWork" }, { text: "Where's Shadowkeep? And what's the pay?", next: "acceptWork" } ] },
                feelingLucky: { text: "Always. [Leo grins, showing a gold tooth.] A simple game. I toss this coin. You call it. You win, you get a hot tip. You lose... you owe me a favor. A big one.", options: [{ text: "Toss the coin.", next: "coinToss" }] },
                coinToss: { text: "[Leo flips a weighted coin. With your luck, you spot the imbalance just as it leaves his thumb.]", options: [{ text: "It's a trick coin. Let's talk about that 'delivery' again.", next: "acceptWork" }], onEnter: (gs) => { return "Your luck saved you from a bad deal."; } },
                refuseWork: { text: "Your loss. Now get out of my sight.", options: [{ text: "...", next: "end" }] },
                acceptWork: { text: "Shadowkeep is the hole-in-the-ground city to the west. A real charming place. Get this to the Fixer, and you'll get 400 XP. Now go.", options: [{ text: "I'm on my way.", next: "end_acceptWork" }], onEnter: (gs) => { gs.unlockLocation('shadowkeep'); gs.gainQuestItem('leo_package'); return "New Location Unlocked: Shadowkeep. Item gained: 'Package for Fixer'"; } },
                end: { text: "...", options: [], isEnd: true },
                end_acceptWork: { text: "Don't mess this up.", options: [], isEnd: true }
            }
        },
        docAnya: {
            name: "Doc Anya",
            dialogue: {
                start: { text: "Another one limping into my clinic. What's wrong with you? And don't waste my time.", options: [ { text: "I need healing. (-50 XP)", next: "healPlayer", condition: (gs) => gs.player.hp < 20 && gs.player.xp >= 50 }, { text: "Just looking at your setup. Impressive.", next: "flatter" }, { text: "Nothing. Bye.", next: "end" } ] },
                healPlayer: { text: "[Anya roughly patches you up with some foul-smelling salve. It stings, but it works.] There. Good as new. Now get out.", options: [{ text: "Thanks, I think.", next: "end" }], onEnter: (gs) => { gs.changeHealth(10); gs.changeXp(-50); return "Gained 10 HP. Lost 50 XP."; } },
                flatter: { text: "Save it. Compliments don't pay for supplies. Unless you have something to trade, stop staring.", options: [{ text: "Right.", next: "end" }] },
                end: { text: "Don't get shot.", options: [], isEnd: true }
            }
        },
        kidGizmo: {
            name: "Kid Gizmo",
            dialogue: {
                start: { text: "Whoa! A real adventurer! Did you see any cool tech out there? Like, a fusion core? Or a G.E.C.K.?", options: [ { text: "What's a G.E.C.K.?", next: "askGeck" }, { text: "Sorry kid, nothing that fancy.", next: "nothing" } ] },
                askGeck: { text: "A Garden of Eden Creation Kit! It can make a paradise anywhere! Old Man Pete says they're just stories, but I know they're real!", options: [{ text: "Keep dreaming, kid.", next: "end" }] },
                nothing: { text: "Aww, shucks. Well, keep your eyes peeled! You find anything shiny, you bring it to me, okay?", options: [{ text: "Will do.", next: "end" }] },
                end: { text: "See ya!", options: [], isEnd: true }
            }
        },
        // --- SHADOWKEEP CHARACTERS ---
        fixer: {
            name: "The Fixer",
            dialogue: {
                 start: { text: "You look new. You lost, or you looking for me?", options: [ { text: "[Give Package] A delivery from Leo.", next: "givePackage", condition: (gs) => gs.hasQuestItem('leo_package') }, { text: "Who are you?", next: "whoAreYou" } ] },
                whoAreYou: { text: "I'm the person people come to when they need things. And you, you need to either have business with me or get lost.", options: [{text: "I'll be back.", next: "end"}] },
                givePackage: { text: "Ah, Leo's delivery. Right on time. [He checks the contents.] Good. You've proven you can be discreet. Here's your payment.", options: [{text: "My pleasure.", next: "packageDelivered"}], onEnter: (gs) => { gs.loseQuestItem('leo_package'); gs.changeXp(400); gs.changeRep(-10); return "Gained 400 XP. Lost 10 Rep. Lost 'Package for Fixer'."; } },
                packageDelivered: { text: "Don Moroni could use someone reliable. He's the real power in this town. Find him in the back rooms if you want to climb the ladder.", options: [{text: "Thanks for the introduction.", next: "end"}], onEnter: (gs) => { return "You've gained access to Don Moroni."; } },
                end: { text: "Don't waste my time.", options: [], isEnd: true },
            }
        },
        donMoroni: {
            name: "Don Moroni",
            dialogue: {
                start: { text: "[The Don regards you from a large, ornate chair.] The Fixer sent you. He said you were... capable. I hope for your sake he's right. I need to send a message to a rival crew. A loud one.", options: [ { text: "I'm not a killer.", next: "refuseDon" }, { text: "[STR 6] I can be very loud.", next: "acceptDon" }, { text: "What kind of message?", next: "askDon" } ] },
                askDon: { text: "The kind that leaves no survivors. Sabotage their generator in the old warehouse district. Make it look like an accident.", options: [ { text: "I can handle that.", next: "acceptDon" }, { text: "This is too much for me.", next: "refuseDon" } ] },
                refuseDon: { text: "A shame. You have potential, but no stomach for the business. Get out. And don't come back to Shadowkeep.", options: [{ text: "...", next: "end" }], onEnter: (gs) => { return "You have been exiled from Shadowkeep."; } },
                acceptDon: { text: "[You carry out the Don's orders. The explosion is bigger than you expected, shaking the district. You get away clean, but the weight of your actions settles in your gut.]", options: [{ text: "It's done.", next: "completeDon" }], onEnter: (gs) => { gs.changeXp(1500); gs.changeRep(-50); return "Gained 1500 XP. Lost 50 Rep."; } },
                completeDon: { text: "Excellent. Very... loud. You are now a made member of my family. There will be more work. Much more. You've chosen your path, gangster.", options: [{ text: "I serve the family.", next: "end_gangster" }], },
                end: { text: "...", options: [], isEnd: true },
                end_gangster: { text: "Good.", options: [], isEnd: true },
            }
        },
        barkeepJones: {
            name: "Barkeep Jones",
            dialogue: {
                start: { text: "Welcome to The Hole. Name your poison. First one's on me... if you've got a story to tell.", options: [ { text: "[INT 5] Tell me a rumor.", next: "askRumor" }, { text: "Just a water.", next: "water" } ] },
                askRumor: { text: "Heh, a curious one. They say Don Moroni isn't the original Don. Says he... replaced the old one. Permanently. Just a rumor, of course.", options: [{ text: "Interesting. Keep the water.", next: "end" }], onEnter: (gs) => { return "You learned a dark rumor."; } },
                water: { text: "Suit yourself. Here you go. Try not to attract any attention.", options: [{ text: "Thanks.", next: "end" }] },
                end: { text: "Enjoy the ambiance.", options: [], isEnd: true }
            }
        },
        whispers: {
            name: "Whispers",
            dialogue: {
                start: { text: "[A figure in a hooded cloak sits in a dark corner. They beckon you closer.] You seek things. Lost things. I can help... for a price.", options: [ { text: "[LCK 6] You seem to know a lot.", next: "luckyFind" }, { text: "I'm not interested.", next: "end" } ] },
                luckyFind: { text: "Luck shines on you. I sense it. There's a hidden cache in Junktown, behind the old clinic. Something... valuable. A gift, for a fellow traveler.", options: [{ text: "Why are you telling me this?", next: "askWhy" }], onEnter: (gs) => { gs.setFlag('whispers_cache_revealed'); return "You learned about a hidden cache."; } },
                askWhy: { text: "Because chaos is a currency all its own. Now go.", options: [{ text: "...", next: "end" }] },
                end: { text: "[The figure recedes into the shadows.]", options: [], isEnd: true }
            }
        },
        gladiatorGrok: {
            name: "Gladiator Grok",
            dialogue: {
                start: { text: "[A mountain of muscle and scars grunts at you.] You here for the pit? Or just to stare?", options: [ { text: "[STR 7] I could take you.", next: "challenge" }, { text: "Just watching.", next: "end" } ] },
                challenge: { text: "Hah! You got fire! I like fire! But this is my arena. You want a fight, talk to the Don. He owns me.", options: [{ text: "I might just do that.", next: "end" }] },
                end: { text: "[Grok returns to sharpening a massive blade.]", options: [], isEnd: true }
            }
        },
        // --- OASIS & TITAN'S PEAK CHARACTERS ---
        zara: {
            name: "Zara the Hunter",
            dialogue: {
                start: { text: "You're a long way from any settlement. What brings you to this desolate peak?", options: [ { text: "I was told I might find you here. I seek the Oasis.", next: "seekOasis" }, { text: "[INT 6] I'm tracking the source of a strange radio signal.", next: "radioSignal" }, ] },
                seekOasis: { text: "The Oasis... a beautiful dream. It's real, but protected. The Elder knows the path. You'll find her there, if you can prove your worth. Help the weak, defend the innocent. She will notice.", options: [{ text: "So my reputation precedes me?", next: "repCheck" }], },
                radioSignal: { text: "Sharp ears. It's coming from that tower. An old hermit lives up there. Thinks he's talking to the stars. He's harmless, but... lonely.", options: [{ text: "A hermit? Interesting. Thanks.", next: "end" }], onEnter: (gs) => { return "You've learned about the Hermit."; } },
                repCheck: { text: "The wastes whisper about everyone, friend. Make sure they're whispering good things about you if you want to see the green of the Oasis. Go there now, prove your quality to the Elder.", options: [{ text: "I will.", next: "end" }], onEnter: (gs) => { gs.unlockLocation('oasis'); return "New Location Unlocked: The Oasis"; } },
                end: {text: "May your aim be true.", options: [], isEnd: true}
            }
        },
        elderWillow: {
            name: "Elder Willow",
            dialogue: {
                start: { text: "You have arrived. Your deeds, good and ill, are known to us. Why have you come to our home?", condition: (gs) => gs.player.rep >= 20, failText: { text: "You are not welcome here. Your heart is filled with darkness. Leave this sacred place.", options: [{ text: "...", next: "end" }] }, options: [ { text: "I came to protect this place. To help.", next: "offerHelpOasis" }, { text: "I seek knowledge.", next: "seekKnowledge" } ] },
                offerHelpOasis: { text: "A noble goal. A sickness is taking root in our water supply, a strange toxin. We suspect it's coming from the comms tower on Titan's Peak. A hermit there has been... experimenting. We need you to investigate and stop it.", options: [{ text: "I will see what this hermit is up to.", next: "acceptOasisQuest" }] },
                seekKnowledge: { text: "True knowledge comes from action. Our water is tainted by a toxin from Titan's Peak. A hermit's carelessness threatens us. Solve this, and we will share our wisdom.", options: [{ text: "I will handle it.", next: "acceptOasisQuest" }] },
                acceptOasisQuest: { text: "Go then. The fate of the Oasis is in your hands.", options: [{text: "For the Oasis!", next: "end" }], onEnter: (gs) => { gs.gainQuestItem('oasis_quest'); return "Quest Gained: Investigate Titan's Peak."; } },
                end: { text: "The spirits of the green watch you.", options: [], isEnd: true }
            }
        },
        hermit: {
             name: "The Hermit",
             dialogue: {
                 start: { text: "Go away! The signal... must be pure! No interruptions!", options: [ { text: "[Investigate] You're poisoning the Oasis water supply!", next: "confrontHermit", condition: (gs) => gs.hasQuestItem('oasis_quest') }, { text: "[LCK 7] Is that a genuine pre-war fusion core?!", next: "distractHermit" }, { text: "What signal?", next: "askSignal" } ] },
                 askSignal: { text: "The signal to THEM! The Star Watchers! They will save us all! My purifier helps boost the signal, but it leaks... a little. A small price for salvation!", options: [{ text: "[Investigate] That 'leak' is poison.", next: "confrontHermit", condition: (gs) => gs.hasQuestItem('oasis_quest') }] },
                 confrontHermit: { text: "Poison? No... no! The Watchers promised... But the plants outside my camp have been dying... Oh, what have I done?", options: [ { text: "[STR 7] I'm shutting this thing down, now.", next: "forceShutdown" }, { text: "[INT 7] Let me see. I might be able to re-route the coolant and stop the leak without killing your signal.", next: "fixPurifier" } ] },
                 distractHermit: { text: "What? Where?! [The Hermit frantically looks around for the non-existent core, giving you a chance to examine his machine.] You quickly spot the leaking valve contaminating the water runoff.", options: [{ text: "You're poisoning the Oasis!", next: "confrontHermit" }], onEnter: (gs) => { return "Your quick thinking gave you an opening."; } },
                 forceShutdown: { text: "[You muscle past the hermit and smash the delicate controls. The machine grinds to a halt, and the leak stops. The Hermit sobs in the corner.]", options: [{ text: "The threat is neutralized.", next: "completeHermitQuest" }], onEnter: (gs) => { gs.loseQuestItem('oasis_quest'); gs.changeXp(2000); gs.changeRep(30); return "Quest Complete. Gained 2000 XP & 30 Rep."; } },
                 fixPurifier: { text: "[You spend an hour rerouting pipes and patching the leak. The purifier hums back to life, signal intact, but the water runs clean.] Thank you... you saved them... and you saved me.", options: [{ text: "It's done. The Oasis is safe.", next: "completeHermitQuest_good" }], onEnter: (gs) => { gs.loseQuestItem('oasis_quest'); gs.changeXp(3000); gs.changeRep(60); return "Quest Complete. Gained 3000 XP & 60 Rep."; } },
                 completeHermitQuest: { text: "Go. Tell the Elder it is done. I... I have much to think about.", options: [{text: "...", next: "end"}], },
                  completeHermitQuest_good: { text: "You are a true hero. You have the mind of a scientist and the heart of a protector. The Oasis will sing your praises for generations. You have chosen your path, hero.", options: [{text: "Happy to help.", next: "end"}], },
                 end: { text: "...", options: [], isEnd: true }
             }
        },
        farmerStan: {
            name: "Farmer Stan",
            dialogue: {
                start: { text: "Careful where you step! These here are my prize-winning rad-tatoes. Another stranger in our midst. What do you want?", options: [ { text: "Just admiring your farm. It's... green.", next: "admire" }, { text: "Any troubles I can help with?", next: "offerHelp" } ] },
                admire: { text: "It is, ain't it? A miracle in this dusty hellscape. Thanks to the Elder.", options: [{ text: "Indeed.", next: "end" }] },
                offerHelp: { text: "Troubles? Always! Rad-rats been chewing on my crops. You kill five of 'em, I'll give you 100 XP.", options: [{ text: "[Accept] Consider it done.", next: "quest" }] },
                quest: { text: "Good on ya! [You spend some time hunting the oversized rodents.]", options: [{ text: "Done.", next: "reward" }], onEnter: (gs) => { gs.changeXp(100); return "Gained 100 XP."; } },
                reward: { text: "Much obliged! You're alright, for an outsider.", options: [{ text: "Happy to help.", next: "end" }] },
                end: { text: "Don't step on the tatoes.", options: [], isEnd: true }
            }
        },
        adeptKai: {
            name: "Adept Kai",
            dialogue: {
                start: { text: "[A young person in simple robes is meditating by a pond.] The water is calm, but the world is not. Your own spirit is a storm. What do you seek here?", options: [ { text: "[INT 6] I seek knowledge and balance.", next: "seekBalance" }, { text: "I'm just passing through.", next: "end" } ] },
                seekBalance: { text: "Balance is found not in stillness, but in action with purpose. The Hermit on Titan's Peak has lost his. Perhaps in helping him, you will find your own.", options: [{ text: "Wise words.", next: "end" }] },
                end: { text: "[Kai closes their eyes and returns to their meditation.]", options: [], isEnd: true }
            }
        },
        childOfAtom: {
            name: "Brother Atomic",
            dialogue: {
                start: { text: "Do you hear it, friend? The hum of the Great Atom, all around us. He has brought you to this sacred place. Have you come to accept his Glow?", options: [{ text: "What are you talking about?", next: "askGlow" }, { text: "I think you've had enough sun.", next: "rude" }] },
                askGlow: { text: "The Glow is His love! A cleansing fire that will burn away the sins of the old world and birth a new one in His image! The Hermit on the Peak, he hears the whispers too!", options: [{ text: "You're insane.", next: "end" }] },
                rude: { text: "The unenlightened mock what they cannot comprehend. May Atom have mercy on your soul.", options: [{ text: "...", next: "end" }], onEnter: (gs) => { gs.changeRep(-2); return "Reputation decreased."; } },
                end: { text: "Atom be with you.", options: [], isEnd: true }
            }
        },
        scavverMia: {
            name: "Scavver Mia",
            dialogue: {
                start: { text: "This is my claim! I saw it first! All the good salvage in this tower is mine!", options: [{ text: "I'm not here for salvage.", next: "notSalvage" }, { text: "[STR 6] Back off. It's mine now.", next: "intimidate" }] },
                notSalvage: { text: "Oh. Right. Well... watch your step. Lots of unstable stuff up here. The old Hermit at the top is the craziest part of it all.", options: [{ text: "Thanks for the warning.", next: "end" }] },
                intimidate: { text: "Whoa! Okay, okay, easy there! It's all yours! I'm leaving! [She scrambles away, dropping a small medkit.]", options: [{ text: "That's right.", next: "end" }], onEnter: (gs) => { gs.changeHealth(5); return "You found a medkit. Gained 5 HP."; } },
                end: { text: "...", options: [], isEnd: true }
            }
        },
        brokenSynth: {
            name: "Broken Synth",
            dialogue: {
                start: { text: "[A decommissioned android sits against a wall, one optic flickering.] Query: State... your... purpose.", options: [{ text: "[INT 7] Run diagnostic subroutine 77.", next: "diagnostic" }, { text: "Just looking around, tin can.", next: "end" }] },
                diagnostic: { text: "Running... Diagnostic... Core... Function... impaired... by... external... signal... Source... rooftop... Harmful... to... organic... life...", options: [{ text: "The hermit's signal is poison!", next: "end" }], onEnter: (gs) => { return "You've learned the signal is dangerous."; } },
                end: { text: "[The synth's optic flickers and dies.]", options: [], isEnd: true }
            }
        },
        prospectorJed: {
            name: "Prospector Jed",
            dialogue: {
                start: { text: "Dagnabbit! Another claim jumper! I'm here for the rare earth metals in this here tower's wiring! You best move on!", options: [{ text: "I'm not after your metals.", next: "notMetals" }] },
                notMetals: { text: "Hmph. See that you ain't. The crazy coot at the top of this tower keeps talkin' about 'star watchers'. More like 'static watchers' if ya ask me.", options: [{ text: "Good luck with your prospecting.", next: "end" }] },
                end: { text: "...", options: [], isEnd: true }
            }
        },
        windWorshipper: {
            name: "Wind Worshipper",
            dialogue: {
                start: { text: "[A person in ragged clothes stands at the edge of a precipice, arms outstretched.] Can you feel it? The voice of the sky! It sings of the before-times and the after-times!", options: [{ text: "Are you okay?", next: "end" }] },
                end: { text: "The sky is my answer!", options: [], isEnd: true }
            }
        },
        foremanGriggs: {
            name: "Foreman Griggs",
            dialogue: {
                start: { text: "This is my yard. Everything that rusts here is mine. State your business before you become part of the scrap.", options: [{text: "I'm looking for a hydro-actuator.", next: "askActuator"}, {text: "Just looking around.", next: "end"}]}
            }
        },
        scavverJinx: {
            name: "Scavver Jinx",
            dialogue: {
                start: { text: "You look lost. This ain't a place for tourists. What do you want?", options: [{text: "Are you Jinx? Leo sent me.", next: "leoSent"}]}
            }
        },
        madMick: { name: "Mad Mick", dialogue: { start: { text: "IT LIVES! My beautiful creation LIVES!", options: [{text: "...", next: "end"}]} } },
        theIrradiated: { name: "The Irradiated", dialogue: { start: { text: "[A cloaked figure coughs, a faint green glow emanating from beneath their hood.]", options: [{text: "Are you okay?", next: "end"}]} } },
        chiefValerius: {
            name: "Chief Valerius",
            dialogue: {
                start: { text: "Your presence in Aethelburg is noted... and tolerated. For now. Do not cause any disturbances.", options: [{text: "[REP 20] I'm an asset, not a liability.", next: "repCheck"}, {text: "I understand.", next: "end"}]}
            }
        },
        drAris: {
            name: "Dr. Aris",
            dialogue: {
                start: { text: "[The scientist looks over his shoulder nervously.] You shouldn't be in this sector. Who are you?", options: [{text: "A concerned citizen.", next: "concerned"}]}
            }
        },
        ambassadorKael: { name: "Ambassador Kael", dialogue: { start: { text: "Ah, a new face from the lower sectors. How... quaint.", options: [{text: "...", next: "end"}]} } },
        conciergeUnit: { name: "Concierge Unit 7", dialogue: { start: { text: "Welcome to Aethelburg. How may I facilitate your corporate experience today?", options: [{text: "Log out.", next: "end"}]} } },
    }
};