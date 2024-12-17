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

    
    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Gras: **texte**
            .replace(/\*(.*?)\*/g, "<em>$1</em>")           // Italique: *texte*
            .replace(/__(.*?)__/g, "<u>$1</u>")            // Souligné: __texte__
            .replace(/~~(.*?)~~/g, "<del>$1</del>");       // Barré: ~~texte~~
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
            console.log(result); 
    
            container.innerHTML = '';
            if (result.status === "success" && result.data.length > 0) {

                const sortedClans = result.data.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
    
                sortedClans.forEach(clan => {
                    const discordLink = extractDiscordLink(clan.description);
                    const card = document.createElement('div');
                    card.classList.add('clanCard');
                
                    // Construction de la carte
                    card.innerHTML = `
                        <div class="clanImage">
                            <img src="Image_Recrutement_Clans/AccueilClans.png" alt="Clan Image">
                            <div class="clanDate"><span class="icon">🕒</span> ${formatTimeAgo(new Date(clan.publication_date))}</div>
                        </div>
                        <div class="clanContent">
                            <h2 class="clanTitle">${clan.clan_id}</h2>
                        </div>
                        <div class="clanBadges">
                            ${
                                discordLink 
                                ? `<a href="${discordLink}" target="_blank" class="badge">Rejoindre Discord</a>
                                   <a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.clan_tag)}" target="_blank" class="badge">Rejoindre Clan</a>`
                                : `<a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.clan_tag)}" target="_blank" class="badge">Rejoindre Clan</a>`
                            }
                        </div>
                    `;
                
                    // Gestion de la description avec format Markdown
                    const description = document.createElement('p');
                    description.classList.add('clanDescription');
                    description.innerHTML = formatMarkdown(clan.description);
                
                    // Ajout de la description au bon endroit
                    card.querySelector('.clanContent').appendChild(description);
                
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = '<p style="color: red;">Aucun clan trouvé.</p>';
            }
        } catch (error) {
            console.error("Erreur :", error);
            container.innerHTML = '<p style="color: red;">Impossible de charger les clans.</p>';
        }
    }    
    fetchClans();
});

// Fonction pour formater la date en temps écoulé
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}m`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} M`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} H`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} J`;
    }
}



// Ctrl + / ---> METTRE EN COMMENTAIRE / NE PLUS METTRE EN COMMENTAIRE
