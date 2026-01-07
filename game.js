document.addEventListener('DOMContentLoaded', () => {

    // --- GAME STATE MANAGER ---
    const gameState = {
        player: { hp: 20, xp: 0, rep: 0, attributes: { str: 1, int: 1, lck: 1 }, questItems: [] },
        flags: {}, // Added for state tracking like 'whispers_cache_revealed'
        currentLocation: null,
        unlockedLocations: ['junktown'],
        log: [],

        init() {
            this.loadState();
            if (this.isNewGame()) {
                ui.renderAttributeSetup();
            } else {
                this.startGame();
            }
        },

        isNewGame() {
            return this.player.attributes.str === 1 && this.player.attributes.int === 1 && this.player.attributes.lck === 1 && this.player.xp === 0;
        },
        
        setFlag(flag) { this.flags[flag] = true; },
        hasFlag(flag) { return !!this.flags[flag]; },

        setAttributes(str, int, lck) {
            this.player.attributes = { str, int, lck };
            this.addLog(`Attributes set: STR ${str}, INT ${int}, LCK ${lck}.`);
            this.startGame();
        },

        startGame() {
            ui.updateAllStats(this.player);
            ui.renderLocationMenu();
        },

        changeHealth(amount) {
            this.player.hp += amount;
            if (this.player.hp > 20) this.player.hp = 20;
            if (this.player.hp <= 0) {
                this.player.hp = 0;
                this.gameOver("Health depleted.");
            }
            ui.updateHealth(this.player.hp);
        },

        changeXp(amount) {
            if (this.player.xp + amount < 0) return; // Can't spend XP you don't have
            this.player.xp += amount;
            if (this.player.xp >= 10000) {
                this.player.xp = 10000;
                this.gameOver("Experience cap reached. You have become a legend of the wastes.");
            }
            ui.updateXp(this.player.xp);
        },

        changeRep(amount) { this.player.rep += amount; ui.updateRep(this.player.rep); },
        unlockLocation(locationId) { if (!this.unlockedLocations.includes(locationId)) { this.unlockedLocations.push(locationId); this.saveState(); return true; } return false; },
        gainQuestItem(itemId) { if (!this.player.questItems.includes(itemId)) { this.player.questItems.push(itemId); this.saveState(); } },
        hasQuestItem(itemId) { return this.player.questItems.includes(itemId); },
        loseQuestItem(itemId) { const index = this.player.questItems.indexOf(itemId); if (index > -1) { this.player.questItems.splice(index, 1); this.saveState(); } },
        addLog(message) { if (!message) return; this.log.unshift(message); if (this.log.length > 50) this.log.pop(); ui.updateLog(this.log); this.saveState(); },

        saveState() {
            const stateToSave = { player: this.player, unlockedLocations: this.unlockedLocations, log: this.log, flags: this.flags };
            localStorage.setItem('wastelandEchoesSave', JSON.stringify(stateToSave));
        },

        loadState() {
            const savedState = localStorage.getItem('wastelandEchoesSave');
            if (savedState) {
                const loaded = JSON.parse(savedState);
                this.player = loaded.player;
                this.unlockedLocations = loaded.unlockedLocations;
                this.log = loaded.log || [];
                this.flags = loaded.flags || {};
                ui.updateLog(this.log);
            }
        },

        exportStateToFile() {
            const stateToSave = JSON.stringify({
                 player: this.player,
                 unlockedLocations: this.unlockedLocations,
                 log: this.log
            }, null, 2);
            const blob = new Blob([stateToSave], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wasteland-echoes-save.json';
            a.click();
            URL.revokeObjectURL(url);
            this.addLog("Game state saved to file.");
        },
        importStateFromFile(file) {
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const loadedState = JSON.parse(e.target.result);
                        if (loadedState.player && loadedState.unlockedLocations) {
                            this.player = loadedState.player;
                            this.unlockedLocations = loadedState.unlockedLocations;
                            this.log = loadedState.log || [];
                            this.saveState();
                            this.addLog("Game state loaded from file.");
                            // Force a full re-render
                            this.startGame();
                        } else {
                            throw new Error("Invalid save file format.");
                        }
                    } catch (error) {
                        alert("Failed to load save file. It might be corrupted or in the wrong format.");
                        console.error(error);
                    }
                };
                reader.readAsText(file);
            }
        },
        gameOver(reason) {
            ui.renderGameOver(reason);
            localStorage.removeItem('wastelandEchoesSave');
        }
    };

    // --- UI MANAGER ---
    const ui = {
        gameView: document.getElementById('game-view'),
        logPanel: document.getElementById('log-panel'),
        hpEl: document.getElementById('player-hp'),
        xpEl: document.getElementById('player-xp'),
        repEl: document.getElementById('player-rep'),
        strEl: document.getElementById('player-str'),
        intEl: document.getElementById('player-int'),
        lckEl: document.getElementById('player-lck'),

        updateHealth: (val) => { ui.hpEl.textContent = val; },
        updateXp: (val) => { ui.xpEl.textContent = val; },
        updateRep: (val) => { ui.repEl.textContent = val; },
        updateAttributes: (attrs) => { ui.strEl.textContent = attrs.str; ui.intEl.textContent = attrs.int; ui.lckEl.textContent = attrs.lck; },
        updateAllStats: (player) => { ui.updateHealth(player.hp); ui.updateXp(player.xp); ui.updateRep(player.rep); ui.updateAttributes(player.attributes); },
        updateLog(log) { this.logPanel.innerHTML = log.map(entry => `<p>> ${entry}</p>`).join(''); },

        renderAttributeSetup() {
            let points = 12 - 3;
            let tempAttrs = { str: 1, int: 1, lck: 1 };

            const updateUI = () => {
                this.gameView.innerHTML = `
                    <div id="attribute-setup">
                        <h2>CHARACTER CREATION</h2>
                        <p>Use UP/DOWN arrows to select, LEFT/RIGHT to change values.</p>
                        <p>Points remaining: <span id="points-left">${points}</span></p>
                        <div class="attribute-line" data-attr="str"><span>STRENGTH:</span><span class="attr-value">&lt; ${tempAttrs.str} &gt;</span></div>
                        <div class="attribute-line" data-attr="int"><span>INTELLIGENCE:</span><span class="attr-value">&lt; ${tempAttrs.int} &gt;</span></div>
                        <div class="attribute-line" data-attr="lck"><span>LUCK:</span><span class="attr-value">&lt; ${tempAttrs.lck} &gt;</span></div>
                        <div class="confirm-button" data-attr="confirm"><span>[ Confirm Attributes ]</span></div>
                    </div>`;
                inputHandler.activateMenu('attribute-setup');
            };

            window.adjustAttribute = (attr, delta) => {
                if (delta > 0 && points > 0) { tempAttrs[attr]++; points--; }
                else if (delta < 0 && tempAttrs[attr] > 1) { tempAttrs[attr]--; points++; }
                updateUI();
            };

            window.confirmAttributes = () => {
                if (points === 0) {
                    gameState.setAttributes(tempAttrs.str, tempAttrs.int, tempAttrs.lck);
                    delete window.adjustAttribute;
                    delete window.confirmAttributes;
                } else { alert("You must spend all 12 points."); }
            };
            
            updateUI();
        },

        renderLocationMenu() {
            gameState.currentLocation = null;
            let listItems = gameState.unlockedLocations.map(locId => {
                const loc = gameData.locations[locId];
                return `<li data-action="travel" data-location-id="${locId}">${loc.name}</li>`;
            }).join('');

            this.gameView.innerHTML = `
                <h2>TRAVEL</h2>
                <ul class="menu-list" id="location-menu">
                    ${listItems}
                </ul>`;

            inputHandler.activateMenu('location-menu');
        },
        renderCharacterMenu(locationId) { 
            gameState.currentLocation = locationId;
            const location = gameData.locations[locationId];
            let listItems = location.characters.map(charId => {
                const character = gameData.characters[charId];
                return `<li data-action="talk" data-character-id="${charId}">${character.name}</li>`;
            }).join('');

            this.gameView.innerHTML = `
                <h2>${location.name.toUpperCase()}</h2>
                <p>${location.description}</p>
                <ul class="menu-list" id="character-menu">
                    ${listItems}
                    <li data-action="leave">Travel to another location</li>
                </ul>`;
            
            inputHandler.activateMenu('character-menu');
        },
        renderDialogue(characterId, dialogueId) {
            const character = gameData.characters[characterId];
            let dialogueNode = character.dialogue[dialogueId];

            // Check for conditional failure
            if (dialogueNode.condition && !dialogueNode.condition(gameState)) {
                dialogueNode = dialogueNode.failText;
            }

            // Execute onEnter script
            if (dialogueNode.onEnter) {
                const logMessage = dialogueNode.onEnter(gameState);
                gameState.addLog(logMessage);
                ui.updateAllStats(gameState.player); // Refresh stats in case they changed
            }

            if (dialogueNode.isEnd) {
                ui.renderCharacterMenu(gameState.currentLocation);
                return;
            }

            let optionsHtml = dialogueNode.options.map((opt, index) => {
                 // Check if option condition is met
                if (opt.condition && !opt.condition(gameState)) {
                    return `<li class="disabled-option" data-next="${opt.next}">${opt.text} (Unavailable)</li>`;
                }

                // Check attribute requirements
                const req = opt.text.match(/\[(STR|INT|LCK|REP) (\d+)\]/);
                if (req) {
                    const attr = req[1].toLowerCase();
                    const val = parseInt(req[2]);
                    const playerVal = attr === 'rep' ? gameState.player.rep : gameState.player.attributes[attr];
                    if (playerVal < val) {
                        return `<li class="disabled-option" data-next="${opt.next}">${opt.text} (Requires ${req[1]} ${val})</li>`;
                    }
                }
                return `<li data-action="dialogue" data-character-id="${characterId}" data-next="${opt.next}">${opt.text}</li>`;
            }).join('');

            this.gameView.innerHTML = `
                <h2>${character.name}</h2>
                <div class="dialogue-message">
                    <p>"${dialogueNode.text}"</p>
                </div>
                <ul class="dialogue-options" id="dialogue-menu">
                    ${optionsHtml}
                </ul>`;
            
            inputHandler.activateMenu('dialogue-menu');
        },
        renderGameOver(reason) {
            this.gameView.innerHTML = `
                <h2>GAME OVER</h2>
                <p>${reason}</p>
                <p>The wasteland has claimed another soul.</p>
                <p>Refresh the page to start a new life.</p>`;
            inputHandler.deactivate(); // Stop listening to keys
        }
    };

    // --- INPUT HANDLER ---
    const inputHandler = {
        activeMenuId: null, selectedIndex: 0, active: false,

        activateMenu(menuId) {
            this.activeMenuId = menuId;
            this.selectedIndex = 0;
            const menu = document.getElementById(this.activeMenuId);
            if(menu && menu.children.length > 0) {
                // Find first non-disabled item
                while(this.selectedIndex < menu.children.length && menu.children[this.selectedIndex].classList.contains('disabled-option')) {
                    this.selectedIndex++;
                }
                // If all are disabled, don't select anything
                if (this.selectedIndex < menu.children.length) {
                    menu.children[this.selectedIndex].classList.add('selected');
                } else {
                    this.selectedIndex = -1; // No selectable item
                }
            }
            this.active = true;
        },
        deactivate() { this.active = false; },

        handleKeydown(e) {
            if (!this.active || !this.activeMenuId) return;
            const menu = document.getElementById(this.activeMenuId);
            if (!menu || this.selectedIndex === -1) return;
            e.preventDefault();

            if (this.activeMenuId === 'attribute-setup') {
                const items = Array.from(menu.querySelectorAll('.attribute-line, .confirm-button'));
                items[this.selectedIndex].classList.remove('selected');

                if (e.key === 'ArrowUp') { this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length; }
                else if (e.key === 'ArrowDown') { this.selectedIndex = (this.selectedIndex + 1) % items.length; }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    const attr = items[this.selectedIndex].dataset.attr;
                    if (attr !== 'confirm' && window.adjustAttribute) { window.adjustAttribute(attr, e.key === 'ArrowRight' ? 1 : -1); }
                } else if (e.key === 'Enter') {
                     if (items[this.selectedIndex].dataset.attr === 'confirm' && window.confirmAttributes) { window.confirmAttributes(); }
                }
                const newItems = Array.from(document.querySelectorAll('#attribute-setup .attribute-line, .confirm-button'));
                if (newItems[this.selectedIndex]) newItems[this.selectedIndex].classList.add('selected');
                return;
            }

            const items = menu.children;
            items[this.selectedIndex].classList.remove('selected');
            let nextIndex = this.selectedIndex;
            if (e.key === 'ArrowUp') { do { nextIndex = (nextIndex - 1 + items.length) % items.length; } while (items[nextIndex].classList.contains('disabled-option') && nextIndex !== this.selectedIndex); }
            else if (e.key === 'ArrowDown') { do { nextIndex = (nextIndex + 1) % items.length; } while (items[nextIndex].classList.contains('disabled-option') && nextIndex !== this.selectedIndex); }
            else if (e.key === 'Enter') { this.selectOption(items[this.selectedIndex]); return; }
            if (!items[nextIndex].classList.contains('disabled-option')) { this.selectedIndex = nextIndex; }
            items[this.selectedIndex].classList.add('selected');
        },

        selectOption(selectedElement) {
            const action = selectedElement.dataset.action;
            if (action === 'travel') {
                const locationId = selectedElement.dataset.locationId;
                gameState.addLog(`Traveled to ${gameData.locations[locationId].name}.`);
                ui.renderCharacterMenu(locationId);
            } else if (action === 'leave') {
                 gameState.addLog(`Leaving ${gameData.locations[gameState.currentLocation].name}.`);
                ui.renderLocationMenu();
            } else if (action === 'talk') {
                const charId = selectedElement.dataset.characterId;
                 gameState.addLog(`Started conversation with ${gameData.characters[charId].name}.`);
                ui.renderDialogue(charId, 'start');
            } else if (action === 'dialogue') {
                const charId = selectedElement.dataset.characterId;
                const nextId = selectedElement.dataset.next;
                ui.renderDialogue(charId, nextId);
            }
        }
    };
    
    // --- EVENT LISTENERS & INITIALIZATION ---
    document.addEventListener('keydown', inputHandler.handleKeydown.bind(inputHandler));
    document.getElementById('save-button').addEventListener('click', () => gameState.exportStateToFile());
    document.getElementById('load-file').addEventListener('change', (e) => { gameState.importStateFromFile(e.target.files[0]); e.target.value = ''; });
    document.getElementById('restart-button').addEventListener('click', () => {
        if (confirm("Are you sure you want to restart? All unsaved progress will be lost.")) {
            localStorage.removeItem('wastelandEchoesSave');
            location.reload();
        }
    });
    
    gameState.init();
});