let viewer = null;
let isZoomed = false;

/* =========================
   OPEN CORNER (MAIN MODAL)
========================= */
function openCorner(corner) {
    const modal = document.getElementById("modal");

    // Push history state
    history.pushState({ modal: true }, "");

    modal.classList.add("show");

    // Destroy old panorama if exists
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }

    // Initialize panorama
    viewer = pannellum.viewer("panorama", {
        type: "equirectangular",
        panorama: `images/${corner}/360.jpg`,
        autoLoad: true
    });

    // Load images
    for (let i = 1; i <= 5; i++) {
        setImage(`photo${i}`, `images/${corner}/photo${i}`);
    }
}

/* =========================
   IMAGE LOADER (JPG → PNG)
========================= */
function setImage(id, basePath) {
    const img = document.getElementById(id);
    if (!img) return;

    img.src = basePath + ".jpg";

    img.onerror = () => {
        img.onerror = null; // prevent infinite loop
        img.src = basePath + ".png";
    };

    img.onclick = () => openImageViewer(img.src);
}

/* =========================
   CLOSE MAIN MODAL
========================= */
function closeModal() {
    const modal = document.getElementById("modal");

    if (viewer) {
        viewer.destroy();
        viewer = null;
    }

    modal.classList.remove("show");

    // Go back only if this modal was opened via pushState
    if (history.state?.modal) {
        history.back();
    }
}

/* =========================
   OPEN IMAGE VIEWER
========================= */
function openImageViewer(src) {
    const imageViewer = document.getElementById("imageViewer");
    const img = document.getElementById("viewerImage");

    history.pushState({ image: true }, "");

    img.src = src;
    img.classList.remove("zoomed");
    isZoomed = false;

    imageViewer.classList.add("show");
}

/* =========================
   CLOSE IMAGE VIEWER
========================= */
function closeImageViewer() {
    const imageViewer = document.getElementById("imageViewer");

    imageViewer.classList.remove("show");

    // Sync with browser history
    if (history.state?.image) {
        history.back();
    }
}

/* =========================
   BACK BUTTON HANDLING
========================= */
window.addEventListener("popstate", (event) => {
    const imageViewer = document.getElementById("imageViewer");
    const modal = document.getElementById("modal");

    if (imageViewer.classList.contains("show")) {
        imageViewer.classList.remove("show");
        return;
    }

    if (modal.classList.contains("show")) {
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
        modal.classList.remove("show");
    }
});

/* =========================
   DOUBLE CLICK ZOOM
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const viewerImage = document.getElementById("viewerImage");
    if (!viewerImage) return;

    viewerImage.addEventListener("dblclick", () => {
        isZoomed = !isZoomed;
        viewerImage.classList.toggle("zoomed", isZoomed);
    });
});