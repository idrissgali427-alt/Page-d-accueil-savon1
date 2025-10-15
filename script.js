document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONCTIONNALITÉ : AFFICHAGE DE LA DATE ET HEURE EN TEMPS RÉEL ---
    
    function updateDateTime() {
        const dateTimeElement = document.getElementById('date-time');
        if (!dateTimeElement) return;

        // Récupère l'heure actuelle
        const now = new Date();
        
        // Options de formatage en français pour la date 
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('fr-FR', dateOptions);
        
        // Options de formatage en français pour l'heure
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedTime = now.toLocaleTimeString('fr-FR', timeOptions);
        
        // Mise à jour de l'élément HTML avec l'icône de calendrier
        dateTimeElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate} | ${formattedTime}`;
    }

    // Lance la fonction immédiatement, puis toutes les secondes pour l'horloge
    updateDateTime();
    setInterval(updateDateTime, 1000);


    // --- 2. FONCTIONNALITÉ : AFFICHAGE DE LA MÉTÉO DE BRAZZAVILLE ---

    // Ville définie pour la requête API
    const city = "Brazzaville"; 
    
    // !!! INSTRUCTION IMPORTANTE !!!
    // REMPLACER "VOTRE_CLE_API_METEO" par une clé réelle (OpenWeatherMap est recommandé)
    const apiKey = "VOTRE_CLE_API_METEO";
    
    // URL de l'API OpenWeatherMap, demandant des unités métriques et la langue française
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    async function fetchWeather() {
        const weatherElement = document.getElementById('weather-info');
        
        // Vérifie si la clé API a été mise à jour
        if (!weatherElement || apiKey === "VOTRE_CLE_API_METEO") {
            weatherElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Météo: Clé API manquante!';
            return;
        }

        try {
            const response = await fetch(apiUrl);
            
            // Si la réponse n'est pas OK (ex: clé invalide, ville non trouvée)
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - Vérifiez la Clé API.`);
            }
            
            const data = await response.json();

            // Extrait et formate les données
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const weatherMain = data.weather[0].main.toLowerCase();

            // Détermine l'icône Font Awesome à utiliser
            let iconClass = 'fas fa-cloud';
            if (weatherMain.includes('clear')) {
                iconClass = 'fas fa-sun';
            } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
                iconClass = 'fas fa-cloud-showers-heavy';
            } else if (weatherMain.includes('snow')) {
                iconClass = 'fas fa-snowflake';
            } else if (weatherMain.includes('thunderstorm')) {
                iconClass = 'fas fa-bolt';
            }
            
            // Affiche la météo mise à jour
            weatherElement.innerHTML = `<i class="${iconClass}"></i> ${temp}°C, ${description} (${city})`;

        } catch (error) {
            console.error("Erreur de récupération de la météo:", error);
            weatherElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Météo: Échec du chargement`;
        }
    }

    // Lance la récupération de la météo au chargement de la page
    fetchWeather();
    // OPTIONNEL : Rafraîchir toutes les 15 minutes (900000 ms) pour avoir des données à jour :
    // setInterval(fetchWeather, 900000); 

});