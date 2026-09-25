const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

function render(items, query) {
    results.innerHTML = "";

    if (items.length === 0) {
        resultCount.textContent = "";
        emptyState.style.display = "grid";
        emptyState.querySelector("h3").textContent =
            `No results for "${query}"`;
        emptyState.querySelector("p").textContent =
            "Try another search term.";
        return;
    }

    emptyState.style.display = "none";
    resultCount.textContent =
        `Showing ${items.length} results for "${query}"`;

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";

        const img = document.createElement("img");
        img.src = item.imageinfo[0].thumburl;
        img.alt = item.title;

        const caption = document.createElement("p");
        caption.textContent = item.title;

        card.appendChild(img);
        card.appendChild(caption);

        results.appendChild(card);
    });
}

async function search(query) {
    results.innerHTML = "";
    emptyState.style.display = "none";
    resultCount.textContent = "Searching...";

    const url =
        "https://commons.wikimedia.org/w/api.php?action=query" +
        "&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6" +
        "&gsrlimit=12" +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=300" +
        "&format=json" +
        "&origin=*";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();

        const items = data.query
            ? Object.values(data.query.pages)
            : [];

        render(items, query);
    } catch (error) {
        results.innerHTML = "";
        emptyState.style.display = "grid";
        resultCount.textContent = "Search failed";
        emptyState.querySelector("h3").textContent =
            "Something went wrong.";
        emptyState.querySelector("p").textContent =
            "Please try again.";
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();

    if (!query) {
        return;
    }

    await search(query);
});