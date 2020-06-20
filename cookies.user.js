// ==UserScript==
// @name         Cookies
// @namespace    https://jaha1.mbnet.fi
// @version      1.0.0
// @description  Making life little less painful!
// @author       Jani Haiko
// @match        *://orteil.dashnet.org/cookieclicker/beta/
// @grant        none
// @iconURL      https://orteil.dashnet.org/cookieclicker/beta/img/favicon.ico
// @updateURL    TODO
// @downloadURL  TODO
// @run-at       document-idle
// @noframes
// ==/UserScript==

"use strict";
(function() {
    const TRY_TO_FIND_SHINY_WRINKLERS = true;

    let keydown = false;
    let interval, interval2, interval4, interval5;
    let M;
    let noBadCookies = false;

    const init = () => {
        if (Game
            && Game.ready
            && Game.ClickCookie
            && Array.isArray(Game.shimmers)
            && Game.ObjectsById
            && Game.ObjectsById[7].minigame
            && Game.hasBuff
            && Game.LoadMod
            && Game.wrinklers
            && Game.cookies
            && Game.Notify
            && Game.tickerL
            && typeof(Game.TickerEffect) !== "undefined") {
            clearInterval(initInterval);
            Game.LoadMod("https://hamusutaa.net/cookie-garden-progress/main.js");
            Game.LoadMod("https://rawgit.com/yannprada/cookie-garden-helper/master/cookie-garden-helper.js");
            M = Game.ObjectsById[7].minigame;

            document.addEventListener("keydown", (e) => {
                if (!keydown && e.code === "Insert") {
                    keydown = true;
                    if (interval || interval2 || interval4 || interval5) {
                        clearInterval(interval);
                        clearInterval(interval2);
                        clearInterval(interval4);
                        clearInterval(interval5);
                        interval = null;
                        interval2 = null;
                        interval4 = null;
                        interval5 = null;
                    }
                    else {
                        interval = setInterval(() => {
                            Game.ClickCookie();
                        }, 200);

                        interval2 = setInterval(() => {
                            let goldenCookieClicked = false;
                            Game.shimmers.forEach((shimmer) => {
                                if (shimmer.type === "reindeer" || (shimmer.type === "golden" && (shimmer.wrath === 0 || !noBadCookies))) {
                                    if (shimmer.type === "golden") {
                                        goldenCookieClicked = true;
                                    }
                                    shimmer.pop();
                                }
                            });

                            if (goldenCookieClicked && M.magic === M.magicM && ((Game.season !== "halloween" && Game.season !== "easter") || Math.random() < 0.25)) {
                                if (areWeAlmostAtFourHundred() && Game.cookies * 2 >= Game.ObjectsById[Game.ObjectsById.length - 1].price) {
                                   M.castSpell(M.spells["spontaneous edifice"]);
                                }
                                else if (!Game.hasBuff("Clot")) {
                                    M.castSpell(M.spells["hand of fate"]);
                                    noBadCookies = true;
                                    setTimeout(() => {
                                        noBadCookies = false;
                                    }, 60000);
                                }
                            }
                        }, 1500);

                        interval4 = setInterval(() => {
                            if (TRY_TO_FIND_SHINY_WRINKLERS || Game.season === "halloween" || Game.season === "easter") {
                                Game.wrinklers.forEach((wrinkler) => {
                                    if (wrinkler.sucked > 0 && wrinkler.type === 0) {
                                        wrinkler.hp = 0;
                                    }
                                });

                                if (M.magic === M.magicM) {
                                    M.castSpell(M.spells["resurrect abomination"]);
                                }
                            }

                            if (Date.now() - Game.lumpT > Game.lumpRipeAge) {
                                Game.clickLump();
                            }
                        }, 30000);

                        interval5 = setInterval(() => {
                            if (Game.TickerEffect) {
                                const tickerElement = Game.tickerL;
                                const event = document.createEvent("Events");
                                event.initEvent("click", true, false);
                                tickerElement.dispatchEvent(event);
                            }
                        }, 2500);
                    }

                    setTimeout(() => {
                        keydown = false;
                    }, 1000);
                }
                else if (e.code === "End") {
                    const prestigePrintArea = document.getElementById("storeTitle");
                    setInterval(() => {
                        prestigePrintArea.innerHTML = Beautify(Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)));
                    });
                }
            });
        }
    };

    const areWeAlmostAtFourHundred = () => {
        const amountOfLastBuilding = Game.ObjectsById[Game.ObjectsById.length - 1].amount;
        if(amountOfLastBuilding >= 400 || amountOfLastBuilding < 370){
           return false;
        }
        else{
            let result = true;
            Game.ObjectsById.forEach((o) => {
                if (o.amount < 400 && o.name !== "Javascript console") {
                    Game.Notify(`${object.name,object.amount}!!!`);
                    result = false;
                }
            });
            return result;
        }
    };
    
    const initInterval = setInterval(init, 500);
})();