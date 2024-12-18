// ============================================================================================================================
// MENU RESPONSIVE TOGGLE
// ============================================================================================================================

var menu = document.querySelector('.menu');
var menu_toggle = document.querySelector('.menu_toggle');

menu_toggle.onclick = function() {
    menu_toggle.classList.toggle('active');
    menu.classList.toggle('responsive');
}

// ============================================================================================================================
// OPTION - CLASH OF CLAN
// ============================================================================================================================

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to the clicked button and corresponding content
        button.classList.add('active');
        const target = button.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
});


// ============================================================================================================================
// OPTION - RECRUTEMENT
// ============================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".clanGridContainer");
    const buttons = document.querySelectorAll('.tab-recrutement');

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/~~(.*?)~~/g, "<del>$1</del>");
    }

    function extractDiscordLink(text) {
        const discordRegex = /https?:\/\/(www\.)?discord\.(gg|io|me|li|com)\/[^\s]+/g;
        const matches = text.match(discordRegex);
        return matches ? matches[0] : null;
    }

    async function fetchClans() {
        try {
            const response = await fetch('/api/clans');
            const result = await response.json();

            container.innerHTML = '';
            if (result.status === "success" && result.data.length > 0) {
                const sortedClans = result.data.sort((a, b) =>
                    new Date(b.publication_date) - new Date(a.publication_date)
                );

                sortedClans.forEach(clan => {
                    const discordLink = extractDiscordLink(clan.description);
                    const publicationDate = new Date(clan.publication_date);
                    const hasBadgeServeur = clan.serveur_id === "278653494846685186";

                    const card = document.createElement('div');
                    card.classList.add('clanCard');
                    card.setAttribute('data-type', hasBadgeServeur ? 'new_clan' : 'family_clan');

                    card.innerHTML = `
                        <div class="clanImage">
                            <img src="Image/Autre/ClashOfClans.png" alt="Clan Image">
                            <div class="clanDate">🕒 ${formatTimeAgo(publicationDate)}</div>
                        </div>
                        <div class="clanAvatar">
                            <img src="${clan.clan_url_blason}" alt="Clan Blason">
                        </div>
                        ${
                            hasBadgeServeur 
                            ? `<div class="badgeServeurContainer">
                                <img class="badgeServeur" src="Image/Badge/Clash Of Clans Fr.png" alt="Badge Serveur">
                               </div>`
                            : ''
                        }
                        <div class="clanContent">
                            <h2 class="clanName">${clan.clan_name}</h2>
                            <h2 class="clanTitle">${clan.clan_id}</h2>
                            <p class="clanDescription">${formatMarkdown(clan.description)}</p>
                        </div>
                        <div class="clanBadges">
                            ${discordLink ? `<a href="${discordLink}" class="badge">Rejoindre Discord</a>` : ''}
                            <a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.clan_tag)}" class="badge">Rejoindre Clan</a>
                        </div>
                    `;
                    container.appendChild(card);
                });

                updateCardDisplay(); // Mettre à jour l'affichage après création des cartes
            } else {
                container.innerHTML = '<p style="color: red;">Aucun clan trouvé.</p>';
            }
        } catch (error) {
            console.error("Erreur :", error);
            container.innerHTML = '<p style="color: red;">Impossible de charger les clans.</p>';
        }
    }

    function updateCardDisplay() {
        const isNewClanActive = document.querySelector('[data-target="new_clan"]').classList.contains('active');
        const isFamilyClanActive = document.querySelector('[data-target="family_clan"]').classList.contains('active');

        const cards = document.querySelectorAll('.clanCard'); // Mise à jour dynamique

        cards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const hasBadgeServeur = cardType === 'new_clan';

            if (!isNewClanActive && hasBadgeServeur) {
                // Nouveau Clan désactivé => masquer les cartes avec badge
                card.style.display = 'none';
            } else if (!isNewClanActive && !isFamilyClanActive && cardType === 'family_clan') {
                // Aucun bouton actif => afficher les cartes sans badge (family_clan)
                card.style.display = 'block';
            } else if (isNewClanActive && cardType === 'new_clan') {
                card.style.display = 'block';
            } else if (isFamilyClanActive && cardType === 'family_clan') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60)) + 60;

        if (diffInMinutes <= 0) return "À l'instant";
        if (diffInMinutes < 60) return `${diffInMinutes} M`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} H`;
        return `${Math.floor(diffInMinutes / 1440)} J`;
    }

    // Boutons de filtrage
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active'); // Activer/désactiver
            updateCardDisplay();
        });
    });

    fetchClans(); // Récupérer et afficher les clans
});



// Ctrl + / ---> METTRE EN COMMENTAIRE / NE PLUS METTRE EN COMMENTAIRE
