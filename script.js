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

    async function fetchClans() {
        try {
            const response = await fetch('/api/clans');
            const result = await response.json();
            console.log(result); // Debugging

            container.innerHTML = '';
            if (result.status === "success" && result.data.length > 0) {
                result.data.forEach(clan => {
                    const card = document.createElement('div');
                    card.classList.add('clanCard');
                    card.innerHTML = `
                        <div class="clanDate">${new Date(clan.publication_date).toLocaleString()}</div>
                        <div class="clanContent">
                            <h2 class="clanTitle">#${clan.clan_id}</h2>
                            <p class="clanDescription">${clan.description}</p>
                        </div>
                        <div class="clanBadges">
                            <span class="badge">Actif</span>
                            <span class="badge">Guerres</span>
                            <span class="badge">Sérieux</span>
                        </div>
                    `;
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
