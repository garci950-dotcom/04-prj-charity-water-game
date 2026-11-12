(function () {
  "use strict";

  const MAX_DAYS = 7;
  const MAX_HOURS = 3;
  const MAX_BUDGET_DISPLAY = 20;
  const STORAGE_KEY = "campus-water-week-save-v1";

  const actions = [
    { id: "peer-push", title: "Peer-to-peer push", description: "Give friends a simple way to bring friends.", type: "community", tag: "community", hours: 1, budget: 0, reach: 3, signups: 2, trust: 1, icon: "people" },
    { id: "dorm-challenge", title: "Dorm-floor challenge", description: "Turn a hallway rivalry into a good cause.", type: "community", tag: "community", hours: 1, budget: 1, reach: 3, signups: 4, trust: 1, icon: "spark" },
    { id: "club-collab", title: "Club collab", description: "Team up with a group that already has a crowd.", type: "community", tag: "clubs", hours: 2, budget: 1, reach: 4, signups: 4, trust: 2, icon: "people" },
    { id: "teach-in", title: "Five-minute teach-in", description: "Make space for a clear, thoughtful conversation.", type: "education", tag: "education", hours: 2, budget: 1, reach: 3, signups: 2, trust: 5, icon: "book" },
    { id: "campus-paper", title: "Campus paper pitch", description: "Put the clean-water story in student hands.", type: "media", tag: "media", hours: 1, budget: 0, reach: 6, signups: 1, trust: 2, icon: "paper" },
    { id: "quad-tabling", title: "Quad-side tabling", description: "Meet students where their day already takes them.", type: "community", tag: "outdoor", hours: 2, budget: 1, reach: 5, signups: 2, trust: 1, icon: "table" },
    { id: "match-drive", title: "Match drive", description: "Invite alumni to match the campus effort.", type: "fundraising", tag: "fundraising", hours: 2, budget: 0, reach: 2, signups: 3, trust: 2, budgetGain: 4, icon: "coin" },
    { id: "qr-trail", title: "QR-code trail", description: "Leave a trail of quick ways to get involved.", type: "media", tag: "media", hours: 1, budget: 1, reach: 4, signups: 2, trust: 1, icon: "qr" },
    { id: "faculty-ally", title: "Find a faculty ally", description: "Build a bridge to a trusted voice on campus.", type: "education", tag: "education", hours: 2, budget: 2, reach: 2, signups: 3, trust: 5, icon: "star" },
    { id: "pop-up", title: "Pop-up water bar", description: "Offer a refill and a reason to stop and talk.", type: "community", tag: "outdoor", hours: 2, budget: 2, reach: 7, signups: 2, trust: 2, icon: "drop" },
    { id: "story-reel", title: "Student story reel", description: "Share why your campus crew chose to show up.", type: "media", tag: "media", hours: 1, budget: 1, reach: 5, signups: 2, trust: 3, icon: "camera" },
    { id: "volunteer-huddle", title: "Volunteer huddle", description: "Give your crew a clear plan and a shared voice.", type: "community", tag: "community", hours: 1, budget: 0, reach: 1, signups: 3, trust: 4, icon: "spark" },
    { id: "viral-challenge", title: "Go-viral challenge", description: "Launch a bold campus challenge and hope it catches on.", type: "media", tag: "media", hours: 2, budget: 2, reach: 12, signups: 7, trust: 3, icon: "spark", risk: { chance: 0.4, failure: { trust: 3, budget: 2 } } },
    { id: "flash-mob", title: "Flash-mob fundraiser", description: "Make a huge scene to pull in a crowd and quick gifts.", type: "fundraising", tag: "outdoor", hours: 2, budget: 2, reach: 11, signups: 4, trust: 2, budgetGain: 4, icon: "coin", risk: { chance: 0.35, failure: { reach: 4, trust: 3, budget: 2 } } },
    { id: "big-name-endorsement", title: "Big-name endorsement", description: "Ask a popular student creator to make a public appeal.", type: "community", tag: "community", hours: 2, budget: 1, reach: 9, signups: 4, trust: 5, icon: "star", risk: { chance: 0.45, failure: { signups: 3, trust: 5 } } }
  ];

  const events = [
    { title: "Welcome Week is buzzing", description: "Students are looking for their people. Make it easy to join in.", effect: "+ sign-ups for club actions", tag: "clubs", bonus: { signups: 2 }, color: "yellow" },
    { title: "The campus paper wants a story", description: "A student editor is looking for a fresh angle.", effect: "+ reach for media actions", tag: "media", bonus: { reach: 3 }, color: "blue" },
    { title: "The quad is packed", description: "Good weather has brought everyone outside between classes.", effect: "+ reach for outdoor actions", tag: "outdoor", bonus: { reach: 3 }, color: "green" },
    { title: "Student org fair today", description: "Clubs are comparing notes and looking for good collaborators.", effect: "+ trust for club actions", tag: "clubs", bonus: { trust: 2 }, color: "coral" },
    { title: "A generous alum steps in", description: "A matching gift is available to help your campaign stretch.", effect: "+ 2 campaign budget", tag: "any", budgetBonus: 2, color: "yellow" },
    { title: "Midterms are around the corner", description: "Attention is scarce. Keep your ask clear and low-friction.", effect: "+ sign-ups for quick actions", tag: "quick", bonus: { signups: 2 }, color: "blue" },
    { title: "Your club network is growing", description: "A few early supporters are ready to bring their circles in.", effect: "+ reach for community actions", tag: "community", bonus: { reach: 2 }, color: "green" },
    { title: "A professor offers the mic", description: "There is room for a short, thoughtful announcement in class.", effect: "+ trust for education actions", tag: "education", bonus: { trust: 2 }, color: "coral" }
  ];

  const unlocks = [
    { id: "connector", title: "Campus Connector", description: "+1 sign-up at the start", threshold: 100 },
    { id: "seed-fund", title: "Seed Fund", description: "+2 starting budget", threshold: 220 }
  ];

  const icons = {
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    paper: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    table: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18M5 8v12m14-12v12M3 20h18M6 4h12l3 4H3l3-4Z"/></svg>',
    coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.7-.6-1.7-1-3-1-1.7 0-3 .8-3 2s1.2 1.8 3 2 3 .8 3 2-1.3 2-3 2c-1.2 0-2.3-.4-3-1m3-9v11"/></svg>',
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14v2m2 2v3h-4m-3 0v-2m5-3h2"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>',
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z"/><path d="M9 16a3 3 0 0 0 3 3"/></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h-4l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-4l-2-3Z"/><circle cx="12" cy="14" r="3"/></svg>'
  };

  const dom = {
    dayHeading: document.getElementById("day-heading"),
    dayTrack: document.getElementById("day-track"),
    weekStatus: document.getElementById("week-status"),
    eventTitle: document.getElementById("event-title"),
    eventDescription: document.getElementById("event-description"),
    eventEffect: document.getElementById("event-effect"),
    eventTag: document.getElementById("event-tag"),
    actionGrid: document.getElementById("action-grid"),
    commitButton: document.getElementById("commit-button"),
    commitLabel: document.getElementById("commit-label"),
    turnHint: document.getElementById("turn-hint"),
    score: document.getElementById("score-number"),
    reach: document.getElementById("reach-value"),
    signups: document.getElementById("signups-value"),
    trust: document.getElementById("trust-value"),
    hours: document.getElementById("hours-value"),
    budget: document.getElementById("budget-value"),
    hoursMeter: document.getElementById("hours-meter"),
    budgetMeter: document.getElementById("budget-meter"),
    resourceDay: document.getElementById("resource-day"),
    bestScore: document.getElementById("best-score"),
    unlockRow: document.getElementById("unlock-row"),
    campaignNumber: document.getElementById("campaign-number"),
    toast: document.getElementById("toast"),
    resultModal: document.getElementById("result-modal"),
    resultCopy: document.getElementById("result-copy"),
    finalScore: document.getElementById("final-score"),
    resultStats: document.getElementById("result-stats")
  };

  let save = readSave();
  let campaignCount = save.campaignCount + 1;
  let state;
  let toastTimer;

  function readSave() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        bestScore: Number.isFinite(stored?.bestScore) ? stored.bestScore : 0,
        campaignCount: Number.isFinite(stored?.campaignCount) ? stored.campaignCount : 0
      };
    } catch {
      return { bestScore: 0, campaignCount: 0 };
    }
  }

  function persistSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      showToast("Browser storage is unavailable; this run will not be saved.");
    }
  }

  function shuffled(list) {
    const result = [...list];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function unlocked(id) {
    const perk = unlocks.find((item) => item.id === id);
    return perk !== undefined && save.bestScore >= perk.threshold;
  }

  function newCampaign() {
    const connectorBonus = unlocked("connector") ? 1 : 0;
    const seedFundBonus = unlocked("seed-fund") ? 2 : 0;
    const dailyEvents = shuffled(events).slice(0, MAX_DAYS);
    state = {
      day: 1,
      hours: MAX_HOURS,
      budget: 8 + seedFundBonus,
      reach: 0,
      signups: connectorBonus,
      trust: 0,
      score: 0,
      selected: null,
      currentEvent: dailyEvents[0],
      dailyEvents,
      dayActions: [],
      completed: false
    };
    if (connectorBonus) state.score = 8;
    buildDailyActions();
    campaignCount = Math.max(campaignCount, save.campaignCount + 1);
    render();
    closeResults();
    showToast(connectorBonus || seedFundBonus ? "Your past campaigns earned a starting perk." : "Your new campaign is ready. Pick today's move.");
  }

  function buildDailyActions() {
    const quickAction = actions.find((action) => action.id === "peer-push");
    const riskyActions = actions.filter((action) => action.risk);
    const riskyAction = shuffled(riskyActions)[0];
    const choices = shuffled(actions.filter((action) => action.id !== quickAction.id && action.id !== riskyAction.id)).slice(0, 1);
    state.dayActions = shuffled([quickAction, riskyAction, ...choices]);
    state.selected = null;
  }

  function getCosts(action) {
    return { hours: action.hours, budget: action.budget };
  }

  function canAfford(action) {
    const cost = getCosts(action);
    return state.hours >= cost.hours && state.budget >= cost.budget;
  }

  function actionGains(action) {
    const gains = { reach: action.reach, signups: action.signups, trust: action.trust, budget: action.budgetGain || 0 };
    const event = state.currentEvent;
    if (event.tag === action.tag || (event.tag === "quick" && action.hours === 1)) {
      Object.entries(event.bonus || {}).forEach(([key, value]) => { gains[key] += value; });
    }
    return gains;
  }

  function renderDayTrack() {
    dom.dayTrack.innerHTML = Array.from({ length: MAX_DAYS }, (_, index) => {
      const day = index + 1;
      const status = day < state.day || state.completed ? "done" : day === state.day ? "active" : "";
      return `<li class="day-step ${status}" aria-current="${day === state.day && !state.completed ? "step" : "false"}"><span class="day-number">${day < state.day || state.completed ? "✓" : day}</span><span>DAY ${day}</span></li>`;
    }).join("");
  }

  function renderActions() {
    dom.actionGrid.innerHTML = state.dayActions.map((action) => {
      const selected = state.selected === action.id;
      const affordable = canAfford(action) && !state.completed;
      const gains = actionGains(action);
      return `<button class="action-card type-${action.type} ${selected ? "selected" : ""}" type="button" data-action="${action.id}" aria-pressed="${selected}" ${affordable ? "" : "disabled"}>
        <span class="card-top"><span class="card-symbol">${icons[action.icon]}</span><span class="card-cost"><span><i class="cost-dot"></i>${action.hours} HR</span><span><i class="cost-dot budget-dot"></i>${action.budget} BUD</span></span></span>
        <span class="card-title">${action.title}</span><span class="card-description">${action.description}</span>
        <span class="card-gains">${action.risk ? '<span class="card-gains-label">IF IT WORKS</span>' : ""}<span><b class="gain-mark">↗</b>${gains.reach} reach</span><span><b class="gain-mark">+</b>${gains.signups} sign-ups</span><span><b class="gain-mark">✓</b>${gains.trust} trust</span></span>
        ${action.risk ? `<span class="card-risk">${Math.round(action.risk.chance * 100)}% chance to backfire: lose up to ${formatRiskLosses(action.risk.failure)}</span>` : ""}
      </button>`;
    }).join("");
    dom.actionGrid.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => selectAction(button.dataset.action));
    });
  }

  function renderEvent() {
    dom.eventTitle.textContent = state.currentEvent.title;
    dom.eventDescription.textContent = state.currentEvent.description;
    dom.eventEffect.textContent = state.currentEvent.effect;
    dom.eventTag.textContent = `DAY ${state.day}`;
    dom.eventTag.parentElement.parentElement.className = `briefing-row event-${state.currentEvent.color}`;
  }

  function renderStats() {
    dom.score.textContent = String(state.score).padStart(3, "0");
    dom.reach.textContent = state.reach;
    dom.signups.textContent = state.signups;
    dom.trust.textContent = state.trust;
    dom.hours.textContent = state.hours;
    dom.budget.textContent = state.budget;
    dom.hoursMeter.style.width = `${(state.hours / MAX_HOURS) * 100}%`;
    dom.budgetMeter.style.width = `${Math.min((state.budget / MAX_BUDGET_DISPLAY) * 100, 100)}%`;
    dom.resourceDay.textContent = state.completed ? "COMPLETE" : `DAY ${state.day}`;
    dom.bestScore.textContent = save.bestScore;
    dom.campaignNumber.textContent = `CAMPAIGN ${String(campaignCount).padStart(2, "0")}`;
    dom.unlockRow.innerHTML = unlocks.map((perk) => `<div class="unlock-item ${unlocked(perk.id) ? "unlocked" : ""}"><span class="unlock-badge">${unlocked(perk.id) ? "✓" : "·"}</span><span>${perk.title} ${unlocked(perk.id) ? "earned" : `at ${perk.threshold}`}</span></div>`).join("");
  }

  function render() {
    renderDayTrack();
    renderEvent();
    renderActions();
    renderStats();
    dom.dayHeading.innerHTML = state.completed ? "Week <span>/ complete</span>" : `Day ${state.day} <span>/ 7</span>`;
    dom.weekStatus.textContent = state.completed ? "A week of people-powered momentum." : state.day === 1 ? "A fresh start. Find your first win." : state.day < 4 ? "Momentum is building. Keep showing up." : "The week is flying. Make the next move count.";
    dom.commitButton.disabled = !state.selected || state.completed;
    dom.commitLabel.textContent = state.day === MAX_DAYS ? "Wrap the campaign" : "Lock in today’s move";
    dom.turnHint.textContent = state.selected ? selectionHint() : "Choose an action to see what it costs.";
  }

  function selectionHint() {
    const action = state.dayActions.find((item) => item.id === state.selected);
    if (!action) return "Choose an action to see what it costs.";
    const cost = getCosts(action);
    const risk = action.risk ? ` ${Math.round(action.risk.chance * 100)}% chance to backfire and lose up to ${formatRiskLosses(action.risk.failure)}.` : "";
    return `Uses ${cost.hours} volunteer hour${cost.hours === 1 ? "" : "s"} and ${cost.budget} budget points.${risk}`;
  }

  function formatRiskLosses(failure) {
    return Object.entries(failure).map(([resource, amount]) => `${amount} ${resource}`).join(" and ") || "no resources";
  }

  function selectAction(actionId) {
    if (state.completed) return;
    const action = state.dayActions.find((item) => item.id === actionId);
    if (!action || !canAfford(action)) return;
    state.selected = actionId;
    renderActions();
    dom.commitButton.disabled = false;
    dom.turnHint.textContent = selectionHint();
  }

  function commitAction() {
    if (!state.selected || state.completed) return;
    const action = state.dayActions.find((item) => item.id === state.selected);
    if (!action || !canAfford(action)) return;

    const cost = getCosts(action);
    const gains = actionGains(action);
    const backfired = action.risk && Math.random() < action.risk.chance;
    state.hours -= cost.hours;
    const budgetAfterCost = Math.max(0, state.budget - cost.budget + (state.currentEvent.budgetBonus || 0));
    const losses = {};
    if (backfired) {
      Object.entries(action.risk.failure).forEach(([resource, amount]) => {
        const actualLoss = Math.min(state[resource] || 0, amount);
        state[resource] = (state[resource] || 0) - actualLoss;
        losses[resource] = actualLoss;
      });
      losses.budget = Math.min(budgetAfterCost, action.risk.failure.budget || 0);
      state.budget = budgetAfterCost - losses.budget;
    } else {
      state.budget = budgetAfterCost + gains.budget;
      state.reach += gains.reach;
      state.signups += gains.signups;
      state.trust += gains.trust;
    }
    state.score = Math.max(0, state.reach + state.signups * 6 + state.trust * 4 + (MAX_HOURS - state.hours) * 2 + state.day * 3);

    const eventLine = state.currentEvent.budgetBonus ? ` The alum match adds ${state.currentEvent.budgetBonus} budget.` : "";
    const outcomeLine = backfired
      ? `${action.title} backfired: lost ${formatRiskLosses(Object.fromEntries(Object.entries(losses).filter(([, amount]) => amount > 0)))}. Its potential gains were lost.`
      : `${action.title}: +${gains.reach} reach, +${gains.signups} sign-ups, +${gains.trust} trust.`;
    showToast(`${outcomeLine}${eventLine}`);

    if (state.day === MAX_DAYS) {
      finishCampaign();
      return;
    }

    state.day += 1;
    state.hours = MAX_HOURS;
    state.currentEvent = state.dailyEvents[state.day - 1];
    buildDailyActions();
    render();
  }

  function finishCampaign() {
    state.completed = true;
    save.campaignCount = campaignCount;
    const newBest = state.score > save.bestScore;
    save.bestScore = Math.max(save.bestScore, state.score);
    persistSave();
    render();
    openResults(newBest);
  }

  function openResults(newBest) {
    dom.resultCopy.textContent = newBest ? "That’s your best campaign yet. Your crew showed up, and your legacy unlocked new support for the next run." : "Your campus campaign is in the books. Every run teaches you a new way to bring people together.";
    dom.finalScore.textContent = state.score;
    dom.resultStats.innerHTML = `<div class="result-stat"><strong>${state.reach}</strong><span>people reached</span></div><div class="result-stat"><strong>${state.signups}</strong><span>new sign-ups</span></div><div class="result-stat"><strong>${state.trust}</strong><span>campus trust</span></div>`;
    dom.resultModal.hidden = false;
    document.getElementById("play-again").focus();
  }

  function closeResults() {
    dom.resultModal.hidden = true;
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => dom.toast.classList.remove("visible"), 2800);
  }

  document.getElementById("commit-button").addEventListener("click", commitAction);
  document.getElementById("restart-button").addEventListener("click", newCampaign);
  document.getElementById("play-again").addEventListener("click", newCampaign);
  document.getElementById("close-modal").addEventListener("click", closeResults);
  dom.resultModal.addEventListener("click", (event) => {
    if (event.target === dom.resultModal) closeResults();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.resultModal.hidden) closeResults();
  });

  newCampaign();
})();