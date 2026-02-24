(function () {
  "use strict";

  let draggedCard = null;
  let draggedFrom = null;
  let placeholder = null;

  function createPlaceholder() {
    const el = document.createElement("div");
    el.className = "kanban-placeholder";
    return el;
  }

  function removePlaceholder() {
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
  }

  function updateColumnCounts() {
    document.querySelectorAll(".kanban-column").forEach(function (col) {
      const count = col.querySelector(".column-content").querySelectorAll(".kanban-card").length;
      const badge = col.querySelector(".column-count");
      if (badge) badge.textContent = count;
    });
  }

  function getClosestCard(column, y) {
    const cards = Array.from(column.querySelectorAll(".kanban-card:not(.dragging)"));
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    cards.forEach(function (card) {
      const box = card.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closest = card;
      }
    });

    return closest;
  }

  // --- Drag events on cards ---
  document.querySelectorAll(".kanban-card").forEach(function (card) {
    card.addEventListener("dragstart", function (e) {
      draggedCard = this;
      draggedFrom = this.closest(".column-content");
      this.classList.add("dragging");
      placeholder = createPlaceholder();

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", this.dataset.id);

      // Slight delay so the browser captures the drag image before we hide
      requestAnimationFrame(function () {
        if (draggedCard) draggedCard.style.opacity = "0.4";
      });
    });

    card.addEventListener("dragend", function () {
      this.classList.remove("dragging");
      this.style.opacity = "";
      removePlaceholder();
      updateColumnCounts();
      draggedCard = null;
      draggedFrom = null;
    });
  });

  // --- Drop zones (column-content elements) ---
  document.querySelectorAll(".column-content").forEach(function (zone) {
    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      this.classList.add("drag-over");

      var afterCard = getClosestCard(this, e.clientY);
      removePlaceholder();

      if (afterCard) {
        this.insertBefore(placeholder, afterCard);
      } else {
        this.appendChild(placeholder);
      }
    });

    zone.addEventListener("dragleave", function (e) {
      // Only remove if we truly left the zone
      if (!this.contains(e.relatedTarget)) {
        this.classList.remove("drag-over");
        removePlaceholder();
      }
    });

    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");

      if (!draggedCard) return;

      removePlaceholder();

      var afterCard = getClosestCard(this, e.clientY);
      if (afterCard) {
        this.insertBefore(draggedCard, afterCard);
      } else {
        this.appendChild(draggedCard);
      }

      draggedCard.style.opacity = "";
      draggedCard.classList.remove("dragging");

      // Quick pop animation
      draggedCard.classList.add("card-dropped");
      var dropped = draggedCard;
      setTimeout(function () {
        dropped.classList.remove("card-dropped");
      }, 300);

      updateColumnCounts();
    });
  });

  // --- Touch support for mobile drag-and-drop ---
  var touchCard = null;
  var touchClone = null;
  var touchOffsetX = 0;
  var touchOffsetY = 0;
  var touchStartX = 0;
  var touchStartY = 0;
  var touchMoved = false;

  document.querySelectorAll(".kanban-card").forEach(function (card) {
    card.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;

      var touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
      touchCard = this;

      var rect = this.getBoundingClientRect();
      touchOffsetX = touch.clientX - rect.left;
      touchOffsetY = touch.clientY - rect.top;
    }, { passive: true });

    card.addEventListener("touchmove", function (e) {
      if (!touchCard) return;

      var touch = e.touches[0];
      var dx = Math.abs(touch.clientX - touchStartX);
      var dy = Math.abs(touch.clientY - touchStartY);

      // Start dragging after a small threshold
      if (!touchMoved && (dx > 8 || dy > 8)) {
        touchMoved = true;
        draggedFrom = touchCard.closest(".column-content");

        touchClone = touchCard.cloneNode(true);
        touchClone.classList.add("touch-dragging");
        touchClone.style.width = touchCard.offsetWidth + "px";
        document.body.appendChild(touchClone);

        touchCard.classList.add("dragging");
        touchCard.style.opacity = "0.4";
        placeholder = createPlaceholder();
      }

      if (!touchMoved) return;
      e.preventDefault();

      touchClone.style.left = (touch.clientX - touchOffsetX) + "px";
      touchClone.style.top = (touch.clientY - touchOffsetY) + "px";

      // Find the column-content under the finger
      // Temporarily hide the clone so elementFromPoint finds what's beneath it
      touchClone.style.pointerEvents = "none";
      var elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      touchClone.style.pointerEvents = "";

      var zone = null;
      if (elUnder) {
        zone = elUnder.closest(".column-content");
      }

      // Remove highlights from all zones
      document.querySelectorAll(".column-content").forEach(function (z) {
        z.classList.remove("drag-over");
      });

      if (zone) {
        zone.classList.add("drag-over");
        removePlaceholder();
        var afterCard = getClosestCard(zone, touch.clientY);
        if (afterCard) {
          zone.insertBefore(placeholder, afterCard);
        } else {
          zone.appendChild(placeholder);
        }
      }
    }, { passive: false });

    card.addEventListener("touchend", function () {
      if (!touchCard) return;

      if (touchClone && touchClone.parentNode) {
        touchClone.parentNode.removeChild(touchClone);
      }

      document.querySelectorAll(".column-content").forEach(function (z) {
        z.classList.remove("drag-over");
      });

      if (touchMoved && placeholder && placeholder.parentNode) {
        var targetZone = placeholder.parentNode;
        targetZone.insertBefore(touchCard, placeholder);
        touchCard.classList.add("card-dropped");
        setTimeout(function () {
          touchCard.classList.remove("card-dropped");
        }, 300);
      }

      if (touchCard) {
        touchCard.classList.remove("dragging");
        touchCard.style.opacity = "";
      }

      removePlaceholder();
      updateColumnCounts();

      touchCard = null;
      touchClone = null;
      touchMoved = false;
    });
  });
})();
