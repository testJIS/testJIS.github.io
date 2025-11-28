document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DONNÉES ---

    const testimonialsData = [
        { quote: "Une équipe réactive et compétente. Le livrable est parfait.", author: "Jean Dupont", role: "CTO, TechStart" },
        { quote: "Excellent travail sur notre prototype électronique.", author: "Marie Curie", role: "Directrice R&D" },
        { quote: "Un audit pertinent qui a sauvé notre infrastructure.", author: "Alan Turing", role: "Expert Sécurité" }
    ];

    const projectsData = [
        {
            id: 1, 
            title: "Application Mobile Sport & IoT",
            summary: "App connectée React Native",
            description: "Développement complet d'une application mobile cross-platform (iOS/Android) connectée en Bluetooth Low Energy à des capteurs sportifs. Visualisation des données en temps réel et synchronisation Cloud.",
            tags: ["React Native", "Bluetooth", "IoT"]
        },
        {
            id: 2, 
            title: "Refonte Site E-commerce",
            summary: "Migration Symfony & Performance",
            description: "Migration d'une boutique Prestashop vers une solution sur-mesure Symfony. Optimisation du tunnel de vente (+20% de conversion) et connexion API avec l'ERP du client pour la gestion des stocks.",
            tags: ["Symfony", "Web", "Performance"]
        },
        {
            id: 3, 
            title: "Système Embarqué Autonome",
            summary: "PCB & Microcontrôleur",
            description: "Conception et routage d'une carte électronique (PCB) pour un drone agricole. Programmation du microcontrôleur STM32 pour la gestion des capteurs d'humidité et l'autonomie énergétique.",
            tags: ["Électronique", "C++", "PCB"]
        },
        {
            id: 4, 
            title: "Étude de Marché IA",
            summary: "Analyse Data & Stratégie",
            description: "Analyse concurrentielle approfondie pour une startup dans l'IA générative. Étude quantitative sur 500 prospects et recommandations stratégiques pour le lancement produit.",
            tags: ["Conseil", "Data", "Marketing"]
        }
    ];


    // --- 2. FONCTION AUTO-SCAN AVEC CHECK SCROLL ---
    async function autoLoadImages(folderPath, trackId, maxImages = 20) {
        const track = document.getElementById(trackId);
        if (!track) return;

        let loadedCount = 0;

        for (let i = 1; i <= maxImages; i++) {
            const imgName = `${i}.png`; // Format PNG
            const imgPath = `${folderPath}/${imgName}`;
            
            const exists = await new Promise((resolve) => {
                const img = new Image();
                img.src = imgPath;
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            });

            if (exists) {
                const div = document.createElement('div');
                div.className = 'carousel-logo';
                div.innerHTML = `<img src="${imgPath}" alt="Logo Partenaire">`;
                track.appendChild(div);
                loadedCount++;
            } else {
                if(i > 1) break; 
            }
        }
        
        if (loadedCount > 0) {
            addArrows(track.parentElement);
            checkScroll(track.parentElement); // Vérifier si on doit afficher les flèches
        }
    }

    // Fonction pour vérifier si ça dépasse
    function checkScroll(container) {
        const track = container.querySelector('.carousel-track');
        if(!track) return;
        if (track.scrollWidth > container.clientWidth) {
            container.classList.add('has-scroll');
        } else {
            container.classList.remove('has-scroll');
        }
    }

    window.addEventListener('resize', () => {
        document.querySelectorAll('.carousel-view').forEach(c => checkScroll(c));
    });


    // --- 3. LOGIQUE RÉALISATIONS ---
    const projectsList = document.getElementById('projects-list');
    const previewTitle = document.getElementById('preview-title');
    const previewDesc = document.getElementById('preview-desc');
    const previewTags = document.getElementById('preview-tags');
    const previewImg = document.getElementById('preview-img');

    function initProjects() {
        if(!projectsList) return;

        projectsData.forEach((proj, index) => {
            const item = document.createElement('div');
            item.className = `project-item ${index === 0 ? 'active' : ''}`;
            item.innerHTML = `<h4>${proj.title}</h4><p>${proj.summary}</p>`;
            
            item.addEventListener('click', () => {
                updatePreview(index);
                document.querySelectorAll('.project-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });

            projectsList.appendChild(item);
        });
        updatePreview(0);
    }

    function updatePreview(index) {
        const proj = projectsData[index];
        const previewContainer = document.getElementById('project-preview');
        previewContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            previewTitle.textContent = proj.title;
            previewDesc.textContent = proj.description;
            previewImg.src = `images/realisations/${proj.id}.png`;
            previewTags.innerHTML = proj.tags.map(t => `<span>#${t}</span>`).join('');
            previewContainer.style.opacity = '1';
        }, 200);
    }


    // --- 4. CAROUSELS ---
    function initTestimonials() {
        const track = document.getElementById('testimonials-track');
        if(!track) return;
        track.innerHTML = testimonialsData.map(t => `
            <div class="testimonial-item">
                <p>"${t.quote}"</p>
                <div style="margin-top:15px; font-weight:bold; color:#1a2a6c">${t.author}</div>
                <div style="font-size:0.85rem; color:#666">${t.role}</div>
            </div>
        `).join('');
        addArrows(track.parentElement);
        checkScroll(track.parentElement);
    }

    function addArrows(container) {
        if(container.querySelector('.carousel-nav')) return;
        
        const left = document.createElement('div'); left.className = 'carousel-nav nav-left'; left.innerHTML = '<i class="fas fa-chevron-left"></i>';
        const right = document.createElement('div'); right.className = 'carousel-nav nav-right'; right.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        container.appendChild(left);
        container.appendChild(right);
        
        const track = container.querySelector('.carousel-track');
        right.addEventListener('click', () => track.scrollBy({ left: 300, behavior: 'smooth' }));
        left.addEventListener('click', () => track.scrollBy({ left: -300, behavior: 'smooth' }));
    }

    // --- EXECUTION ---
    initProjects();
    initTestimonials();
    autoLoadImages('images/entreprises', 'company-track');
    autoLoadImages('images/partenaires', 'partners-track');

    // Formulaire
    const form = document.getElementById('plaquetteForm');
    const pdfLink = document.querySelector('.direct-pdf-link');
    const msgDiv = document.getElementById('formMessage');

    if (form && pdfLink) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Envoi...';
            btn.disabled = true;

            setTimeout(() => {
                pdfLink.click();
                msgDiv.style.display = 'block';
                msgDiv.textContent = 'Plaquette ouverte dans un nouvel onglet !';
                btn.innerHTML = originalText;
                btn.disabled = false;
                form.reset();
                setTimeout(() => { msgDiv.style.display = 'none'; }, 4000);
            }, 1000);
        });
    }

    // Burger & FAQ
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if(burger){
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    document.querySelectorAll('.accordion-header').forEach(acc => {
        acc.addEventListener('click', () => {
            acc.parentElement.classList.toggle('active');
            const panel = acc.nextElementSibling;
            if (acc.parentElement.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
});