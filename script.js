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

    // Fonction pour formater le texte Markdown
    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/~~(.*?)~~/g, "<del>$1</del>");
    }

    // Extraire le lien Discord
    function extractDiscordLink(text) {
        const discordRegex = /https?:\/\/(www\.)?discord\.(gg|io|me|li|com)\/[^\s]+/g;
        const matches = text.match(discordRegex);
        return matches ? matches[0] : null;
    }

    // Récupérer et afficher les clans
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
                    const hasBadgeElchiki = clan.serveur_id === "658055075553476618";
                    const hasBadgeNouveau = clan.membre_clan <= 15; // Nouveau Clan si membres <= 15
                    const badgeFamilleDeClan = clan.clan_id && clan.description.includes('#') && 
                        !clan.description.includes(clan.clan_id); // Vérifie si un autre ID est dans la description
                    
                    // Déterminer le type pour l'attribut data-type
                    let cardType = 'default_clan';
                    if (hasBadgeNouveau) cardType = 'new_clan';
                    else if (badgeFamilleDeClan) cardType = 'family_clan';
    
                    const card = document.createElement('div');
                    card.classList.add('clanCard');
                    card.setAttribute('data-type', cardType);
    
                    // Génération dynamique des badges
                    const badgeHTML = `
                        ${badgeFamilleDeClan ? `
                            <div class="badgeWrapper">
                                <img class="badgeFamilleDeClan" src="Image/Badge/Famille De Clans.png" alt="Famille De Clan">
                                <span class="badgeTooltip">Famille De Clan</span>
                            </div>
                        ` : ''}
                    
                        ${hasBadgeNouveau ? `
                            <div class="badgeWrapper">
                                <img class="badgeNouveau" src="Image/Badge/Blason Coc.png" alt="Badge Nouveau">
                                <span class="badgeTooltip">Nouveau Clan</span>
                            </div>
                        ` : ''}
                    
                        ${hasBadgeServeur ? `
                            <div class="badgeWrapper">
                                <img class="badgeServeur" src="Image/Badge/Clash Of Clans Fr.png" alt="Badge Serveur">
                                <span class="badgeTooltip">Serveur</span>
                            </div>
                        ` : ''}
                    
                        ${hasBadgeElchiki ? `
                            <div class="badgeWrapper">
                                <img class="badgeServeur" src="Image/Badge/Elchiki.png" alt="Elchiki Serveur">
                                <span class="badgeTooltip">Elchiki</span>
                            </div>
                        ` : ''}
                    `;
                
                    card.innerHTML = `
                        <div class="clanImage">
                            <img src="Image/Autre/ClashOfClans.png" alt="Clan Image">
                            <div class="clanDate">🕒 ${formatTimeAgo(publicationDate)}</div>
                        </div>
                        <div class="clanAvatar">
                            <img src="${clan.clan_url_blason}" alt="Clan Blason">
                        </div>
                        ${hasBadgeNouveau || hasBadgeServeur || badgeFamilleDeClan ? `
                            <div class="badgeServeurContainer">
                                ${badgeHTML}
                            </div>
                        ` : ''}                        
                        <div class="clanContent">
                            <h2 class="clanName">${clan.clan_name}</h2>
                            <h2 class="clanTitle">${clan.clan_id}</h2>
                            <div class="clanDescription">${formatMarkdown(clan.description)}</div>
                        </div>
                        <div class="clanBadges">
                            ${discordLink ? `<a href="${discordLink}" class="badge">Rejoindre Discord</a>` : ''}
                            <a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.clan_tag)}" class="badge">Rejoindre Clan</a>
                        </div>
                    `;
                    container.appendChild(card);
                });
    
                updateCardDisplay(); // Mettre à jour l'affichage des cartes après le chargement
            } else {
                container.innerHTML = '<p style="color: red;">Aucun clan trouvé.</p>';
            }
        } catch (error) {
            console.error("Erreur :", error);
            container.innerHTML = '<p style="color: red;">Impossible de charger les clans.</p>';
        }
    }
    

    // Filtrer l'affichage des cartes
    function updateCardDisplay() {
        const isNewClanActive = document.querySelector('[data-target="new_clan"]').classList.contains('active');
        const isFamilyClanActive = document.querySelector('[data-target="family_clan"]').classList.contains('active');

        container.querySelectorAll('.clanCard').forEach(card => {
            const cardType = card.getAttribute('data-type');
            const isNewClan = cardType === 'new_clan';
            const isFamilyClan = cardType === 'family_clan';

            // Masquer les cartes si les boutons ne sont pas actifs
            if (!isNewClanActive && isNewClan) {
                card.style.display = 'none'; // Masquer les nouveaux clans si le bouton est désactivé
            } else if (!isFamilyClanActive && isFamilyClan) {
                card.style.display = 'none'; // Masquer les familles de clan si le bouton est désactivé
            } else if (!isNewClanActive && !isFamilyClanActive && cardType === 'default_clan') {
                card.style.display = 'flex'; // Afficher les clans par défaut si aucun bouton n'est actif
            } else if (isNewClanActive && isNewClan) {
                card.style.display = 'flex'; // Afficher les nouveaux clans si le bouton est activé
            } else if (isFamilyClanActive && isFamilyClan) {
                card.style.display = 'flex'; // Afficher les familles de clan si le bouton est activé
            } else {
                card.style.display = 'flex'; // Par défaut, afficher les cartes restantes
            }
        });
    }


    // Formater le temps écoulé
    function formatTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60)) + 60;

        if (diffInMinutes <= 0) return "À l'instant";
        if (diffInMinutes < 60) return `${diffInMinutes} M`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} H`;
        return `${Math.floor(diffInMinutes / 1440)} J`;
    }

    // Ajouter des écouteurs d'événements pour les boutons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active'); // Active/désactive le bouton
            updateCardDisplay(); // Met à jour l'affichage des cartes
        });
    });

    // Appel initial pour récupérer et afficher les clans
    fetchClans();
});




// Ctrl + / ---> METTRE EN COMMENTAIRE / NE PLUS METTRE EN COMMENTAIRE
