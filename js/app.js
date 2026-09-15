    const SESSION_KEY = "gonzcoreClothingSession";

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    let currentSession = null;

    const savedSession =
        localStorage.getItem(
            SESSION_KEY
        );

    if (savedSession) {
        try {
            currentSession =
                JSON.parse(
                    savedSession
                );
        } catch (error) {
            currentSession = null;
        }
    }

    const staffAllowedPages = [
        "index.html",
        "pos.html",
        "sales.html",
        "customers.html"
    ];

    const adminOnlyPages = [
        "products.html",
        "reports.html",
        "settings.html",
        "account.html"
    ];

    if (
        currentPage !== "login.html"
    ) {

        if (!currentSession) {

            const loginPath =
                window.location.pathname.includes("/pages/")
                    ? "login.html"
                    : "pages/login.html";

            window.location.href =
                loginPath;
        }

        if (
            currentSession &&
            String(
                currentSession.role || ""
            ).toLowerCase() === "staff"
        ) {

            if (
                adminOnlyPages.includes(
                    currentPage
                )
            ) {

                window.location.href =
                    "../index.html";
            }
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            createParticles();

            updateClock();

            setInterval(
                updateClock,
                1000
            );

            loadDashboard();

            setupUserSession();

            setupMobileNavigation();

        }
    );

    function setupMobileNavigation() {
        const sidebar = document.querySelector(".sidebar");
        const topbar = document.querySelector(".topbar");

        if (!sidebar || !topbar || document.getElementById("mobileMenuButton")) {
            return;
        }

        const menuButton = document.createElement("button");
        menuButton.id = "mobileMenuButton";
        menuButton.type = "button";
        menuButton.className = "mobile-menu-button";
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = "<span></span><span></span><span></span>";

        const overlay = document.createElement("button");
        overlay.type = "button";
        overlay.className = "mobile-nav-overlay";
        overlay.setAttribute("aria-label", "Close navigation menu");

        function closeMenu() {
            document.body.classList.remove("mobile-nav-open");
            menuButton.setAttribute("aria-expanded", "false");
        }

        menuButton.addEventListener("click", function() {
            const open = document.body.classList.toggle("mobile-nav-open");
            menuButton.setAttribute("aria-expanded", String(open));
        });

        overlay.addEventListener("click", closeMenu);
        sidebar.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", closeMenu);
        });

        topbar.insertBefore(menuButton, topbar.firstChild);
        document.body.appendChild(overlay);
    }

    function setupUserSession() {

        const session =
            localStorage.getItem(
                SESSION_KEY
            );

        if (!session) {
            return;
        }

        let user;

        try {
            user =
                JSON.parse(
                    session
                );
        } catch (error) {
            return;
        }

        const profile =
            document.querySelector(
                ".profile"
            );

        if (profile) {

            const name =
                profile.querySelector(
                    "strong"
                );

            const role =
                profile.querySelector(
                    "span"
                );

            if (name) {

                name.textContent =
                    user.name ||
                    user.username ||
                    "User";
            }

            if (role) {

                role.textContent =
                    String(
                        user.role || ""
                    ).toLowerCase() ===
                    "administrator"
                        ? "Owner"
                        : "Staff";
            }

            if (
                String(
                    user.role || ""
                ).toLowerCase() ===
                "administrator"
            ) {

                profile.style.cursor =
                    "pointer";

                profile.onclick =
                    function() {

                        window.location.href =
                            window.location.pathname.includes("/pages/")
                                ? "account.html"
                                : "pages/account.html";

                    };

            } else {

                profile.style.cursor =
                    "default";

                profile.onclick = null;
            }
        }

        createLogoutButton(
            user
        );

        applyRolePermissions(
            user.role
        );
    }

    function createLogoutButton(
        user
    ) {

        const topbarRight =
            document.querySelector(
                ".topbar-right"
            );

        if (
            !topbarRight ||
            document.getElementById(
                "globalLogoutButton"
            )
        ) {
            return;
        }

        const logoutButton =
            document.createElement(
                "button"
            );

        logoutButton.id =
            "globalLogoutButton";

        logoutButton.type =
            "button";

        logoutButton.textContent =
            "Logout";

        logoutButton.addEventListener(
            "click",
            function() {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) {
                    return;
                }

                localStorage.removeItem(
                    SESSION_KEY
                );

                const loginPath =
                    window.location.pathname.includes("/pages/")
                        ? "login.html"
                        : "pages/login.html";

                window.location.href =
                    loginPath;

            }
        );

        topbarRight.appendChild(
            logoutButton
        );
    }

    function applyRolePermissions(
        role
    ) {

        const normalizedRole =
            String(
                role || ""
            ).toLowerCase();

        const restrictedPages = [
            "products.html",
            "reports.html",
            "settings.html"
        ];

        if (
            normalizedRole !== "staff"
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(
                function(link) {

                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if (!href) {
                        return;
                    }

                    const page =
                        href
                            .split("/")
                            .pop()
                            .toLowerCase();

                    if (
                        restrictedPages.includes(
                            page
                        )
                    ) {

                        link.style.display =
                            "none";
                    }
                }
            );

        document
            .querySelectorAll(
                'a[href*="products.html"]'
            )
            .forEach(
                function(link) {

                    link.style.display =
                        "none";
                }
            );

        document
            .querySelectorAll(
                'a[href*="inventory.html"]'
            )
            .forEach(
                function(link) {

                    link.style.display =
                        "none";
                }
            );

        document
            .querySelectorAll(
                'a[href*="reports.html"]'
            )
            .forEach(
                function(link) {

                    link.style.display =
                        "none";
                }
            );

        document
            .querySelectorAll(
                'a[href*="settings.html"]'
            )
            .forEach(
                function(link) {

                    link.style.display =
                        "none";
                }
            );
    }

    function createParticles() {

        const container =
            document.getElementById(
                "particles"
            );

        if (!container) {
            return;
        }

        if (
            container.children.length > 0
        ) {
            return;
        }

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "particle";

            particle.style.left =
                Math.random() *
                    100 +
                "%";

            particle.style.animationDuration =
                8 +
                Math.random() *
                    15 +
                "s";

            particle.style.animationDelay =
                Math.random() *
                    10 +
                "s";

            particle.style.opacity =
                0.2 +
                Math.random() *
                    0.5;

            container.appendChild(
                particle
            );
        }
    }

    function updateClock() {

        const clock =
            document.getElementById(
                "liveTime"
            );

        if (!clock) {
            return;
        }

        const now =
            new Date();

        clock.textContent =
            now.toLocaleTimeString(
                "en-PH",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );
    }

    function loadDashboard() {

        const sales =
            JSON.parse(
                localStorage.getItem(
                    "gonzcoreClothingSales"
                )
            ) || [];

        const inventory =
            JSON.parse(
                localStorage.getItem(
                    "gonzcoreClothingInventory"
                )
            ) || {};

        updateSalesStats(
            sales
        );

        updateProductStats(
            inventory
        );

        updateRecentTransactions(
            sales
        );

        updateStockStatus(
            inventory
        );
    }

    function updateSalesStats(
        sales
    ) {

        const today =
            new Date()
                .toLocaleDateString(
                    "en-US"
                );

        let todaySales = 0;

        let transactions = 0;

        sales.forEach(
            function(sale) {

                if (
                    sale.date ===
                    today
                ) {

                    todaySales +=
                        Number(
                            sale.total
                        ) || 0;

                    transactions++;
                }
            }
        );

        animateNumber(
            "todaySales",
            todaySales
        );

        animateNumber(
            "transactionCount",
            transactions
        );
    }

    function updateProductStats(
        inventory
    ) {

        let products = 0;

        let lowStock = 0;

        if (
            Array.isArray(
                inventory
            )
        ) {

            products =
                inventory.length;

            inventory.forEach(
                function(item) {

                    if (
                        Number(
                            item.stock
                        ) <= 5
                    ) {

                        lowStock++;
                    }
                }
            );

        } else if (
            inventory &&
            typeof inventory ===
                "object"
        ) {

            products =
                Object.keys(
                    inventory
                ).length;

            Object.values(
                inventory
            ).forEach(
                function(item) {

                    if (
                        item &&
                        Number(
                            item.stock
                        ) <= 5
                    ) {

                        lowStock++;
                    }
                }
            );
        }

        animateNumber(
            "productCount",
            products
        );

        animateNumber(
            "lowStockCount",
            lowStock
        );
    }

    function animateNumber(
        elementId,
        target
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {
            return;
        }

        const duration =
            700;

        const start =
            performance.now();

        function update(
            currentTime
        ) {

            const progress =
                Math.min(
                    (
                        currentTime -
                        start
                    ) /
                    duration,
                    1
                );

            const value =
                Math.floor(
                    target *
                    progress
                );

            element.textContent =
                value.toLocaleString(
                    "en-PH"
                );

            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    update
                );
            }
        }

        requestAnimationFrame(
            update
        );
    }

    function updateRecentTransactions(
        sales
    ) {

        const container =
            document.getElementById(
                "recentTransactions"
            );

        if (!container) {
            return;
        }

        if (
            sales.length === 0
        ) {
            return;
        }

        container.innerHTML =
            "";

        sales
            .slice(0, 5)
            .forEach(
                function(sale) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "transaction";

                    item.innerHTML = `
                        <div class="transaction-icon">
                            ◈
                        </div>

                        <div class="transaction-info">
                            <strong>
                                ${escapeHTML(
                                    sale.transaction ||
                                    "Transaction"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    sale.date ||
                                    ""
                                )}
                            </span>
                        </div>

                        <div class="transaction-total">
                            ₱${Number(
                                sale.total ||
                                0
                            ).toLocaleString(
                                "en-PH",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </div>
                    `;

                    container.appendChild(
                        item
                    );
                }
            );
    }

    function updateStockStatus(
        inventory
    ) {

        const container =
            document.getElementById(
                "stockStatus"
            );

        if (!container) {
            return;
        }

        let items = [];

        if (
            Array.isArray(
                inventory
            )
        ) {

            items =
                inventory;

        } else if (
            inventory &&
            typeof inventory ===
                "object"
        ) {

            items =
                Object.keys(
                    inventory
                ).map(
                    function(name) {

                        return {
                            name:
                                name,
                            ...inventory[
                                name
                            ]
                        };
                    }
                );
        }

        if (
            items.length === 0
        ) {
            return;
        }

        container.innerHTML =
            "";

        items
            .slice(0, 5)
            .forEach(
                function(item) {

                    const stock =
                        Number(
                            item.stock
                        ) || 0;

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "stock-item";

                    const statusClass =
                        stock <= 5
                            ? "low"
                            : "good";

                    row.innerHTML = `
                        <div class="stock-image">
                            👕
                        </div>

                        <div class="stock-info">
                            <strong>
                                ${escapeHTML(
                                    item.name ||
                                    "Product"
                                )}
                            </strong>

                            <span>
                                Clothing item
                            </span>
                        </div>

                        <div class="stock-number ${statusClass}">
                            ${stock} left
                        </div>
                    `;

                    container.appendChild(
                        row
                    );
                }
            );
    }

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }