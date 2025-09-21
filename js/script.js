document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const draggableItems = document.querySelectorAll('.item-image');
    const dropZones = document.querySelectorAll('.drop-zone');
    const itemInfo = document.querySelector('.item-info');
    const hearts = document.querySelectorAll('.fa-heart');
    const winPanel = document.querySelector('.win-panel');
    const losePanel = document.querySelector('.lose-panel');
    const restartButtons = document.querySelectorAll('.restart-btn');
    
    // Crear elementos de audio
    const correctSound = new Audio('../resources/correct.mp3'); 
    const wrongSound = new Audio('../resources/incorrect.mp3');     

    // Variables
    let incorrectAttempts = 0;
    const maxAttempts = 3;
    let correctPlacements = 0;
    const totalItems = 20;

    // Configurar sonidos
    correctSound.volume = 0.7;
    wrongSound.volume = 0.7;
    
    // Precargar sonidos (opcional)
    function preloadSounds() {
        correctSound.load();
        wrongSound.load();
    }

    // Llamar a la precarga de sonidos
    preloadSounds();

    // Funcionalidad de arrastrar y soltar 
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
        item.addEventListener('mouseover', showInfo);
        item.addEventListener('mouseout', hideInfo);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', drop);
    });
    
    // Botones de reinicio
    restartButtons.forEach(button => {
        button.addEventListener('click', resetGame);
    });
    
    function dragStart(e) {
        if (!e.target.classList.contains('placed')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        } else {
            e.preventDefault();
        }
    }
    
    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }
    
    function dragLeave() {
        this.classList.remove('drag-over');
    }
    
    function drop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.querySelector(`.item-image[data-id="${id}"]`);
        const correctIds = this.getAttribute('data-correct').split(","); 
        
        if (this.querySelector('.item-image')) {
            return;
        }
        
        if (correctIds.includes(id)) {
            // Reproducir sonido de acierto
            correctSound.currentTime = 0;
            correctSound.play();

            // Colocar el elemento
            const clone = draggable.cloneNode(true);
            clone.classList.add('placed');
            clone.style.position = 'static';
            clone.style.transform = 'scale(1)';
            clone.style.cursor = 'default';
            clone.style.margin = '0';
            this.appendChild(clone);
            
            draggable.style.visibility = 'hidden';
            this.classList.add('correct');
            
            correctPlacements++;
            
            // Comprobar victoria
            if (correctPlacements === totalItems) {
                setTimeout(() => {
                    showWinPanel();
                }, 500);
            }
        } else {
            // Reproducir sonido de error
                wrongSound.currentTime = 0;
                wrongSound.play();

            // Sacudida de pantalla
            const gameContainer = document.querySelector('.game-container');
            gameContainer.classList.add('screen-shake');
            this.classList.add('incorrect');
            
            incorrectAttempts++;
            
            // Actualizar corazones
            if (incorrectAttempts <= hearts.length) {
                hearts[hearts.length - incorrectAttempts].style.color = 'gray';
            }
            
            // Comprobar derrota
            if (incorrectAttempts >= maxAttempts) {
                setTimeout(() => {
                    showLosePanel();
                }, 500);
            }
            
            setTimeout(() => {
                this.classList.remove('incorrect');
                gameContainer.classList.remove('screen-shake');
            }, 500);
        }
    }

    
    function showWinPanel() {
        winPanel.style.display = 'flex';
    }
    
    function showLosePanel() {
        losePanel.style.display = 'flex';
    }
    
    function hidePanels() {
        winPanel.style.display = 'none';
        losePanel.style.display = 'none';
    }
    
    function resetGame() {
        hidePanels();
        
        dropZones.forEach(zone => {
            zone.classList.remove('correct', 'incorrect');
            const placedItem = zone.querySelector('.item-image');
            if (placedItem) {
                zone.removeChild(placedItem);
            }
        });
        
        draggableItems.forEach(item => {
            item.style.visibility = 'visible';
        });
        
        // Reiniciar contadores
        incorrectAttempts = 0;
        correctPlacements = 0;
        
        // Restaurar corazones
        hearts.forEach(heart => {
            heart.style.color = 'red';
        });
    }
    
    function showInfo(e) {
        if (!e.target.classList.contains('placed')) {
            const info = e.target.getAttribute('data-info');
            if (info) {
                itemInfo.textContent = info;
                itemInfo.style.display = 'block';
                itemInfo.style.left = (e.pageX + 15) + 'px';
                itemInfo.style.top = (e.pageY + 15) + 'px';
            }
        }
    }
    
    function hideInfo() {
        itemInfo.style.display = 'none';
    }
    
    // Mezclar aleatoriamente los instrumentos
    const itemsContainer = document.getElementById("bottom-container");
    const items = Array.from(itemsContainer.children);

    // Algoritmo Fisher-Yates
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Limpiar y pone en aleatorio
    items.forEach(item => itemsContainer.appendChild(item));

    const style = document.createElement('style');
    style.textContent = `
        .drop-zone.correct {
            background-color: rgba(67, 160, 71, 0.3) !important;
            border: 2px solid #2e7d32 !important;
        }
        
        .drop-zone .placed {
            max-width: 90% !important;
            max-height: 90% !important;
            object-fit: contain;
        }
        
        @keyframes screenShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .screen-shake {
            animation: screenShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
});