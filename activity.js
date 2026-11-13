(function () {
  "use strict";

  var EVENTS = [
    ["2026-11-13", "work", "Friday demo: a new provider sending real messages on dev", "delivery receipt came back green on the first try"],
    ["2026-11-12", "food", "Lunch in Passage Brady", "the 10e&rsquo;s little India, two minutes from the office"],
    ["2026-11-12", "guitar", "Chord changes G &ndash; C &ndash; D, clean at 70 bpm", "20 min with the metronome"],
    ["2026-11-11", "swim", "Laps after work", "1.5 km, lane 3, nobody else in the pool"],
    ["2026-11-10", "work", "Shipped a change, then watched the Grafana panels for an hour", "nothing caught fire"],
    ["2026-11-10", "guitar", "First go at down-down-up-up-down-up", "fingertips: complaining"],
    ["2026-11-09", "film", "Chamber of Secrets, first hour", "paused at the flying car"],
    ["2026-11-08", "run", "Cachan to the Arcueil aqueduct and back", "6 km easy, under arches from the 1620s"],
    ["2026-11-07", "ride", "Canal Saint-Martin &rarr; La Villette", "V&eacute;lib&rsquo;, 12 km, coffee at the end of the line"],
    ["2026-11-06", "walk", "After work along Canal Saint-Martin", "iron footbridges at dusk"],
    ["2026-11-05", "guitar", "Em and Am without looking at the fretboard", "small win, big grin"],
    ["2026-11-04", "work", "Read a provider&rsquo;s price list format until it made sense", "every carrier has its own idea of a CSV"],
    ["2026-11-03", "code", "Re-read Raft &sect;5, drew the state machine on paper", "follower &rarr; candidate &rarr; leader"],
    ["2026-11-01", "run", "Parc de Sceaux loop before sunrise", "8 km, the ch&acirc;teau in fog"],
    ["2026-10-31", "walk", "&Icirc;le de la Cit&eacute;: Sainte-Chapelle and the Conciergerie", "1248 glass, 14th-century halls"],
    ["2026-10-28", "swim", "Laps", "1.2 km, slow and steady"],
    ["2026-10-25", "hike", "For&ecirc;t de Meudon", "11 km, the terrace view back over Paris"],
    ["2026-10-24", "ride", "Coul&eacute;e verte Ren&eacute;-Dumont &rarr; Bois de Vincennes", "an old railway line, now a park in the air"],
    ["2026-10-22", "food", "Lunch on rue du Faubourg Saint-Denis", "the busiest street in the 10e, the best falafel debate"],
    ["2026-10-21", "guitar", "Changed the strings myself for the first time", "it took an hour, it still sounds right"],
    ["2026-10-18", "swim", "Laps, then a long lunch", "earned it"],
    ["2026-10-17", "walk", "Le Marais: the oldest houses in Paris", "timber frames on rue Fran&ccedil;ois-Miron"],
    ["2026-10-15", "work", "First message through a new provider integration on dev", "SMS on my own phone, sent by my own code"],
    ["2026-10-14", "run", "Along the Bi&egrave;vre path", "7 km, the river Paris buried"],
    ["2026-10-11", "run", "Quais de Seine, Notre-Dame to Bercy", "9 km, bridges counted: lost track"],
    ["2026-10-10", "ride", "Montmartre the hard way, uphill", "Sacr&eacute;-C&oelig;ur at the top, worth it"],
    ["2026-10-08", "work", "Learned what a delivery receipt really means", "spoiler: it depends on the carrier"],
    ["2026-10-07", "code", "Profiling a Go service with pprof for fun", "flame graphs are art"],
    ["2026-10-04", "film", "Harry Potter and the Philosopher&rsquo;s Stone", "the rewatch begins: 1 / 8"],
    ["2026-10-03", "hike", "Vall&eacute;e de Chevreuse, Port-Royal des Champs", "14 km, ruins of an abbey in the woods"],
    ["2026-10-01", "guitar", "Picked up the Fender. Day one.", "three chords and a lot of buzzing"],
    ["2026-09-29", "work", "First change in production at Prelude", "release day, checked the logs twice"],
    ["2026-09-27", "walk", "Panth&eacute;on: the crypt and Foucault&rsquo;s pendulum", "proof the Earth turns, in a church"],
    ["2026-09-20", "ride", "Along the Seine to Boulogne", "quais all the way, wind in the face"],
    ["2026-09-13", "hike", "Saint-Germain-en-Laye: terrace and forest", "2 km of terrace, then trees"],
    ["2026-09-09", "food", "Team lunch near Strasbourg&ndash;Saint-Denis", "the Porte Saint-Denis arch, built 1672, as a landmark"],
    ["2026-09-06", "swim", "Last open-air swim of the summer", "cold, worth it"],
    ["2026-09-01", "code", "Raft by hand for a hackathon: elections, WAL, chaos agent", "three nodes, one survives"],
    ["2026-08-30", "run", "Bois de Boulogne long run", "12 km around the lakes"],
    ["2026-08-23", "walk", "P&egrave;re Lachaise, an afternoon of street names", "a city of the dead with its own map"],
    ["2026-08-19", "work", "First pull request merged at Prelude", "small diff, big smile"],
    ["2026-08-16", "ride", "Bois de Vincennes lakes", "V&eacute;lib&rsquo; loop, ice cream stop"],
    ["2026-08-09", "run", "Parc de Sceaux, first run back after the trip", "legs remembered"],
    ["2026-08-03", "work", "First day at Prelude, Paris 10e", "laptop, badge, and a lot of new acronyms"],
    ["2026-07-31", "travel", "Bruges &rarr; Paris", "home, legs done, camera full"],
    ["2026-07-30", "travel", "Bruges: climbed the Belfry", "366 steps, the whole town below"],
    ["2026-07-29", "travel", "Train to Bruges, canals by boat", "a medieval town that never got the memo"],
    ["2026-07-28", "travel", "Brussels: the Grand-Place at night, the Atomium", "and waffles, for research"],
    ["2026-07-27", "travel", "Amsterdam &rarr; Brussels", "train south, flat fields all the way"],
    ["2026-07-26", "travel", "Amsterdam by bike, canals end to end", "more bikes than people"],
    ["2026-07-25", "travel", "Paris &rarr; Amsterdam", "train north, trip begins"]
  ];

  var KINDS = {
    run:    { label: "run",    tag: "fitness" },
    ride:   { label: "ride",   tag: "travel" },
    hike:   { label: "hike",   tag: "fitness" },
    swim:   { label: "swim",   tag: "learning" },
    walk:   { label: "walk",   tag: "history" },
    guitar: { label: "guitar", tag: "music" },
    film:   { label: "film",   tag: "film" },
    travel: { label: "trip",   tag: "travel" },
    code:   { label: "code",   tag: "coding" },
    work:   { label: "work",   tag: "career" },
    food:   { label: "lunch",  tag: "personal" }
  };

  var GUITAR_SINCE = "2026-10-01";
  var SEASON_START = "2026-09-22";
  var DAY = 86400000;

  function parse(d) {
    var p = d.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }

  function todayUTC() {
    var n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
  }

  function iso(date) {
    return date.toISOString().slice(0, 10);
  }

  function ago(d) {
    var days = Math.round((todayUTC() - parse(d)) / DAY);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return days + " days ago";
    if (days < 14) return "last week";
    if (days < 60) return Math.floor(days / 7) + " weeks ago";
    return Math.floor(days / 30) + " months ago";
  }

  function monthName(d) {
    return parse(d).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  }

  function shortDate(d) {
    return parse(d).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" }).toLowerCase();
  }

  // --- Heatmap: events plus daily guitar practice ---
  function buildHeatmap(el) {
    var counts = {};
    EVENTS.forEach(function (e) { counts[e[0]] = (counts[e[0]] || 0) + 1; });
    var today = todayUTC();
    for (var t = parse(GUITAR_SINCE); t <= today; t = new Date(t.getTime() + DAY)) {
      counts[iso(t)] = (counts[iso(t)] || 0) + 1;
    }

    var weeks = 26;
    var end = new Date(today.getTime() + (6 - ((today.getUTCDay() + 6) % 7)) * DAY);
    var start = new Date(end.getTime() - (weeks * 7 - 1) * DAY);
    var html = "";
    for (var d = start; d <= end; d = new Date(d.getTime() + DAY)) {
      var key = iso(d);
      var n = d > today ? -1 : (counts[key] || 0);
      var lvl = n < 0 ? "future" : Math.min(n, 3);
      var label = n < 0 ? "" : key + ": " + (n === 0 ? "rest day" : n + (n === 1 ? " thing" : " things"));
      html += '<span class="hm-cell hm-' + lvl + '" title="' + label + '"></span>';
    }
    el.innerHTML = html;
  }

  // --- Season stats ---
  function buildStats(el) {
    var season = parse(SEASON_START);
    var tally = {};
    EVENTS.forEach(function (e) {
      if (parse(e[0]) >= season) tally[e[1]] = (tally[e[1]] || 0) + 1;
    });
    var streak = Math.round((todayUTC() - parse(GUITAR_SINCE)) / DAY) + 1;
    var order = ["run", "ride", "hike", "swim", "walk", "film"];
    var names = { run: "runs", ride: "rides", hike: "hikes", swim: "swims", walk: "history walks", film: "films" };
    var html = '<div class="stat"><span class="stat-n">' + streak + '</span><span class="stat-l">days of guitar</span></div>';
    order.forEach(function (k) {
      if (tally[k]) html += '<div class="stat"><span class="stat-n">' + tally[k] + '</span><span class="stat-l">' + names[k] + '</span></div>';
    });
    el.innerHTML = html;
  }

  // --- Feed with filters ---
  function buildFeed(feedEl, filtersEl, moreBtn) {
    var active = "all";
    var limit = 14;

    var counts = { all: EVENTS.length };
    EVENTS.forEach(function (e) { counts[e[1]] = (counts[e[1]] || 0) + 1; });

    var chips = ["all"].concat(Object.keys(KINDS).filter(function (k) { return counts[k]; }));
    filtersEl.innerHTML = chips.map(function (k) {
      var label = k === "all" ? "all" : KINDS[k].label;
      return '<button type="button" class="chip' + (k === active ? " active" : "") + '" data-kind="' + k + '">' +
        label + ' <span class="chip-n">' + counts[k] + "</span></button>";
    }).join("");

    function render() {
      var list = EVENTS.filter(function (e) { return active === "all" || e[1] === active; });
      var shown = list.slice(0, limit);
      var html = "";
      var month = "";
      shown.forEach(function (e, i) {
        var m = monthName(e[0]);
        if (m !== month) {
          month = m;
          html += '<li class="feed-month">' + m + "</li>";
        }
        var k = KINDS[e[1]];
        html += '<li class="feed-item" style="animation-delay:' + Math.min(i, 12) * 35 + 'ms">' +
          '<span class="feed-when" title="' + e[0] + '">' + shortDate(e[0]) + "</span>" +
          '<span class="card-tag tag-' + k.tag + '">' + k.label + "</span>" +
          '<span class="feed-body"><span class="feed-text">' + e[2] + "</span>" +
          '<span class="feed-detail">' + e[3] + " &middot; " + ago(e[0]) + "</span></span></li>";
      });
      feedEl.innerHTML = html;
      moreBtn.hidden = list.length <= limit;
      moreBtn.textContent = "show " + Math.min(list.length - limit, 14) + " more";
    }

    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      active = b.dataset.kind;
      limit = 14;
      filtersEl.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === b); });
      render();
    });

    moreBtn.addEventListener("click", function () {
      limit += 14;
      render();
    });

    render();
  }

  // --- Rotating ticker in the status terminal ---
  function ticker(el) {
    var lines = EVENTS.slice(0, 8).map(function (e) {
      return KINDS[e[1]].label + " &middot; " + e[2].toLowerCase() + " (" + ago(e[0]) + ")";
    });
    var i = 0;
    el.innerHTML = lines[0];
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(function () {
      i = (i + 1) % lines.length;
      el.classList.add("ticker-out");
      setTimeout(function () {
        el.innerHTML = lines[i];
        el.classList.remove("ticker-out");
      }, 250);
    }, 3500);
  }

  var hm = document.getElementById("activity-heatmap");
  if (hm) buildHeatmap(hm);
  var st = document.getElementById("activity-stats");
  if (st) buildStats(st);
  var feed = document.getElementById("activity-feed");
  if (feed) buildFeed(feed, document.getElementById("activity-filters"), document.getElementById("activity-more"));
  var tk = document.getElementById("activity-ticker");
  if (tk) ticker(tk);
})();
