/* =====================================================
   Family Tree — renderer
   Builds the tree DOM from `familyData`, draws connector
   lines with SVG, and wires up search, zoom/pan & modal.
   You should not need to edit this file to add family
   members — edit js/family-data.js instead.
   ===================================================== */
(function () {
  "use strict";

  var treeRoot = document.getElementById("treeRoot");
  var canvas = document.getElementById("treeCanvas");
  var stage = document.getElementById("stage");
  var svg = document.getElementById("connectors");
  var SVGNS = "http://www.w3.org/2000/svg";

  var people = []; // flat list for search + count
  // map of couple-element -> array of child node elements, for drawing lines
  var linkPairs = [];

  /* ---------- helpers ---------- */
  function initials(name) {
    return name
      .split(/\s+/)
      .map(function (w) { return w[0]; })
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function lifespan(p) {
    if (p.born && p.died) return p.born + " – " + p.died;
    if (p.born) return "b. " + p.born;
    if (p.died) return "d. " + p.died;
    return "";
  }

  function avatarStyle(el, p) {
    var g = p.gender === "m" ? "m" : p.gender === "f" ? "f" : "u";
    el.className += " " + g;
    if (p.photo) {
      el.style.backgroundImage = "url('" + p.photo + "')";
      el.textContent = "";
    } else {
      el.textContent = initials(p.name);
    }
  }

  /* ---------- card ---------- */
  function makeCard(p) {
    var card = document.createElement("div");
    card.className = "person-card";

    var av = document.createElement("div");
    av.className = "avatar";
    avatarStyle(av, p);

    var name = document.createElement("div");
    name.className = "person-name";
    name.textContent = p.name;

    var dates = document.createElement("div");
    dates.className = "person-dates";
    dates.textContent = lifespan(p);

    card.appendChild(av);
    card.appendChild(name);
    card.appendChild(dates);

    card.addEventListener("click", function () { openModal(p); });

    people.push({ person: p, card: card });
    return card;
  }

  /* ---------- recursive node builder ---------- */
  function buildNode(p) {
    var node = document.createElement("div");
    node.className = "node";

    var couple = document.createElement("div");
    couple.className = "couple" + (p.spouse ? " has-spouse" : "");
    couple.appendChild(makeCard(p));
    if (p.spouse) couple.appendChild(makeCard(p.spouse));
    node.appendChild(couple);

    if (p.children && p.children.length) {
      var childrenWrap = document.createElement("div");
      childrenWrap.className = "node-children";
      var childNodes = [];
      p.children.forEach(function (child) {
        var cn = buildNode(child);
        childNodes.push(cn);
        childrenWrap.appendChild(cn);
      });
      node.appendChild(childrenWrap);
      linkPairs.push({ couple: couple, children: childNodes });
    }
    return node;
  }

  /* ---------- connector lines ---------- */
  function drawConnectors() {
    // clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var canvasRect = canvas.getBoundingClientRect();
    var scale = currentScale || 1;

    function rel(rect) {
      return {
        left: (rect.left - canvasRect.left) / scale,
        top: (rect.top - canvasRect.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      };
    }

    linkPairs.forEach(function (pair) {
      var cRect = rel(pair.couple.getBoundingClientRect());
      var startX = cRect.left + cRect.width / 2;
      var startY = cRect.top + cRect.height;

      pair.children.forEach(function (childNode) {
        // connect to the child's couple (first child element)
        var childCouple = childNode.querySelector(".couple");
        var chRect = rel(childCouple.getBoundingClientRect());
        var endX = chRect.left + chRect.width / 2;
        var endY = chRect.top;

        var midY = startY + (endY - startY) / 2;
        var d =
          "M " + startX + " " + startY +
          " C " + startX + " " + midY +
          ", " + endX + " " + midY +
          ", " + endX + " " + endY;

        var path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
      });
    });
  }

  /* ---------- modal ---------- */
  var backdrop = document.getElementById("modalBackdrop");
  function openModal(p) {
    var av = document.getElementById("modalAvatar");
    av.className = "modal-avatar";
    av.style.backgroundImage = "";
    avatarStyle(av, p);
    document.getElementById("modalName").textContent = p.name;
    document.getElementById("modalDates").textContent = lifespan(p) +
      (p.place ? "" : "");
    document.getElementById("modalPlace").textContent = p.place || "";
    document.getElementById("modalNotes").textContent = p.notes || "";
    backdrop.hidden = false;
  }
  function closeModal() { backdrop.hidden = true; }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- search ---------- */
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    var q = searchInput.value.trim().toLowerCase();
    people.forEach(function (item) {
      item.card.classList.remove("match", "dimmed");
      if (!q) return;
      if (item.person.name.toLowerCase().indexOf(q) !== -1) {
        item.card.classList.add("match");
      } else {
        item.card.classList.add("dimmed");
      }
    });
    // scroll first match into view
    if (q) {
      var first = people.find(function (it) {
        return it.card.classList.contains("match");
      });
      if (first) {
        first.card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }
  });

  /* ---------- zoom & pan ---------- */
  var currentScale = 1;
  var MIN = 0.35, MAX = 1.6;

  function applyScale() {
    canvas.style.transform = "scale(" + currentScale + ")";
    drawConnectors();
  }
  function setScale(s) {
    currentScale = Math.min(MAX, Math.max(MIN, s));
    applyScale();
  }
  document.getElementById("zoomIn").addEventListener("click", function () {
    setScale(currentScale + 0.15);
  });
  document.getElementById("zoomOut").addEventListener("click", function () {
    setScale(currentScale - 0.15);
  });
  document.getElementById("zoomReset").addEventListener("click", fitToScreen);

  function fitToScreen() {
    currentScale = 1;
    canvas.style.transform = "scale(1)";
    // measure natural size
    var contentW = canvas.scrollWidth;
    var avail = stage.clientWidth - 40;
    if (contentW > avail) {
      setScale(avail / contentW);
    } else {
      applyScale();
    }
    // center horizontally
    requestAnimationFrame(function () {
      stage.scrollLeft = (canvas.scrollWidth * currentScale - stage.clientWidth) / 2 + 60;
    });
  }

  // drag to pan
  var panning = false, startX, startY, scrollLeft, scrollTop;
  stage.addEventListener("mousedown", function (e) {
    if (e.target.closest(".person-card")) return; // let clicks work
    panning = true;
    stage.classList.add("grabbing");
    startX = e.pageX; startY = e.pageY;
    scrollLeft = stage.scrollLeft; scrollTop = stage.scrollTop;
  });
  window.addEventListener("mouseup", function () {
    panning = false;
    stage.classList.remove("grabbing");
  });
  window.addEventListener("mousemove", function (e) {
    if (!panning) return;
    stage.scrollLeft = scrollLeft - (e.pageX - startX);
    stage.scrollTop = scrollTop - (e.pageY - startY);
  });

  /* ---------- init ---------- */
  function init() {
    // titles
    if (typeof FAMILY_TITLE === "string") {
      document.getElementById("familyTitle").textContent = FAMILY_TITLE;
      document.title = FAMILY_TITLE;
    }
    if (typeof FAMILY_SUBTITLE === "string") {
      document.getElementById("familySubtitle").textContent = FAMILY_SUBTITLE;
    }

    treeRoot.appendChild(buildNode(familyData));
    document.getElementById("personCount").textContent = people.length;

    fitToScreen();
    // redraw once fonts/images settle
    window.addEventListener("load", drawConnectors);
    setTimeout(drawConnectors, 300);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawConnectors, 150);
  });

  init();
})();
